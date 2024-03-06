import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { AppView } from 'src/sections/overview/view';

const ProtectedRoute = () => {
  const auth = localStorage.getItem('accessToken');
//   console.log(auth);
  return (
    <div>
      {auth ? (<>
      
        <Outlet />
      </>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default ProtectedRoute;
