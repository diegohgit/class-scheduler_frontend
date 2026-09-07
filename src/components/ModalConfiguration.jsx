import useSchool from "../hooks/useSchool";
import TimeSelector from "./TimeSelector";
import { useActiveHours, useActiveHrsMutation } from "../hooks/useActiveHours";
import { useClasses } from "../hooks/useClasses";
import { toast } from "react-toastify";


export default function ModalConfiguration() {

  //Get active hours using useActiveHours()
  const { data:active_hours = {},
          isLoading : isLoadingActiveHrs,
          isSuccess : isSuccessActiveHrs,
          isError   : isErrorActiveHrs,
        } = useActiveHours();

  //Get scheduled classes using useClasses()
  const { data:classes = [], } = useClasses();



  const { handleModalConfiguration, time, getDuration } = useSchool();



  const validateActiveHrs = () => {

    //Validate that active hours are more than 3 and less than 24 hours.
    const totalHours = getDuration(time).asHours();

    if(totalHours < 3 || totalHours > 24){
      toast.error('Active hours must be more than 3hrs and less than 24hrs.')
      return false;
    }

    //Validate that the selected time range includes all the classes.
    const validateClasses = classes?.some((cls) => {
                              return cls.starts < time.starts || cls.ends > time.ends;
                            });

    if(validateClasses){
      toast.error('You have classes scheduled outside the selected time range.');
      return false;
    }

    return true;
  }



  const activeHrsMutation = useActiveHrsMutation({
    onSuccess:() => {
        handleModalConfiguration();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if(validateActiveHrs()){

      const data = {'from'  : time.starts+':00',
                    'until' : time.ends+':00',};

      activeHrsMutation.mutate(data);
    }
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">
          Configuration
        </h2>

        <div className="flex justify-end">
          <button className="hover:cursor-pointer"
                  onClick={() => handleModalConfiguration() }>
            {/* "Close" icon  */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>



      <form onSubmit={(e) => handleSubmit(e)}
            className="w-11/12 mx-auto"
            onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(e); }}
      >
        <div className="w-10/12 mx-auto ">
          <span>Change active hours:</span>

          {isErrorActiveHrs   && <span><br />An error has occurred.</span>}
          {isLoadingActiveHrs && <span><br />Loading active hours...</span>}

          {isSuccessActiveHrs &&
            <div className="h-10 mt-4 flex">
              <div className="w-5/12 flex">
                <b className="mr-2">From:</b>
                <TimeSelector
                  initialTime={active_hours.from}
                  auxiliary = "start"
                />
              </div>
              <div className="w-5/12 flex">
                <b className="ml-8 mr-2">To:</b>
                <TimeSelector
                  initialTime={active_hours.until}
                  auxiliary = "end"
                  />
              </div>
            </div>
          }
        </div>

        <div className=" flex mt-2">
          <button type="button"
                  onClick={() => console.log("Cancel")}
                  className="button-base bg-red-500 hover:bg-red-600"
          >
            Cancel
          </button>

          <button type="submit"
                  className="button-base bg-indigo-500 hover:bg-indigo-600"
          >
            {activeHrsMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  )
}