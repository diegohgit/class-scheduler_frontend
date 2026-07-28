export default function Class({onClick, minute, hour, day, match, spaceHeight}) {

  //Format day label to show it in empty spaces.
  const dayLabel 	 = match ?? day?.label?.slice(0,3);
  const matchEnds  = match ? ` - ${match.ends}` : '';
  const color 		 = match?.color   ?? '#d1d5db';
  const first_name = match?.first_name ?? '';
  //const last_name  = match?.last_name ?? '';

  const showDay  = spaceHeight > 20 && !match;
  const showTime = match ? spaceHeight > 50 : spaceHeight > 20;

  const startTime = match ? match.starts : hour+":"+minute;



  return (
    <>
      <div  style = {{backgroundColor:color,
                      height: spaceHeight+'px'}}
            className=" w-[140px] text-center
                        border-t border-r  border-dashed border-white
                        hover:cursor-pointer hover:bg-blue-200!"
            onClick={onClick}>

        { match ? (
            <div className = "h-8/12">
              <span className = "h-full flex mx-1 text-sm items-center justify-center text-center">
                {first_name}
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
