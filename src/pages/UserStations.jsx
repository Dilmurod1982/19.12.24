import React, { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs, getStations } from "../request";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import UserStationPage from "../components/UserStationPage";
import toast from "react-hot-toast";

function UserStations() {
  const [sendingData, setSendingData] = useState(null);
  const [lic, setLic] = useState(null);
  const [ngc, setNgc] = useState(null);
  const [hum, setHum] = useState(null);
  const [gac, setGac] = useState(null);
  const [pi, setPi] = useState(null);
  const [li, setLi] = useState(null);
  const [eco, setEco] = useState(null);
  const [izk, setIzk] = useState(null);
  const [pil, setPil] = useState(null);
  const [shay, setShay] = useState(null);
  const [wat, setWat] = useState(null);
  const [elec, setElec] = useState(null);
  const [kol, setKol] = useState(null);
  const [mmetr, setMmetr] = useState(null);
  const [tmetr, setTmetr] = useState(null);
  const [vmetr, setVmetr] = useState(null);
  const [shl, setShl] = useState(null);
  const [pp, setPp] = useState(null);
  const [ep, setEp] = useState(null);
  const [mo, setMo] = useState(null);
  const [smaz, setSmaz] = useState(null);
  const [germe, setGerme] = useState(null);
  const [apteka, setApteka] = useState(null);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const navigate = useNavigate();

  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ik = useAppStore((state) => state.ik);
  const pilot = useAppStore((state) => state.pilot);
  const shayba = useAppStore((state) => state.shayba);
  const water = useAppStore((state) => state.water);
  const electric = useAppStore((state) => state.electric);
  const kolonka = useAppStore((state) => state.kolonka);
  const manometr = useAppStore((state) => state.manometr);
  const termometr = useAppStore((state) => state.termometr);
  const voltmetr = useAppStore((state) => state.voltmetr);
  const shlang = useAppStore((state) => state.shlang);
  const ppk = useAppStore((state) => state.ppk);
  const elprotec = useAppStore((state) => state.elprotec);
  const mol = useAppStore((state) => state.mol);
  const smazka = useAppStore((state) => state.smazka);
  const ger = useAppStore((state) => state.ger);
  const aptek = useAppStore((state) => state.aptek);

  useEffect(() => {
    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getStations(access_token);
            })
            .then(({ data }) => {
              console.log("Stations after refresh:", data);
              setStations(data);
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });
  }, [user, setStations, setUser, sendingData]);

  const setLicenses = useAppStore((state) => state.setLicenses);
  const setNgsertificates = useAppStore((state) => state.setNgsertificates);
  const setHumidity = useAppStore((state) => state.setHumidity);
  const setGasanalyzers = useAppStore((state) => state.setGasanalyzers);
  const setProdinsurance = useAppStore((state) => state.setProdinsurance);
  const setLifeinsurance = useAppStore((state) => state.setLifeinsurance);
  const setEcology = useAppStore((state) => state.setEcology);
  const setIk = useAppStore((state) => state.setIk);
  const setPilot = useAppStore((state) => state.setPilot);
  const setShayba = useAppStore((state) => state.setShayba);
  const setWater = useAppStore((state) => state.setWater);
  const setElectric = useAppStore((state) => state.setElectric);
  const setKolonka = useAppStore((state) => state.setKolonka);
  const setManometr = useAppStore((state) => state.setManometr);
  const setTermometr = useAppStore((state) => state.setTermometr);
  const setVoltmetr = useAppStore((state) => state.setVoltmetr);
  const setShlang = useAppStore((state) => state.setShlang);
  const setPpk = useAppStore((state) => state.setPpk);
  const setElprotec = useAppStore((state) => state.setElprotec);
  const setMol = useAppStore((state) => state.setMol);
  const setSmazka = useAppStore((state) => state.setSmazka);
  const setGer = useAppStore((state) => state.setGer);
  const setAptek = useAppStore((state) => state.setAptek);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "licenses"),
      setLicenses,
      // setLic,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ngsertificates"),
      setNgsertificates,
      // setNgc,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "humidityes"),
      setHumidity,
      // setHum,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gasanalyzers"),
      setGasanalyzers,
      // setGac,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "prodinsurances"),
      setProdinsurance,
      // setPi,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "lifeinsurances"),
      // setLi,
      setLifeinsurance,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ecology"),
      // setEco,
      setEcology,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ik"),
      // setIzk,
      setIk,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "pilot"),
      // setPil,
      setPilot,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "shayba"),
      setShayba,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "water"),
      setWater,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "electric"),
      setElectric,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "kolonka"),
      setKolonka,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "manometr"),
      setManometr,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "termometr"),
      setTermometr,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "voltmetr"),
      setVoltmetr,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "shlang"),
      setShlang,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ppk"),
      setPpk,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "elprotec"),
      setElprotec,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "mol"),
      setMol,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "smazka"),
      setSmazka,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ger"),
      setGer,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "aptek"),
      setAptek,
      user,
      setUser,
      navigate,
      toast
    );
  }, []);

  const filteredStations = stations?.filter((station) =>
    station.operators.includes(user?.id.toString())
  );

  return (
    <div className="flex justify-center items-center gap-5">
      {filteredStations ? (
        filteredStations.map((station) => {
          return (
            <UserStationPage
              key={station.id}
              station={station}
              licenses={licenses}
              ngsertificates={ngsertificates}
              humidity={humidity}
              gasanalyzers={gasanalyzers}
              prodinsurance={prodinsurance}
              lifeinsurance={lifeinsurance}
              ecology={ecology}
              ik={ik}
              pilot={pilot}
              shayba={shayba}
              water={water}
              electric={electric}
              kolonka={kolonka}
              manometr={manometr}
              termometr={termometr}
              voltmetr={voltmetr}
              shlang={shlang}
              ppk={ppk}
              elprotec={elprotec}
              mol={mol}
              smazka={smazka}
              ger={ger}
              aptek={aptek}
            />
          );
        })
      ) : (
        <div className="flex w-full mt-10 mb-10 justify-end items-center">
          <PulseLoader speedMultiplier={0.5} />
        </div>
      )}
    </div>
  );
}

export default UserStations;
