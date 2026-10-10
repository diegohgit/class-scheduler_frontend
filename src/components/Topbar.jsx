import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; 
import { handleLogout } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../hooks/useAuth";

export default function Sidebar() {



  //Routes and options shown in toolbar.
  const options = [
            {label:"Schedule", route:"/"},
            {label:"Students", route:"/students"},
            {label:"Content",   route:"/content"},
          ];



  const [path, setPath] = useState('');

  //Mark active option when the component is mounted in case the user 
  // entered directly from a link without doing a click on the option.
  useEffect(() => {

    const ref = window.location.href

    //Set the 4th segment from current url to the path state.
    const segment = ref.split('/')[4] ?? '';
    setPath("/"+segment);
  }, [])



  const [activeBubble, setActiveBubble] = useState(false);
  const bubbleRef = useRef(null);

  //Hide bubble dialog when user clicks outside of it.
  useEffect(() => {

    function handleClickOutside(event){
      
      if(bubbleRef.current && !bubbleRef.current.contains(event.target)){
        setActiveBubble(false);
      }
    }

    //Add the "mousedown" event listener to the document
    //if user does a mousedown on any part of document, run handleClickOutside()
    if(activeBubble){
      document.addEventListener("mousedown", handleClickOutside);
    }

    //Cleanup function
    return () => {document.removeEventListener("mousedown", handleClickOutside)};
  }, [activeBubble]);



  const handleBubble = () => {
    setActiveBubble((prev) => !prev)
  }



  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate('/login');
    }
  });



  return (
  <div className="h-14 w-full flex 
                  z-10 fixed 
                  bg-linear-to-tr from-blue-400 to-indigo-950 ">
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
              <div className={`${path === option.route ? "bg-sky-400" : ""}
                              h-2 w-full `}></div>
            </div>
          </Link>
        ))
      }
    </div>

    <div className="flex justify-end"
         ref={bubbleRef}
    >
      <button
        id="btnLogout"
        className="hover:cursor-pointer"
        onClick={handleBubble}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
             strokeWidth={2} stroke="white" className="size-8 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
        </svg>
      </button>



      {/* BUBBLE */}
      {activeBubble &&
        <div className="group absolute top-10
                        right-2 z-50 mt-2
                       bg-blue-200 rounded-lg shadow-lg
                       hover:bg-blue-300"
        >
          {/* Arrow */}
          <div className="absolute bottom-8 translate-x-[120px]
                          w-0 h-0
                          border-l-8
                          border-l-transparent
                          border-r-8
                          border-r-transparent
                          border-b-10
                          border-b-blue-200
                          group-hover:border-b-blue-300"
          />
          <div className="flex justify-center items-center
                          p-2 hover:cursor-pointer"
                onClick={()=>{
                  if(!logoutMutation.isPending)logoutMutation.mutate();
                }}
          >
            <span className={`text-sm
                              ${logoutMutation.isPending  ? 'hover:cursor-not-allowed'
                                                          : 'hover:underline'}`}>
              {logoutMutation.isPending || logoutMutation.isSuccess
               ? "Logging out..." : "Click here to log out."}
            </span>
          </div>
        </div>
      }
    </div>
  </div>
  )
}
