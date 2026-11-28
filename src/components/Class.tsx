import { Day, Class as TypeClass } from '../types/class.ts'

interface Props{ onClick : ()=>void;
                  minute : string;
                  hour   : string;
                  day    : Day;
                  match  : TypeClass|null;
                  ref    : React.Ref<HTMLDivElement>;
                  spaceHeight : string;
                }


export default function Class({ onClick,
                                minute,
                                hour,
                                day,
                                match,
                                spaceHeight,
                                ref }: Props)
{

  //Format day label to show it in empty spaces.
  const dayLabel:string = day?.label?.slice(0,3);

  const matchEnds    = match ? ` - ${match.ends}` : '';
  const color 		   = match?.color ?? '#e0e7ff';
  const first_name   = match?.first_name ?? '';
  const numberHeight = Number(spaceHeight); 
  //const last_name  = match?.last_name ?? '';

  const showDay  = numberHeight > 20 && !match;
  const showTime = match ? numberHeight > 50 : numberHeight > 20;

  const startTime = match ? match.starts : hour+":"+minute;



  return (
    <>
      <div  style = {{backgroundColor:color,
                      height: spaceHeight+'px'}}
            className=" w-[140px] text-center
                        border-t border-r  border-dashed border-white
                        hover:cursor-pointer hover:bg-sky-200!"
            onClick={onClick}
            ref={ref /* ref useful to scroll schedule to the current hour. */}
      >

        { match ? (
            <div className = "h-8/12">
              <span className = "h-full font-bold flex items-center justify-center text-center">
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
};
