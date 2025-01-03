import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  fetchDataWithTokenRefresh,
  getHumidityes,
  getLicenses,
  getNgsertificates,
} from "../request";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";

function Docs() {
  const user = useAppStore((state) => state.user);

  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const setNgsertificates = useAppStore((state) => state.setNgsertificates);
  const licenses = useAppStore((state) => state.licenses);
  const setLicenses = useAppStore((state) => state.setLicenses);
  const [showAllLicenses, setShowAllLicenses] = useState(false); // Новое состояние для галочки
  const [showAllNGSertificates, setShowAllNGSertificates] = useState(false); // Новое состояние для галочки
  // Новое состояние для галочки
  const [selectedStation, setSelectedStation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDataWithTokenRefresh(getLicenses, setLicenses, user);
  }, [user, setLicenses]);

  useEffect(() => {
    fetchDataWithTokenRefresh(getNgsertificates, setNgsertificates, user);
  }, [user, setNgsertificates]);

  const parseDate = (dateString) => {
    // Преобразование даты из "ДД.ММ.ГГГГ" в "ГГГГ-ММ-ДД"
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const filterLicenses = () => {
    let filtered = [...licenses];

    if (!showAllLicenses) {
      // Оставляем только последние лицензии для каждой станции
      const latestLicenses = filtered.reduce((acc, license) => {
        const { station_id, expiration } = license;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = license;
        }
        return acc;
      }, {});
      filtered = Object.values(latestLicenses);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (license) =>
          getStationNameByNumber(license.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((license) =>
        license.license_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const licenseCounts = filterLicenses().reduce(
    (acc, license) => {
      const expirationDate = new Date(parseDate(license.expiration));
      const currentDate = new Date();

      if (expirationDate < currentDate) {
        acc.expired += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 5) {
        acc.expiringSoon5 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 15) {
        acc.expiringSoon15 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 30) {
        acc.active += 1;
      }
      return acc;
    },
    { active: 0, expiringSoon5: 0, expiringSoon15: 0, expired: 0 }
  );

  const filterNGSertificates = () => {
    let filtered = [...ngsertificates];

    if (!showAllNGSertificates) {
      // Оставляем только последние лицензии для каждой станции
      const latestNGSertificates = filtered.reduce((acc, ngsertificate) => {
        const { station_id, expiration } = ngsertificate;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = ngsertificate;
        }
        return acc;
      }, {});
      filtered = Object.values(latestNGSertificates);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (ngsertificate) =>
          getStationNameByNumber(ngsertificate.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((ngsertificate) =>
        ngsertificate.ngsertificate_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const ngsertificateCounts = filterNGSertificates().reduce(
    (acc, ngsertificate) => {
      const expirationDate = new Date(parseDate(ngsertificate.expiration));
      const currentDate = new Date();

      if (expirationDate < currentDate) {
        acc.expired += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 5) {
        acc.expiringSoon5 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 15) {
        acc.expiringSoon15 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 30) {
        acc.active += 1;
      }
      return acc;
    },
    { active: 0, expiringSoon5: 0, expiringSoon15: 0, expired: 0 }
  );

  // Humidity
  const humidity = useAppStore((state) => state.humidity);
  const setHumidity = useAppStore((state) => state.setHumidity);
  const [showAllHumidity, setShowAllHumidity] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(getHumidityes, setHumidity, user);
  }, [user, setHumidity]);

  const filterHumidity = () => {
    let filtered = [...humidity];

    if (!showAllHumidity) {
      // Оставляем только последние лицензии для каждой станции
      const latestHumidity = filtered.reduce((acc, humidity) => {
        const { station_id, expiration } = humidity;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = humidity;
        }
        return acc;
      }, {});
      filtered = Object.values(latestHumidity);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (humidity) =>
          getStationNameByNumber(humidity.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((humidity) =>
        humidity.humidity_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const humidityCounts = filterHumidity().reduce(
    (acc, humidity) => {
      const expirationDate = new Date(parseDate(humidity.expiration));
      const currentDate = new Date();

      if (expirationDate < currentDate) {
        acc.expired += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 5) {
        acc.expiringSoon5 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 15) {
        acc.expiringSoon15 += 1;
      } else if ((expirationDate - currentDate) / (1000 * 60 * 60 * 24) <= 30) {
        acc.active += 1;
      }
      return acc;
    },
    { active: 0, expiringSoon5: 0, expiringSoon15: 0, expired: 0 }
  );

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Хужжатлар рўйхати</h1>
      </div>
      <ul className="flex flex-col justify-center items-center gap-3 w-[600px]">
        <li className="flex justify-center w-full">
          <Button className="flex justify-center items-center gap-5 w-full">
            <Link className="text-xl" to="/licenses">
              Лицензиялар
            </Link>
            <div className="flex gap-8">
              {licenseCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-300">
                    {licenseCounts.active}
                  </span>
                </div>
              )}
              {licenseCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-300">
                    {licenseCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {licenseCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-300">
                    {licenseCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {licenseCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-300">
                    {licenseCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-center items-center gap-5 w-full">
            <Link className="text-xl" to="/ngsertificates">
              Табиий газ сертификатлари
            </Link>
            <div className="flex gap-8">
              {ngsertificateCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-300">
                    {ngsertificateCounts.active}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-300">
                    {ngsertificateCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-300">
                    {ngsertificateCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-300">
                    {ngsertificateCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-center items-center gap-5 w-full">
            <Link className="text-xl" to="/humidity">
              Влагомер сертификатлари
            </Link>
            <div className="flex gap-8">
              {humidityCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-300">
                    {humidityCounts.active}
                  </span>
                </div>
              )}
              {humidityCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-300">
                    {humidityCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {humidityCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-300">
                    {humidityCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {humidityCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-300">
                    {humidityCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default Docs;
