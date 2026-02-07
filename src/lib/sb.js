const getSalasActivas = ()=>sb.schema("public").from("salas").select().neq("active",false);
const cancelarSala = sid=>sb.schema("public").from("salas").update({ active: false }).eq("sala",sid);
//const crearReservación = (sid, uid, from, to, )