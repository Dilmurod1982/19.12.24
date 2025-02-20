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
  UserNewDocs,
  Pilot,
  Shayba,
  Water,
  Electric,
  Kolonka,
  KolonkaMarka,
  Manometr,
  Termometr,
  Voltmetr,
  Shlang,
  Ppk,
  Elprotec,
  Mol,
  Smazka,
  Ger,
  Aptek,
  Indefinite,
  Hokim,
  Contract,
  Apz,
  GasTx,
  ElektrTx,
  Suvtx,
  GasLoyiha,
  ElektrLoyiha,
  SuvLoyiha,
  InshLoyiha,
  InshExpertiza,
  ProdExpertiza,
  Iden,
  Foyda,
  UserIndefinite,
  UserIndefiniteDocs,
  EcologyTwo,
  Educ,
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
import PilotDetail from "./components/pilot/PilotDetail";
import ShaybaDetail from "./components/shayba/ShaybaDetail";
import WaterDetail from "./components/water/WaterDetail";
import ElectricDetail from "./components/electric/ElectricDetail";
import KolonkaDetail from "./components/kolonka/KolonkaDetail";
import ManometrDetail from "./components/manometr/ManometrDetail";
import TermometrDetail from "./components/termometr/TermometrDetail";
import VoltmetrDetail from "./components/voltmetr/VoltmetrDetail";
import ShlangDetail from "./components/shlang/ShlangDetail";
import PpkDetail from "./components/ppk/PpkDetail";
import ElprotecDetail from "./components/elprotec/ElprotecDetail";
import MolDetail from "./components/mol/MolDetail";
import SmazkaDetail from "./components/smazka/SmazkaDetail";
import GerDetail from "./components/ger/GerDetail";
import AptekDetail from "./components/aptek/AptekDetail";
import UserDocDetail from "./components/UserDocDetail";
import UserIndefiniteDetail from "./components/UserIndefiniteDetail";
import UserNewIndefiniteDocs from "./pages/UserNewIndefiniteDocs";
import EcologyTwoDetail from "./components/ecology_two/EcologyTwoDetail";
import EducDetail from "./components/educ/EducDetail";

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
          element: role ? (
            role === "admin" || role === "nazorat" ? (
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
          path: "/indefinite",
          element: <Indefinite />,
        },
        {
          path: "/userindefinite",
          element: <UserIndefinite />,
        },
        {
          path: "/userindefinitedocs/:stationId",
          element: <UserIndefiniteDocs />,
        },
        {
          path: "/userindefinitedetail",
          element: <UserIndefiniteDetail />,
        },
        {
          path: "/usernewindefinitedocs/:stationId",
          element: <UserNewIndefiniteDocs />,
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
          path: "/ecologytwo",
          element: <EcologyTwo />,
        },
        {
          path: "/ecologytwodetail",
          element: <EcologyTwoDetail />,
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
          path: "/pilot",
          element: <Pilot />,
        },
        {
          path: "/pilotdetail",
          element: <PilotDetail />,
        },
        {
          path: "/shayba",
          element: <Shayba />,
        },
        {
          path: "/shaybadetail",
          element: <ShaybaDetail />,
        },
        {
          path: "/water",
          element: <Water />,
        },
        {
          path: "/waterdetail",
          element: <WaterDetail />,
        },
        {
          path: "/electric",
          element: <Electric />,
        },
        {
          path: "/electricdetail",
          element: <ElectricDetail />,
        },
        {
          path: "/kolonka",
          element: <Kolonka />,
        },
        {
          path: "/kolonkadetail",
          element: <KolonkaDetail />,
        },
        {
          path: "/manometr",
          element: <Manometr />,
        },
        {
          path: "/manometrdetail",
          element: <ManometrDetail />,
        },
        {
          path: "/termometr",
          element: <Termometr />,
        },
        {
          path: "/termometrdetail",
          element: <TermometrDetail />,
        },
        {
          path: "/voltmetr",
          element: <Voltmetr />,
        },
        {
          path: "/voltmetrdetail",
          element: <VoltmetrDetail />,
        },
        {
          path: "/shlang",
          element: <Shlang />,
        },
        {
          path: "/shlangdetail",
          element: <ShlangDetail />,
        },
        {
          path: "/educ",
          element: <Educ />,
        },
        {
          path: "/educdetail",
          element: <EducDetail />,
        },
        {
          path: "/ppk",
          element: <Ppk />,
        },
        {
          path: "/ppkdetail",
          element: <PpkDetail />,
        },
        {
          path: "/elprotec",
          element: <Elprotec />,
        },
        {
          path: "/elprotecdetail",
          element: <ElprotecDetail />,
        },
        {
          path: "/mol",
          element: <Mol />,
        },
        {
          path: "/moldetail",
          element: <MolDetail />,
        },
        {
          path: "/smazka",
          element: <Smazka />,
        },
        {
          path: "/smazkadetail",
          element: <SmazkaDetail />,
        },
        {
          path: "/ger",
          element: <Ger />,
        },
        {
          path: "/gerdetail",
          element: <GerDetail />,
        },
        {
          path: "/aptek",
          element: <Aptek />,
        },
        {
          path: "/aptekdetail",
          element: <AptekDetail />,
        },
        {
          path: "/userstationdocs/:stationId",
          element: <UserStationDocs />,
        },
        {
          path: "/usernewdocs/:stationId",
          element: <UserNewDocs />,
        },
        {
          path: "/kolonkamarka",
          element: <KolonkaMarka />,
        },
        {
          path: "/userdocdetail",
          element: <UserDocDetail />,
        },
        {
          path: "/hokim",
          element: <Hokim />,
        },
        {
          path: "/contract",
          element: <Contract />,
        },
        {
          path: "/apz",
          element: <Apz />,
        },
        {
          path: "/gastx",
          element: <GasTx />,
        },
        {
          path: "/elektrtx",
          element: <ElektrTx />,
        },
        {
          path: "/suvtx",
          element: <Suvtx />,
        },
        {
          path: "/gasloyiha",
          element: <GasLoyiha />,
        },
        {
          path: "/elektrloyiha",
          element: <ElektrLoyiha />,
        },
        {
          path: "/suvloyiha",
          element: <SuvLoyiha />,
        },
        {
          path: "/inshloyiha",
          element: <InshLoyiha />,
        },
        {
          path: "/inshexpertiza",
          element: <InshExpertiza />,
        },
        {
          path: "/prodexpertiza",
          element: <ProdExpertiza />,
        },
        {
          path: "/iden",
          element: <Iden />,
        },
        {
          path: "/foyda",
          element: <Foyda />,
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
