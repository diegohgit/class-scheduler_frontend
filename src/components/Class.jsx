export default function Class({onClick, minute, hour, day, match, classHeight}) {

  //Format day label to show it in empty spaces.
  const dayLabel 	= match ?? day?.label?.slice(0,3);
  const matchEnds = match ? ` - ${match.ends}` : '';
  const color 		= match?.color   ?? '#d1d5db';
  const student 	= match?.student ?? '';

  const showDay  = classHeight > 20 && !match ? true : false;
  const showTime = match ? (classHeight > 50 ? true : false) 
                         : (classHeight > 20 ? true : false);

  const startTime = match ? match.starts : hour+":"+minute;

  return (
    <>
      <div  style = {{backgroundColor:color,
                      height: classHeight+'px'}}
            className=" block text-center align-middle
                        border-t border-dashed
                        hover:cursor-pointer hover:bg-blue-200"
            onClick={onClick}>

        { match ? (
            <div className = "h-8/12">
              <span className = "h-full flex mx-1 text-sm items-center justify-center text-center">
                {student}
              </span>
            </div>
          ) : (
            showDay &&
            <span className="mr-1 font-bold leading-none text-transform:uppercase">
              {dayLabel}
            </span>
          )
        }
        { showTime &&
          <span className="text-sm mb-2">
            {startTime}{matchEnds}
          </span>
        }
      </div>
    </>
  )
}
