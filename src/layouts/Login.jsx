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



  const { validString } = useSchool();

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
                                hover:bg-cyan-400 hover:border-0"
                      type="submit"
              >
                { loginMutation.isPending ? 'Loading...' : 'Login' }
              </button>

              <Link to='/forgot-password'
              >
                <span className="block w-full text-center
                                 mt-4 hover:underline hover:cursor-pointer"
                                 >
                  I forgot my password
                </span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
