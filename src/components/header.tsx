'use client';
import { user } from "@/app/stores/user";

export default async function Header() {
    return(<header id="header">
		<div className="title">LoboApp</div>
		<nav>
			<ul>
				<li><a href="dashboard.html">Dashboard</a></li>
				<li><a href="reservas.html">Reservar Espacio</a></li>
				<li><a href="mis-reservas.html" className="active">Mis Reservas</a></li>
				<li><a href="admin.html">Administración</a></li>
				<li><a href="#" /*onClick={}*/>Cerrar Sesión</a></li>
			</ul>
		</nav>
	</header>)
}