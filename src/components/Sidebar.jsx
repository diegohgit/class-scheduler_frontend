import Option from "./Option";

export default function Sidebar() {

	const options = [
						{id:1, label:"Schedule", route:"/"},
						{id:2, label:"Students", route:"/students"},
						{id:3, label:"Topics",	 route:"/topics"},
						{id:4, label:"Setings",	 route:"/setings"},
					];

  return (
	<aside className="bg-indigo-900 md:w-72">
		<div className="flex items-center justify-center">
			<img className="w-30"
				 src="img/logo.png" 
				 alt="Imagen logo"
			/>
		</div>
		<div className="mt-10">
			{
				options.map(option => (
					<Option 
						key = {option.id}
						option = {option}
					/>
				))
			}
		</div>
	</aside>
  )
}
