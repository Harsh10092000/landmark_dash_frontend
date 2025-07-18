
import { useContext } from 'react';
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import MyProperty from './pages/myProperty/MyProperty'
import { AuthContext } from './context2/AuthContext';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
// import Table from './pages/table/Table';
import Index from './pages/index/Index';
const router = createBrowserRouter([

  // {
  //   path: "/table",
  //   element: <Table />,
  // },
  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <Index />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <>
            {/* <SendJwt /> */}
            <Dashboard />
          </>
        ),
      },
      {
        path: "my-property/:propertyId",
        element: <MyProperty />
      }
]}
  
])

function App() {

  const {currentUser} = useContext(AuthContext);
  console.log('currentUser ', currentUser);
  return <RouterProvider router={router} />;
}

export default App
