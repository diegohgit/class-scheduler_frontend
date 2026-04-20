import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 

export default function Sidebar() {

  const options = [
            {label:"Schedule", route:"/"},
            {label:"Students", route:"/students"},
            {label:"Content",   route:"/content"},
          ];

  const [path, setPath] = useState('');

  //Mark active option when the component is mounted in case the user 
  // entered directly from a link without doing a click on the option.
  useEffect(() => {
    //Set the 3th segment from current url to the path state.
    const ref = window.location.href
    const segment = ref.split('/')[3];
    setPath("/"+segment);
  }, [])

  return (
  <div className="h-14 w-full flex 
                  z-10 fixed bg-indigo-900 ">
    <div className="flex mx-auto items-center">
      {
        options.map(option => (
          <Link
            key={option.label}
            to={option.route}
            className="text-lg text-center font-bold 
                    text-white cursor-pointer truncate"
            onClick={() => {setPath(option.route)}}
            >
            <div className="h-14 items-center w-full 
                            mr-4 hover:bg-blue-500 cursor-pointer">
              <div className="h-12 flex items-center">
                <p className="text-center w-full">{option.label}</p>
              </div>
              {/* Mark active option*/}
              <div className={`${path === option.route ? "bg-blue-500" : ""}
                              h-2 w-full `}></div>
            </div>
          </Link>
        ))
      }
    </div>
  </div>
  )
}
