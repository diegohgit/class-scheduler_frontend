import { useNavigate } from "react-router";
import useSchool from "../hooks/useSchool";
import { toast } from "react-toastify";
import { useLoginMutation } from "../hooks/useAuth";
import { Link } from "react-router-dom"; 


export default function Login() {

  const navigate = useNavigate();

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      navigate('/');
    }
  });



  const { validString, isProduction } = useSchool();



  //Validate data and run mutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email    = formData.get('email');
    const password = formData.get('password');

    //Validate inputs.
    if(!validString(email)){
      toast.error("E-mail is required.");
      return;
    }

    if(!validString(password)){
      toast.error("Please, type your password.");
      return;
    }

    const data = {email, password};

    //Send credentials to loging user.
    loginMutation.mutate({data, method: "POST"});
  }







  return (

    <>


      <div className="min-h-screen text-white
                      bg-linear-to-tr from-blue-400 to-indigo-950">

        <div className="justify-center grid h-screen ">

          <div className="h-fit mt-4">
            <img  src={`${import.meta.env.BASE_URL}img/scheduler_white.png`}
                  alt="logo"
                  className="w-70 mx-auto"
            />
          </div>

          <div className="w-90 h-80 -translate-y-6
                          border border-white rounded-lg"
          >
            <h1 className="title-base mt-6!">Login</h1>

            <form onSubmit={handleSubmit}
                  className="font-bold w-11/12 mx-auto">

              <div className="flex h-20 flex-col ">
                <span>E-mail:</span>
                <input type="text"
                       className="input-base font-normal 
                                 focus:border-cyan-400!"
                       name="email"
                />
              </div>

              <div className="h-16 flex flex-col">
                <span className="font-bold">Password:</span>
                <input type="password"
                       className="input-base font-normal 
                                 focus:border-cyan-400!"
                       name="password"
                />
              </div>

              <button className="button-base block mx-auto!
                                border border-white
                                hover:bg-cyan-400 hover:border-0
                                disabled:cursor-not-allowed!"
                      type="submit"
                      disabled={loginMutation.isPending}
              >
                { loginMutation.isPending ? 'Loading...' : 'Login' }
              </button>


              <div className="flex justify-center w-full
                              mt-4">
                <Link to='/forgot-password'
                      className="hover:underline"
                      onClick={(e) => {
                                if(!isProduction)
                                {
                                  e.preventDefault();
                                  toast.warning('This feature is not available in the demo version.');
                                }
                              }
                      }
                >
                  I forgot my password
                </Link>
              </div>
            </form>


            <a href={`${import.meta.env.BASE_URL}Class Scheduler - User manual.pdf`}
               download
               className='flex gap-2 mt-6 
                          mx-auto w-fit cursor-pointer
                          hover:underline'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Download PDF user manual
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
