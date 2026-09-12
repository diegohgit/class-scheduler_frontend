import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../hooks/useApi";



export default function ResetPassword() {

  const { request } = useApi();

  //Async function to send POST reset-password request.
  const handleRequest = async({data}) => {

    const { success, response } = await request('POST', 
                                                '/api/auth/reset-password', 
                                                data,);

    const message = response?.data?.message;

    return {success, message};
  }



  const params = new URLSearchParams(window.location.search);

  //Submit function.
  const handleSubmit = async(e) => {
    e.preventDefault();

    const token = params.get('token');
    const email = params.get('email');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const password_confirmation = formData.get('password_confirmation');

    const data = {token,
                  password,
                  password_confirmation,
                  email,};

    const {success, message} = await handleRequest({data});

    if(success){
      toast.success(message)
    }
  }



  return (
    <>
      <div className="min-h-screen text-white
                      bg-linear-to-tl from-blue-400 to-indigo-950">

        <div className="justify-center items-center grid h-screen ">
          <div className="w-90 h-90 border 
                          border-white rounded-lg"
          >
            <h1 className="title-base text-2xl! mt-6!">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit}
                  className="font-bold w-11/12 mx-auto">

              <div className="flex h-20 mt-8 flex-col ">
                <span>Type your new password:</span>
                <input type="password"
                        className="input-base font-normal 
                                  focus:border-cyan-400!"
                        name="password"
                />
              </div>

              <div className="flex h-20 mt-8 flex-col ">
                <span>Confirm Password:</span>
                <input type="password"
                        className="input-base font-normal 
                                  focus:border-cyan-400!"
                        name="password_confirmation"
                />
              </div>

              <button className="button-base block mx-auto!
                                border border-white
                                hover:bg-cyan-400 hover:border-0"
                      type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>


    	<ToastContainer />
    </>
  )
}
