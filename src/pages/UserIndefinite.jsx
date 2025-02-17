import React, { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs, getStations } from "../request";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserIndefinitePage from "../components/UserIndefinitePage";

function UserIndefinite() {
  const [sendingData, setSendingData] = useState(null);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const navigate = useNavigate();

  const hokim = useAppStore((state) => state.hokim);
  const setHokim = useAppStore((state) => state.setHokim);
  const contract = useAppStore((state) => state.contract);
  const setContract = useAppStore((state) => state.setContract);
  const apz = useAppStore((state) => state.apz);
  const setApz = useAppStore((state) => state.setApz);
  const gastx = useAppStore((state) => state.gastx);
  const setGastx = useAppStore((state) => state.setGastx);
  const elektrtx = useAppStore((state) => state.elektrtx);
  const setElektrtx = useAppStore((state) => state.setElektrtx);
  const suvtx = useAppStore((state) => state.suvtx);
  const setSuvtx = useAppStore((state) => state.setSuvtx);
  const gasloyiha = useAppStore((state) => state.gasloyiha);
  const setGasloyiha = useAppStore((state) => state.setGasloyiha);
  const elektrloyiha = useAppStore((state) => state.elektrloyiha);
  const setElektrloyiha = useAppStore((state) => state.setElektrloyiha);
  const suvloyiha = useAppStore((state) => state.suvloyiha);
  const setSuvloyiha = useAppStore((state) => state.setSuvloyiha);
  const inshloyiha = useAppStore((state) => state.inshloyiha);
  const setInshloyiha = useAppStore((state) => state.setInshloyiha);
  const inshexpertiza = useAppStore((state) => state.inshexpertiza);
  const setInshexpertiza = useAppStore((state) => state.setInshexpertiza);
  const prodexpertiza = useAppStore((state) => state.prodexpertiza);
  const setProdexpertiza = useAppStore((state) => state.setProdexpertiza);
  const iden = useAppStore((state) => state.iden);
  const setIden = useAppStore((state) => state.setIden);
  const foyda = useAppStore((state) => state.foyda);
  const setFoyda = useAppStore((state) => state.setFoyda);

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

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "hokim"),
      setHokim,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "contract"),
      setContract,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "apz"),
      setApz,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gastx"),
      setGastx,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "elektrtx"),
      setElektrtx,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "suvtx"),
      setSuvtx,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gasloyiha"),
      setGasloyiha,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "elektrloyiha"),
      setElektrloyiha,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "suvloyiha"),
      setSuvloyiha,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "inshloyiha"),
      setInshloyiha,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "inshexpertiza"),
      setInshexpertiza,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "prodexpertiza"),
      setProdexpertiza,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "iden"),
      setIden,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "foyda"),
      setFoyda,
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
    <div className="grid lg:grid-cols-3  grid-cols-1 place-items-center gap-5">
      {filteredStations ? (
        filteredStations.map((station) => {
          return (
            <UserIndefinitePage
              key={station.id}
              station={station}
              hokim={hokim}
              contract={contract}
              apz={apz}
              gastx={gastx}
              elektrtx={elektrtx}
              suvtx={suvtx}
              gasloyiha={gasloyiha}
              elektrloyiha={elektrloyiha}
              suvloyiha={suvloyiha}
              inshloyiha={inshloyiha}
              inshexpertiza={inshexpertiza}
              prodexpertiza={prodexpertiza}
              iden={iden}
              foyda={foyda}
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

export default UserIndefinite;
