export default function Class({onClick, minute, hour, day, isHighLighted, match, classHeight}) {
	/**
	 *-Hacer que cada cuadro se divida en 2
	 *-Cuando es una clase completa se mostrará solo 1
	 *-Cuando es una fraccion de clase se hará el cálculo 
	 *  para saber cuánto alto le toca a cada uno de los 2 cuadros
	 *-Cuando sean 3 clases o más, solo se mostrarán dos 
	 * y un boton para expandir el detalle completo de clases.
	 * 
	 * - Multiclase: guardar la duracion de la clase anterior en una variable de estado
	*/


	//Formato para mostrar label cuando un cuadro está vacío
	const dayLabel 		= day.label.slice(0,3);
	const color 		= match ? 'bg-red-500' : 'bg-gray-300'
	const hiddenStudent = match ? '' : 'hidden'
	const student 		= match ? match.student : '';
	const matchEnds 	= match ? ' - '+match.ends : '';

	let hiddenDay = '';
	if(match || classHeight == 'h-7' || classHeight == 'h-5' || classHeight == 'h-4'){
		hiddenDay = 'hidden';
	}

	const borderHiglited = isHighLighted ? 'border-2 border-green-300' : '';
	//console.log('borderHiglited')
	//console.log(borderHiglited)
	const timeShow = match ? match.hour : hour+":"+minute;
	return (
		<>
			<div className={`${color}
							 ${classHeight}
							 ${borderHiglited}
							text-center my-0.5
							align-middle 
							rounded hover:cursor-pointer hover:bg-blue-200`}
				onClick={onClick}>
				<div className={`${hiddenStudent}h-12`}>
					<p className={`${hiddenStudent} 
								  text-sm leading-none line-clamp-3`}>
						{student}
					</p>
				</div>

				<p className={`${hiddenDay} font-bold leading-none text-transform: uppercase`}>
					{dayLabel}
				</p>
				<p className="text-sm ">{timeShow}{matchEnds}</p>
			</div>
		</>
	)
}
