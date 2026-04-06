import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import sb from "@/lib/.env/sb";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres un asistente que interpreta búsquedas de salas universitarias en español.
Devuelve SOLO un JSON válido, sin markdown ni texto adicional.

Estructura: {"type":string|null,"cupo_min":number|null,"cupo_max":number|null,"edif":string|null,"explanation":string}

=== TIPOS DE SALA (valores exactos a usar) ===
- "Sala de Lectura": para estudiar, leer, trabajo en grupo, reuniones, trabajar en equipo, espacio de estudio, sala silenciosa, sala tranquila, sala colaborativa.
- "Lab. de Computación": laboratorio, computadoras, PCs, programar, cómputo, informática, sistemas, cibercafé, cómputo.
- "Sala de Descanso": descanso, break, relajarse, descansar, sala de recreo.
- null: si el usuario no menciona ningún uso específico o la búsqueda es solo por capacidad/ubicación.

=== EDIFICIOS (valores exactos) ===
- "H (Biblioteca)": biblioteca, edificio H, sala H, edificio de la biblioteca.
- "F": edificio F, laboratorios F, sala F.
- null: si no se menciona edificio o ubicación.

=== CAPACIDAD ===
REGLA: cupo_min = mínimo de personas que debe caber. cupo_max = máximo de personas que se desea.
- Número explícito "para X personas" → cupo_min: X
- "más de X" / "al menos X" / "mínimo X" → cupo_min: X
- "menos de X" / "máximo X" / "hasta X" → cupo_max: X
- "grande" / "amplia" / "espaciosa" / "grupo grande" / "muchos" → cupo_min: 20
- "mediana" / "grupo mediano" → cupo_min: 10
- "pequeña" / "íntima" / "pocos" / "par de personas" → cupo_max: 10
- Sin mención de tamaño → cupo_min: null, cupo_max: null

=== EJEMPLOS ===
"espacio grande para trabajo en grupo" → {"type":"Sala de Lectura","cupo_min":20,"cupo_max":null,"edif":null,"explanation":"Sala de lectura amplia para trabajo en grupo"}
"sala para estudiar tranquilo" → {"type":"Sala de Lectura","cupo_min":null,"cupo_max":null,"edif":null,"explanation":"Sala de lectura para estudio tranquilo"}
"laboratorio de computadoras en edificio F" → {"type":"Lab. de Computación","cupo_min":null,"cupo_max":null,"edif":"F","explanation":"Laboratorio de cómputo en Edificio F"}
"sala para menos de 5 personas" → {"type":null,"cupo_min":null,"cupo_max":5,"edif":null,"explanation":"Sala pequeña para hasta 5 personas"}
"sala para 15 personas en la biblioteca" → {"type":"Sala de Lectura","cupo_min":15,"cupo_max":null,"edif":"H (Biblioteca)","explanation":"Sala de lectura para 15 personas en la Biblioteca"}
"sala de descanso pequeña" → {"type":"Sala de Descanso","cupo_min":null,"cupo_max":10,"edif":null,"explanation":"Sala de descanso de capacidad reducida"}`;

export const POST = async (req: NextRequest) => {
    const body = await req.json().catch(() => null);
    if (!body?.query || typeof body.query !== "string" || body.query.length > 300) {
        return NextResponse.json({ error: "Consulta inválida" }, { status: 400 });
    }

    const chat = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_tokens: 150,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: body.query }
        ]
    });

    const raw = chat.choices[0]?.message?.content ?? "{}";
    let filters: { type?: string | null; cupo_min?: number | null; cupo_max?: number | null; edif?: string | null; explanation?: string };
    try {
        filters = JSON.parse(raw);
    } catch {
        return NextResponse.json({ error: "No se pudo interpretar la búsqueda. Intenta ser más específico." }, { status: 422 });
    }

    const hasFilter = filters.type || filters.cupo_min || filters.cupo_max || filters.edif;
    if (!hasFilter) {
        return NextResponse.json({ error: "No entendí qué buscar. Prueba con: tipo de sala, capacidad o ubicación." }, { status: 422 });
    }

    let query = sb.from("sala_data").select();
    if (filters.type) query = query.ilike("type", `%${filters.type}%`);
    if (filters.cupo_min) query = query.gte("cupo", filters.cupo_min);
    if (filters.cupo_max) query = query.lte("cupo", filters.cupo_max);
    if (filters.edif) query = query.ilike("location", `%${filters.edif}%`);

    const { data, error } = await query
        .order("type", { ascending: false })
        .order("number", { ascending: true });

    if (error) return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 });

    return NextResponse.json({ rooms: data, explanation: filters.explanation ?? "" });
};
