import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import FallbackLoading from "./components/loader/FallbackLoading";
import { publicRoutes, privateRoutes } from "./routes";

import PrivateRoute from "./PrivateRoute";
import SignIn from "./pages/SignIn";

const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminSignIn = lazy(() => import("./pages/AdminSignIn"));
const Debug = lazy(() => import("./pages/Debug"));
const HealthCheck = lazy(() => import("./pages/HealthCheck"));

const App = () => {
  const userData = useSelector((state) => state.auth?.userData);
  
  // Check admin token on each render to make it reactive
  const getAdminToken = () => {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin)?.accessToken : null;
  };

  return (
    <Suspense fallback={<FallbackLoading />}>
      <Routes>
        <Route element={<PrivateRoute userData={userData} />}>
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route
          path="/signin"
          element={userData ? <Navigate to="/" /> : <SignIn />}
        />

        <Route
          path="/admin/signin"
          element={
            getAdminToken() ? <Navigate to="/admin" /> : <AdminSignIn />
          }
        />

        <Route
          path="/admin"
          element={
            getAdminToken() ? <AdminPanel /> : <Navigate to="/admin/signin" />
          }
        />

        <Route path="/debug" element={<Debug />} />
        <Route path="/health" element={<HealthCheck />} />
      </Routes>
    </Suspense>
  );
};

export default App;
