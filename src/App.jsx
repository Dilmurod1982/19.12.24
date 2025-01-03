import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ProtectedRoutes from "./layouts/ProtectedRoutes";
import RootLayouts from "./layouts/RootLayouts";
import {
  Home,
  Login,
  Ltd,
  Stations,
  Users,
  Cities,
  Regions,
  ChangePassword,
  Docs,
  Licenses,
  Profile,
  NGSertificates,
  Humidity,
} from "./pages";
import { useAppStore } from "./lib/zustand/index";
import LicenseDetail from "./components/LicenseDetail";
import { HumidityDetail, NGSertificateDetail } from "./components";

function App() {
  const user = useAppStore((state) => state.user);

  const role = user?.type || null;

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes user={user}>
          <RootLayouts />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/stations",
          element: <Stations />,
        },
        {
          path: "/ltd",
          element: <Ltd />,
        },
        {
          path: "/regions",
          element: <Regions />,
        },
        {
          path: "/cities",
          element: <Cities />,
        },
        {
          path: "/changepassword",
          element: <ChangePassword />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/docs",
          element: <Docs />,
        },
        {
          path: "/licenses",
          element: <Licenses />,
        },
        {
          path: "/licensedetail",
          element: <LicenseDetail />,
        },
        {
          path: "/ngsertificates",
          element: <NGSertificates />,
        },
        {
          path: "/ngsertificatedetail",
          element: <NGSertificateDetail />,
        },
        {
          path: "/humidity",
          element: <Humidity />,
        },
        {
          path: "/humiditydetail",
          element: <HumidityDetail />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
