export default function Class({onClick, minute, hour, day, isHighLighted, match, classHeight}) {

  //Formato para mostrar label cuando un cuadro está vacío
  const dayLabel 		  = day.label.slice(0,3);  
  const color 		    = match ? 'bg-red-500' : 'bg-gray-300'
  const hiddenStudent = match ? '' : 'hidden'
  const student 	= match ? match.student : '';
  const matchEnds = match ? ' - '+match.ends : '';

  //Get the numeric value of the class height
  const heightValue = Number(classHeight.replace('h-', ''));
  
  let hiddenDay = '';
  let hiddenHr  = '';

  if (!match && heightValue < 9) {
    hiddenDay = hiddenHr = 'hidden';
  } else if (match) {
    hiddenDay = 'hidden';
  }


  const borderHiglited = isHighLighted ? 'border-2 border-green-300' : '';

  const timeShow = match ? match.starts : hour+":"+minute;
  return (
    <>
      <div className={`${color}
               ${classHeight}
               ${borderHiglited}
              text-center
              align-middle border-t border-dashed
              hover:cursor-pointer hover:bg-blue-200`}
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
        <p className={`${hiddenHr} text-sm `}>{timeShow}{matchEnds}</p>
      </div>
    </>
  )
}
