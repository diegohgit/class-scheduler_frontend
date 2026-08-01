import { useState } from "react"
import { useNavigate } from "react-router";
import useSchool from "../hooks/useSchool";
import { ToastContainer, toast } from "react-toastify";
import { useLoginMutation } from "../hooks/useAuth";


export default function Login() {

  const navigate = useNavigate();

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      navigate('/');
    }
  })



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
      <div className=" items-center justify-center grid h-screen ">
        <div className="w-90 h-80 border rounded-lg  ">

          <form onSubmit={handleSubmit}>
            <h1 className="title-base">Login</h1>

            <div className="flex h-20 flex-col ">
              <span className=" ml-3 font-bold">E-mail:</span>
              <input type="text"
                    className="border h-8 rounded-lg mx-3"
                    name="email"
              />
            </div>

            <div className="h-20 flex flex-col">
              <span className=" ml-3 font-bold">Password:</span>
              <input type="password"
                    className="border h-8 rounded-lg mx-3"
                    name="password"
              />

            </div>
              <button className="button-base block mx-auto!
                                bg-indigo-400"
                      type="submit"
              >
                  Log in
              </button>
          </form>
        </div>
      </div>



			<ToastContainer />
    </>
  )
}
