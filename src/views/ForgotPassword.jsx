import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import axiosClient from "../config/axios";
import { useState } from "react";

export default function ForgotPassword() {

  const [isLoading, setIsLoading] = useState(false);

  console.log('isloading', isLoading)

  const { request } = useApi();

  //Async function used to send POST forgot-password request.
  const handleRequest = async({data}) => {
    const message = "If an account exists for that email address, a password reset link has been sent.";

    const { success, response } = await request('POST',
                                                '/api/auth/forgot-password',
                                                data,
                                                message);
    setIsLoading(false);
    return {success, response};
  }



  //Submit function.
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData(e.currentTarget);
    const email    = formData.get('email');

    //Validate email structure.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      setIsLoading(false);
      toast.error('Invalid email.');
      return false;
    }

    await axiosClient({method: "GET",  url: '/sanctum/csrf-cookie', });

    const { success } =  handleRequest({data:{email}});

    if(success){
      //
    }
  }



  return (
    <>
      <div className="min-h-screen text-white
                      bg-linear-to-tl from-blue-400 to-indigo-950">

        <div className="justify-center items-center grid h-screen ">
          <div className="w-90 h-80 border 
                          border-white rounded-lg"
          >
            <h1 className="title-base text-2xl! mt-6!">
              Forgot your password?
            </h1>

            <form onSubmit={handleSubmit}
                  className="font-bold w-11/12 mx-auto">

              <div className="flex h-20 mt-8 flex-col ">
                <span>Write your E-mail:</span>
                <input type="text"
                        className="input-base font-normal 
                                  focus:border-cyan-400!"
                        name="email"
                        placeholder='teacher@example.com'
                />
              </div>

              <button className="button-base block mx-auto!
                                border border-white
                                hover:bg-cyan-400 
                                hover:border-0
                                disabled:cursor-not-allowed!"
                      type="submit"
                      disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </form>

            <span className='block m-4 text-center'>
              We will send you a link where you'll be able to reset 
              your password.
            </span>
          </div>
        </div>
      </div>


    	<ToastContainer />
    </>

  )
}
