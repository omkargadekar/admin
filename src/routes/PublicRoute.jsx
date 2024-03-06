import React from "react";
import { Navigate} from "react-router-dom";

import LoginPage from "src/pages/login";

const PublicRoute = () => {
  const auth = localStorage.getItem("accessToken");
  return <div>

    {!auth ? <LoginPage /> : <Navigate to="/" />}
    
    </div>;
};


export default PublicRoute;