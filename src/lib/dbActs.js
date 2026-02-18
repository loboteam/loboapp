import sb from "./.env/sb.js";

const getSalasActivas = ()=>sb.schema("public").from("reservas").select("user,from,to,salas()").neq("done",true).neq("cancelled", true).gte("from", Date.now() * 1000);
const cancelarSala = sid=>sb.schema("public").from("salas").update({ down: true }).eq("sala",sid);
const crearReservación = (sala, user, from, to)=>sb.schema("public").from("reservas").upsert({user, sala, from, to});
const cancelarReservación = (sala, user, from)=>sb.schema("public").from("reservas").update({ cancelled: true }).eq("sala", sala).eq("user", user).eq("from", from);