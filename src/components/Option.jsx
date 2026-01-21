import { Link } from "react-router-dom"; 

export default function Option({option}) {
	//PENDIENTE: hacer las opciones de manera dinamica
	//			esto hará posible que un cliente pueda customizar sus opciones
	const buttonClasses = "text-lg text-center font-bold text-white cursor-pointer truncate";
	const optionClasses = "flex items-center gap-4 border w-full p-3 hover:bg-blue-500 cursor-pointer";
	const { label, route } = option;

	return (
		<>
			<Link
				to={route}
				className={buttonClasses}
				>
				<div className={optionClasses}>
					{label}
				</div>
			</Link>
		</>
	)
}
