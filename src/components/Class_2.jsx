import { useMemo } from "react";
import useSchool from "../hooks/useSchool";


export default function Class({onClick, minute, hour, day}) {
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
	const dayLabel = day.label.slice(0,3);

	const clases = [
					{hour: 7.0, day: 1, last: 30, ends: 7.5},
					{hour: 7.5, day: 1, last: 90, ends: 9},
					{hour: 9, 	day: 1, last: 60, ends: 10}
				];

	const isClass = () => {
		const match = clases.filter(cls => String(cls.hour).split('.')[0] == hour && cls.day === day.id)

		return match;
	}


	let percentageTop = 'h-20';
	let percentageBottom = '';
	let color = 'bg-gray-100';
	let flexFirst = ""
	let displaySecond = "hidden"

	if (isClass().length){
		//Cambiar el color
		color = 'bg-red-300'

		//##################################
		//##################################
		//####### INICIO USEMEMO ###########
		//##################################
		//##################################
		const block = useMemo(() => {
			//cómo saber si es el segundo elemento el que se pasa de 1hr?
			//En caso de encontrar algo que hace crossHR 
			const isCrossHr = isClass().find(cls => String(cls.hour).split('.')[0] !== String(cls.ends).split('.')[0])


			


		})

		//const lastRange = (isClass().last / 60 ) * 100;

		const match = clases.filter(cls => String(cls.hour).split('.')[0] == hour && cls.day === day.id)

		const lastRange = isClass().map(cls => {

			//CALCULO DE ALTURA DE CLASE
			/**
			 * Calcular el porcentaje de minutos con respecto a 60 minutos
			 * Por ejemplo, si dura 30 minutos, será 50%
			 */
			const lastRange = (cls.last / 60 ) * 100;


			//determinar cuantas clases tiene una hora
			//si tiene 2, la primera va a medir h-10
			//la segunda puede medir más


			//SI LA HORA DE INICIO Y LA HORA FINAL CAMBIAN
			//EL SEGUNDO ELEMENTO PUEDE MEDIR MENOS

			if(lastRange <=50){
				percentageTop = 'h-10'
			}else{
				percentageBottom = 'h-20'
			}

			//Reiniciamos el valor de percentage
		})

		/**
		 * Calcular el porcentaje de altura con respecto a h-20
		 * Por ejemplo si hay 50% de minutos en una hora, solo pintaremos h-10
		 * */ 

	//	if(lastRange <=50){
	//		percentage = 'h-10'
	//	}

		//Si tenemos más de una clase, mostraremos el segundo div.
		if(isClass().length > 1){
			flexFirst = 'flex '
			displaySecond = "flex";
		}

		//console.log("cross"+crossHr)
		//if(crossHr){
		//	percentageTop = "h-10"
		//}


		//TERMINA CALCULO DE ALTO DE CLASE		
	}


	return (
		<>
			<div className={`${color}
							${percentageTop} 
							${flexFirst} 
							pt-1 text-center
							rounded hover:cursor-pointer hover:bg-blue-200`} 
				onClick={onClick}>
				<p className="font-bold text-transform: uppercase">
					{dayLabel}
				</p>
				<p>{hour}:{minute}</p>
			</div>
		</>
	)
}
