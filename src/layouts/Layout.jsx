import "react-toastify/dist/ReactToastify.css";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router";


export default function Layout() {
  return (
	<>
		<div className="h-full">
			<Topbar/>
			<main className="md:flex-1 h-screen overflow-y-scroll bg-indigo-10">
				{/* Show Layout's children using <Outlet />.*/}
				<Outlet />
			</main>
		</div>
	</>
  )
}