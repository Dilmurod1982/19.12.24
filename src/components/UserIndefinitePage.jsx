import { Link } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function UserIndefinitePage({
  station,
  hokim,
  contract,
  apz,
  gastx,
  elektrtx,
  suvtx,
  gasloyiha,
  elektrloyiha,
  suvloyiha,
  inshloyiha,
  inshexpertiza,
  prodexpertiza,
  iden,
  foyda,
}) {
  const [documents, setDocuments] = useState([]);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const regions = useAppStore((state) => state.regions);
  const setRegions = useAppStore((state) => state.setRegions);
  const cities = useAppStore((state) => state.cities);
  const setCities = useAppStore((state) => state.setCities);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ltd"),
      setLtd,
      user
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "regions"),
      setRegions,
      user
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "cities"),
      setCities,
      user
    );
  }, [user]);

  const getLtdNameById = (id) => {
    if (!ltd || ltd.length === 0) return "Номаълум";
    const ltdItem = ltd.find((item) => item.id === id);
    return ltdItem ? ltdItem.ltd_name : "Номаълум";
  };
  const getRegionNameById = (id) => {
    if (!regions || regions.length === 0) return "Номаълум";
    const regionsItem = regions.find((item) => item.id === id);
    return regionsItem ? regionsItem.region_name : "Номаълум";
  };
  const getCitiesNameById = (id) => {
    if (!cities || cities.length === 0) return "Номаълум";
    const citiesItem = cities.find((item) => item.id === id);
    return citiesItem ? citiesItem.city_name : "Номаълум";
  };

  const allDocuments = [
    ...hokim.map((doc) => ({ ...doc, document_type: "hokim" })),
    ...contract.map((doc) => ({
      ...doc,
      document_type: "contract",
    })),
    ...apz.map((doc) => ({ ...doc, document_type: "apz" })),
    ...gastx.map((doc) => ({ ...doc, document_type: "gastx" })),
    ...elektrtx.map((doc) => ({ ...doc, document_type: "elektrtx" })),
    ...suvtx.map((doc) => ({
      ...doc,
      document_type: "suvtx",
    })),
    ...gasloyiha.map((doc) => ({ ...doc, document_type: "gasloyiha" })),
    ...elektrloyiha.map((doc) => ({ ...doc, document_type: "elektrloyiha" })),
    ...suvloyiha.map((doc) => ({ ...doc, document_type: "suvloyiha" })),
    ...inshloyiha.map((doc) => ({ ...doc, document_type: "inshloyiha" })),
    ...inshexpertiza.map((doc) => ({ ...doc, document_type: "inshexpertiza" })),
    ...prodexpertiza.map((doc) => ({ ...doc, document_type: "prodexpertiza" })),
    ...iden.map((doc) => ({ ...doc, document_type: "iden" })),
    ...foyda.map((doc) => ({ ...doc, document_type: "foyda" })),
  ];

  //   Фильтруем документы по station_id
  const stationDocuments = allDocuments
    .filter((doc) => Number(doc.station_id) === Number(station.id))
    .reduce((acc, doc) => {
      const key = `${doc.station_id}_${doc.document_type}`;
      if (
        !acc[key] ||
        dayjs(doc.expiration).isAfter(dayjs(acc[key].expiration))
      ) {
        acc[key] = doc;
      }
      return acc;
    }, {});

  const uniqueStationDocuments = Object.values(stationDocuments);

  const currentDate = dayjs();

  const totalDocuments = uniqueStationDocuments.length;

  return (
    <Link
      to={`/userindefinitedocs/${station.id}`}
      className="w-96 rounded-md border-[4px] shadow-[10px]  flex flex-col justify-center items-center gap-5"
    >
      <div>
        <h1 className="font-bold text-2xl">{station.moljal}</h1>
      </div>
      <div className="">
        <div>
          <h1>
            Жами хужжатлар сони:{" "}
            <span className="font-bold">{totalDocuments} та</span>
          </h1>
        </div>
      </div>
      <div>
        <div className="flex w-96 p-2">
          <span className="w-48 font-bold">МЧЖ номи:</span>
          <span>
            {getLtdNameById(station.ltd_id)} АГТКШ №{station.station_number}
          </span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Бошқарувчи:</span>
          <span className="text-start">{station.boshqaruvchi}</span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Телефони:</span>
          <span className="text-start">+{station.aloqa_tel}</span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Бош механиги:</span>
          <span className="text-start">{station.b_mexanik}</span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Телефони:</span>
          <span className="text-start">+{station.b_mexanik_tel}</span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Вилоят:</span>
          <span className="text-start">
            {getRegionNameById(station.region_id)}
          </span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Туман:</span>
          <span className="text-start">
            {getCitiesNameById(station.city_id)}
          </span>
        </div>
        <div className="flex w-96 p-2">
          <span className="w-28 font-bold">Газ таъминот корхонаси:</span>
          <span className="text-start">
            {getCitiesNameById(station.gasLtd_id)} газ
          </span>
        </div>
      </div>
    </Link>
  );
}
