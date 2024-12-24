import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ProtectedRoutes from "./layouts/ProtectedRoutes";
import RootLayouts from "./layouts/RootLayouts";
import { Home, Login, Ltd, Stations, Users } from "./pages";
import { useAppStore } from "./lib/zustand/index";

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