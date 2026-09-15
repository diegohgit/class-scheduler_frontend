import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import { useState } from "react";

export default function ResetPassword() {

  const [isLoading, setIsLoading] = useState(false);



  const { request } = useApi();

  //Async function to send POST reset-password request.
  const handleRequest = async({data}) => {

    const { success, response } = await request('POST', 
                                                '/api/auth/reset-password', 
                                                data,);

    const message = response?.data?.message;

    setIsLoading(false);
    return {success, message};
  }



  const validation = (password, password_confirmation) => {
    if(password != password_confirmation){
      toast.error("Your password confirmation doesn't match.");
      return false;
    }

    if(password.length < 8){
      toast.error("Password must contain at least 8 characters.");
      return false;
    }

    //Validate that password contains at least:
    //- 8 characters.
    //- One uppercase letter.
    //- One lowercase letter.
    //- One number.
    //- One Symbol.
    const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/i;

    if (!emailRegex.test(password)) {
      toast.error('Password must contain uppercase, lowercase, number and symbol.');
      return false;
    }

    return true;
  }



  const params = new URLSearchParams(window.location.search);

  //Submit function.
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = params.get('token');
    const email = params.get('email');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const password_confirmation = formData.get('password_confirmation');

    if(validation(password, password_confirmation))
    {
      const data = {token,
                    password,
                    password_confirmation,
                    email,};

      const {success, message} = await handleRequest({data});

      if(success)toast.success(message);
    }else setIsLoading(false);
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
                <span>New password:</span>
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
                                hover:bg-cyan-400 hover:border-0
                                disabled:cursor-not-allowed!"
                      type="submit"
                      disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>


    	<ToastContainer />
    </>
  )
}
