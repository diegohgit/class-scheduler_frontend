import { Outlet, Navigate } from "react-router";
import { useUser } from "../hooks/useAuth";
import { use, useEffect } from "react";
import Loading from "./Loading";

export default function ProtectedRoute() {

  //Get user information.
  const {
      data: user,
      isLoading,
      isError,
  } = useUser();

  if(isLoading) return <Loading />;



  //If it was impossible to get user information,
  //navigate to /login.
  if(!user || isError){

    //'replace' is so the user can't go back to the 
    //url that he couldn't reach.
    return <Navigate to="/login" replace/>;

    //Note: navigate() can't be used here because 
    //it would cause and error if it tryes to update
    //React Router while ProtectedRoute is still rendering.
  }



  //Go to main Layout.
  return <Outlet />
}