import jwt from "jsonwebtoken";

// Clave para firmar y verificar los tokens. No hay valor por defecto: si falta JWT_SECRET
// cualquiera podría firmar tokens válidos con la clave pública "samplesecretkey".
export const jwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Falta la variable de entorno JWT_SECRET");
    return secret;
};

export const verifyServerSession = (authHeader: string | null) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, jwtSecret());
        return decoded;
    } catch (e) {
        // Puede lanzar error por expiración (TokenExpiredError) o por manipulación
        return null;
    }
};
