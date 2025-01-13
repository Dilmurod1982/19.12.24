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
  GasAnalyzers,
  ProdInsurance,
  LifeInsurance,
  Ecology,
  Ik,
  UserHome,
  UserStations,
  UserStationDocs,
} from "./pages";
import { useAppStore } from "./lib/zustand/index";
import LicenseDetail from "./components/LicenseDetail";
import {
  GasAnalyzerDetail,
  HumidityDetail,
  NGSertificateDetail,
  ProdInsuranceDetail,
  UserStationPage,
} from "./components";
import LifeInsuranceDetail from "./components/lifeinsurance/LifeInsuranceDetail";
import EcologyDetail from "./components/Ecology/EcologyDetail";
import IkDetail from "./components/ik/IkDetail";

function App() {
  const user = useAppStore((state) => state.user);

  const role = user?.type || null;
  console.log(role);

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
          element: role ? (
            role === "admin" ? (
              <Home />
            ) : (
              <Navigate to="/userhome" />
            )
          ) : null,
        },
        {
          path: "/userhome",
          element: role ? (
            role === "user" ? (
              <UserHome />
            ) : (
              <Navigate to="/" />
            )
          ) : null,
        },
        {
          path: "/userstations",
          element: role ? (
            role === "user" ? (
              <UserStations />
            ) : (
              <Navigate to="/" />
            )
          ) : null,
        },
        {
          path: "/userstationspage",
          element: role ? (
            role === "user" ? (
              <UserStationPage />
            ) : (
              <Navigate to="/" />
            )
          ) : null,
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
        {
          path: "/gasanalyzers",
          element: <GasAnalyzers />,
        },
        {
          path: "/gasanalyzerdetail",
          element: <GasAnalyzerDetail />,
        },
        {
          path: "/prodinsurance",
          element: <ProdInsurance />,
        },
        {
          path: "/prodinsurancedetail",
          element: <ProdInsuranceDetail />,
        },
        {
          path: "/lifeinsurance",
          element: <LifeInsurance />,
        },
        {
          path: "/lifeinsurancedetail",
          element: <LifeInsuranceDetail />,
        },
        {
          path: "/ecology",
          element: <Ecology />,
        },
        {
          path: "/ecologydetail",
          element: <EcologyDetail />,
        },
        {
          path: "/ik",
          element: <Ik />,
        },
        {
          path: "/ikdetail",
          element: <IkDetail />,
        },
        {
          path: "/userstationdocs/:stationId",
          element: <UserStationDocs />,
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
