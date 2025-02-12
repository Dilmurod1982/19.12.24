import { Link } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function UserStationPage({
  station,
  licenses,
  ngsertificates,
  humidity,
  gasanalyzers,
  prodinsurance,
  lifeinsurance,
  ecology,
  ik,
  pilot,
  shayba,
  water,
  electric,
  kolonka,
  manometr,
  termometr,
  voltmetr,
  shlang,
  ppk,
  elprotec,
  mol,
  smazka,
  ger,
  aptek,
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
    ...licenses.map((doc) => ({ ...doc, document_type: "licenses" })),
    ...ngsertificates.map((doc) => ({
      ...doc,
      document_type: "ngsertificates",
    })),
    ...humidity.map((doc) => ({ ...doc, document_type: "humidity" })),
    ...gasanalyzers.map((doc) => ({ ...doc, document_type: "gasanalyzers" })),
    ...prodinsurance.map((doc) => ({ ...doc, document_type: "prodinsurance" })),
    ...lifeinsurance.map((doc) => ({
      ...doc,
      document_type: "lifeinsurance",
    })),
    ...ecology.map((doc) => ({ ...doc, document_type: "ecology" })),
    ...ik.map((doc) => ({ ...doc, document_type: "ik" })),
    ...pilot.map((doc) => ({ ...doc, document_type: "pilot" })),
    ...shayba.map((doc) => ({ ...doc, document_type: "shayba" })),
    ...water.map((doc) => ({ ...doc, document_type: "water" })),
    ...electric.map((doc) => ({ ...doc, document_type: "electric" })),
    ...kolonka.map((doc) => ({ ...doc, document_type: "kolonka" })),
    ...manometr.map((doc) => ({ ...doc, document_type: "manometr" })),
    ...termometr.map((doc) => ({ ...doc, document_type: "termometr" })),
    ...voltmetr.map((doc) => ({ ...doc, document_type: "voltmetr" })),
    ...shlang.map((doc) => ({ ...doc, document_type: "shlang" })),
    ...ppk.map((doc) => ({ ...doc, document_type: "ppk" })),
    ...elprotec.map((doc) => ({ ...doc, document_type: "elprotec" })),
    ...mol.map((doc) => ({ ...doc, document_type: "mol" })),
    ...smazka.map((doc) => ({ ...doc, document_type: "smazka" })),
    ...ger.map((doc) => ({ ...doc, document_type: "ger" })),
    ...aptek.map((doc) => ({ ...doc, document_type: "aptek" })),
  ];

  // Фильтруем документы по station_id
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

  const expiringIn30Days = uniqueStationDocuments.filter((doc) => {
    const expirationDate = dayjs(doc.expiration, "DD.MM.YYYY");
    return (
      expirationDate.isAfter(currentDate.add(15, "day")) &&
      expirationDate.isBefore(currentDate.add(30, "day"))
    );
  }).length;

  const expiringIn15Days = uniqueStationDocuments.filter((doc) => {
    const expirationDate = dayjs(doc.expiration, "DD.MM.YYYY");
    return (
      expirationDate.isAfter(currentDate.add(5, "day")) &&
      expirationDate.isBefore(currentDate.add(15, "day"))
    );
  }).length;

  const expiringIn5Days = uniqueStationDocuments.filter((doc) => {
    const expirationDate = dayjs(doc.expiration, "DD.MM.YYYY");
    return (
      expirationDate.isAfter(currentDate) &&
      expirationDate.isBefore(currentDate.add(5, "day"))
    );
  }).length;

  const expiredDocuments = uniqueStationDocuments.filter((doc) => {
    const expirationDate = dayjs(doc.expiration, "DD.MM.YYYY");
    return expirationDate.isBefore(currentDate);
  }).length;

  return (
    <Link
      to={`/userstationdocs/${station.id}`}
      className="w-96 rounded-sm border flex flex-col justify-center items-center gap-5"
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
        <div className=" flex gap-2 h-10 justify-center">
          {expiringIn30Days > 0 && (
            <div className="flex justify-center items-center rounded-3xl border w-10 h-10 bg-green-700 text-white">
              {expiringIn30Days}
            </div>
          )}
          {expiringIn15Days > 0 && (
            <div className="flex justify-center items-center rounded-3xl border w-10 h-10 bg-yellow-500 text-white">
              {expiringIn15Days}
            </div>
          )}
          {expiringIn5Days > 0 && (
            <div className="flex justify-center items-center  rounded-3xl border w-10 h-10 bg-orange-500 text-white">
              {expiringIn5Days}
            </div>
          )}
          {expiredDocuments > 0 && (
            <div className="flex justify-center items-center rounded-3xl border w-10 h-10 bg-red-700 text-white">
              {expiredDocuments}
            </div>
          )}
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
