import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useState } from "react";

Modal.setAppElement('#root')
export default function Home() {

	const { customStyles, handleClickModal, modal, handleSetTime } = useSchool();
	const [ searchStudent, setSearchStudent ] = useState(0);

	const days = [
					{id:1	, label:"Monday"},
					{id:2	, label:"Tuesday"},
					{id:3	, label:"Wednesday"},
					{id:4	, label:"Thursday"},
					{id:5	, label:"Friday"},
					{id:6	, label:"Saturday"},
					{id:7	, label:"Sunday"}
	 			];

	const hours = [7, 8, 9, 10, 11];
	const clases = [
				{day: 1, hour: '7.15',  last: 90, ends: '8.10',  height:'h-20', student_id: 1, student: 'Diego Hernández Hernández'},
				{day: 3, hour: '9.00',  last: 60, ends: '10.00', height:'h-20', student_id: 3, student: 'Marcela Alejandra Perez Briones Briones Briones' },
				{day: 2, hour: '11.00', last: 60, ends: '12.00', height:'h-20', student_id: 2, student: 'Carolina Alvarado Estudillo'},
				{day: 5, hour: '10.00',  last: 90, ends: '11.00',  height:'h-20', student_id: 1, student: 'Diego Hernández Hernández'},
			];

	const handleSetSearch = (match) => {
		setSearchStudent(match['match'].student_id)
	}

	const blocksPerHr = 6;
	let print = 0;
	let matchActive = 0;
	let matchEnds = 0;
	return (
		<>
			<div className="grid grid-cols-8 gap-4">
				{/* Columna fija de horas */}
				<div className="w-20">
					<div className="text-center font-semibold bg-gray-300 
									p-1 rounded">
						Hora
					</div>
					{hours.map((hour) =>(
						<div
							key={hour}
							className="text-center h-20 font-medium
										bg-gray-200 my-0.5 rounded"
						>
							{hour}:00
						</div>
					))}
				</div>

				{/* Columnas por día */}
				{days.map((day) => (
					<div 
						key = {day.id}
						className="grid hover:bg-indigo-200"
					>
						<div className="text-center h-8 font-semibold
									 bg-gray-300 rounded">
							{day.label}
						</div>
						
						{/* Filas por hora */}
						{hours.map((hour) => (
							// Simulamos un arreglo con Array.from({ length: blocksPerHr })
							// para crear subBloques y dividir en 6 cada bloque de 1Hr
							// la variable value no se utiliza pero es necesaria para
							// poder definir el contador i
							Array.from({ length: blocksPerHr }).map((value, i) => {

								// Cada ciclo multiplica al contador *10 
								// para obtener minutos en serie de 10 
								// padStart es para rellenar un string 
								// desde la izquierda hasta completar 2 cifras 
								// lo necesitamos para que cuando el contador sea = 0 
								// nos de una cadena '00' en lugar de '0' 
								// la cual podremos comparar más adelante
								const minute = String(i * 10).padStart(2, '0');
								const minuteMatch = i * 10;

								// VALIDAR SI EL CICLO ACTUAL ES INICIO DE CLASE
								// Comparamos la hora de inicio de las clases con la hora actual
								const match = clases.find(cls => {
												const [h, m] = cls.hour.split('.').map(Number);

												//Con esta instruccion definimos el bloque en el que empieza
												//por ejemplo 07:13, 13 lo dividimos entre 10 nos da .13 
												// y al multiplicar por 10 nos da 10 al redondear con Math.floor
												const blockStart = Math.floor(m / 10) * 10;

											//Para el resultado comparamos la hora de la clase 
											// con la hora actual del ciclo 
											// el minuto actual del ciclo (minuteMatch) con el resultado de blockStart
											return h === hour && blockStart === minuteMatch && cls.day === day.id;
											}) ?? null;


								let classHeight = match ? match.height : 'h-20';
								const isHighLighted = match && searchStudent == match.student_id ? 1 : 0;
								//console.log('searchStudent')
								//console.log(searchStudent)
								//Si tenemos match activamos matchActive
								//Para que en el siguiente ciclo no se imprima nada
								//y obtenemos el matchEnds de la clase.
								if(match){
 									matchActive = 1;
									matchEnds	= match.ends
								}else{
									//En caso de que no tengamos un match 
									// validamos si en el ciclo actual estamos 
									// renderizando una clase (matchActive) 
									// y tambien validamos si estamos en un minuto 0 
									// por ejemplo 9:00, 10:00, 11:00...
									// print definirá si se renderiza una clase vacía
									print = matchActive == 0 && minute == 0 ? 1 : 0;
								}

								//DEFINIENDO EL CLASS-ENDS
								//Vamos a imprimir un class vacio en el siguiente ciclo
								//por ejemplo si la clase termino a las 9:30
								//imprimiremos una clase vacia a las 9:40.
								if(matchActive){
									const classEnds = matchEnds == hour +'.'+ minute ? 1 : 0

									if(classEnds) {
										//Si el ciclo actual coincide con un classEnds
										//desactivamos el matchActive  y activamos el print
										//para imprimir ahora una clase vacía
										print = 1;
										matchActive = 0;

										//DEFINIENDO ALTURA DE CLASE VACÍA 
										// (DESPUÉS DE FIN DE CLASE)
										//Exluimos el 00 porque ese caso 
										// ya tiene un alto definido previamente ('h-20')
										if(minute != '00'){
										// Definimos la altura en cuestión del minuto en el que 
										// nos encontramos
										// Ejemplo: si la clase termina a las 8:20
										// el siguiente bloque tendrá class classHeight = 'h-15' 
										// así estaremos representando el espacio que queda 
										// entre las 8:20 y las 9:00
												 if(minute <= 10){ classHeight = 'h-16' }
											else if(minute <= 20){ classHeight = 'h-15' }
											else if(minute <= 30){ classHeight = 'h-10' }
											else if(minute <= 40){ classHeight = 'h-7' }
											else if(minute <= 50){ classHeight = 'h-5' } 											
										}
									
									// Si ya llegamos al límite de la columna 
									// reseteamos los valores de print y matchActive
									//QUE PASARÍA SI UNA CLASE EMPIEZA A LAS 23:00 
									// Y TERMINA A LAS 1:30 ???
									}else if(hour +'.'+ minute == '11.50'){
										print = 0;
										matchActive = 0;
									}
								}

								//IMPRIMIR UNA CLASE VACIA
								if(print && matchActive == 0){
									//DEFINIR ALTURA DE CLASE VACIA
									//(ANTES DE INICIO DE LA SIGUIENTE CLASE)
									//obtenemos solo la hora de la clase en caso
									//de que coincida con la hora del ciclo actual
									const nextClass = clases.filter(cls => cls.hour.split('.')[0] == hour
																	&& cls.day === day.id);

									if(nextClass[0]){
										// Obtenemos el el minuto en el que iniciará 
										// la siguiente clase
										const startMinute = nextClass[0].hour.split('.')[1];

										// Definimos la altura que tendrá el cuadro de clase vacía
										// tomando como referencia el minuto en el que inicie la clase.
											 if(startMinute <= 10){ classHeight = 'h-4' }
										else if(startMinute <= 20){ classHeight = 'h-7' }
										else if(startMinute <= 30){ classHeight = 'h-10' }
										else if(startMinute <= 40){ classHeight = 'h-16' }
										else if(startMinute <= 50){ classHeight = 'h-18' }
									}
								}

								if(match || print){
									return(
										<Class 
											key  = {`${day.id}-${hour}-${minute}`}
											minute = { minute }
											hour = { hour }
											day  = { day }
											match  = { match }
											isHighLighted = { isHighLighted }
											classHeight = { classHeight }
											onClick = {() => {
												//handleClickModal(),
												handleSetTime({hour, day})
												handleSetSearch({match})
											}}
										/>
									)
								}
							})
						))}
					</div>
				))}
			</div>


				<Modal isOpen={modal} style={customStyles}>
						<ModalClass />
				</Modal>

		</>
	)
}
