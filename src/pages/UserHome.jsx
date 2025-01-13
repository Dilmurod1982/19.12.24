import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { toast } from "sonner";

function UserHome() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ik = useAppStore((state) => state.ik);

  const setLicenses = useAppStore((state) => state.setLicenses);
  const setNgsertificates = useAppStore((state) => state.setNgsertificates);
  const setHumidity = useAppStore((state) => state.setHumidity);
  const setGasanalyzers = useAppStore((state) => state.setGasanalyzers);
  const setProdinsurance = useAppStore((state) => state.setProdinsurance);
  const setLifeinsurance = useAppStore((state) => state.setLifeinsurance);
  const setEcology = useAppStore((state) => state.setEcology);
  const setIk = useAppStore((state) => state.setIk);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "licenses"),
      setLicenses,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ngsertificates"),
      setNgsertificates,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "humidityes"),
      setHumidity,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gasanalyzers"),
      setGasanalyzers,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "prodinsurances"),
      setProdinsurance,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "lifeinsurances"),
      setLifeinsurance,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ecology"),
      setEcology,
      user,
      setUser,
      navigate,
      toast
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ik"),
      setIk,
      user,
      setUser,
      navigate,
      toast
    );
  }, []);

  //   console.log(
  //     "Лицензия",
  //     licenses,
  //     "сертификат соответвия:",
  //     ngsertificates,
  //     "Влагомер:",
  //     humidity,
  //     "Газ анализатор:",
  //     gasanalyzers,
  //     "Хавфли ишлаб чиыариш полиси:",
  //     prodinsurance,
  //     "Ходимлар полиси:",
  //     lifeinsurance,
  //     "Экология хулосаси:",
  //     ecology,
  //     "ИК:",
  //     ik
  //   );
  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  //   useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-center text-2xl font-bold">Фойдаланувчи сахифаси</h1>
      <div className="flex justify-center">
        <ul className="flex flex-col gap-2 w-96">
          <li>
            <Link
              className="btn btn-neutral text-xl w-full text-white"
              to="/userstations"
            >
              Шахобчалар
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserHome;
