
import { useContext } from 'react';
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import MyProperty from './pages/myProperty/MyProperty'
import UserFavorites from './pages/userFavorites/UserFavorites'
import { AuthContext } from './context2/AuthContext';
import SessionOutLoginAgain from './components/Table/SessionOutLoginAgain';
import Loading from './components/Loading';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet
} from "react-router-dom";
// import Table from './pages/table/Table';
import Index from './pages/index/Index';
import LoginRequired from './components/Table/LoginRequired';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  // Show loading while checking session
  if (isLoading) {
    return <Loading />;
  }

  // Show login required if no user
  if (!currentUser) {
    return (
      <div style={{
        boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #dee2e6",
        borderRadius: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <LoginRequired />
      </div>
    );
  }

  return children ? children : <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "my-property/:propertyId",
        element: <MyProperty />
      },
      {
        path: "favorites",
        element: <UserFavorites />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
