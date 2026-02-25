import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";


export default function Layout() {
  return (
	<>
		<div className="h-full md:flex">
			<Sidebar/>
			<main className="md:flex-1 h-screen overflow-y-scroll bg-indigo-10 p-3">
				{/** Importamos Outlet y agregamos <Outlet />
				 * para que se puedan importar los children 
				 * de este componente, los cuales se definieron en 
				 * el router
					*/}
				<Outlet />
			</main>
			<ToastContainer />
		</div>
	</>
  )
}