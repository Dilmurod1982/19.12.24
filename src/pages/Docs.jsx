import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Docs() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();
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
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "licenses"),
      setLicenses,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setLicenses]);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ngsertificates"),
      setNgsertificates,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setNgsertificates]);

  const parseDate = (dateString) => {
    if (!dateString) {
      return null;
    }
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

  // // Humidity
  const humidity = useAppStore((state) => state.humidity);
  const setHumidity = useAppStore((state) => state.setHumidity);
  const [showAllHumidity, setShowAllHumidity] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "humidityes"),
      setHumidity,
      user,
      setUser,
      navigate,
      toast
    );
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

  // // gasAnalyzers
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const setGasanalyzers = useAppStore((state) => state.setGasanalyzers);
  const [showAllGasAnalyzers, setShowAllGasAnalyzers] = useState(false);
  const baseGasAnalyzer = "gasanalyzers";

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gasanalyzers"),
      setGasanalyzers,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setGasanalyzers]);

  const filterGasAnalyzers = () => {
    let filtered = [...gasanalyzers];

    if (!showAllGasAnalyzers) {
      // Оставляем только последние лицензии для каждой станции
      const latestGasAnalyzer = filtered.reduce((acc, gasanalyzer) => {
        const { station_id, expiration } = gasanalyzer;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = gasanalyzer;
        }
        return acc;
      }, {});
      filtered = Object.values(latestGasAnalyzer);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (gasanalyzer) =>
          getStationNameByNumber(gasanalyzer.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((gasanalyzer) =>
        gasanalyzer.gasanalyzer_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const gasanalyzerCounts = filterGasAnalyzers().reduce(
    (acc, gasanalyzer) => {
      const expirationDate = new Date(parseDate(gasanalyzer.expiration));
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

  // prodinsurance
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const setProdinsurance = useAppStore((state) => state.setProdinsurance);
  const [showAllProdinsurance, setShowAllProdinsurance] = useState(false);
  const baseProdinsurance = "prodinsurances";

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "prodinsurances"),
      setProdinsurance,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setProdinsurance]);

  const filterProdinsurance = () => {
    let filtered = [...prodinsurance];

    if (!showAllProdinsurance) {
      // Оставляем только последние лицензии для каждой станции
      const latestDocs = filtered.reduce((acc, doc) => {
        const { station_id, expiration } = prodinsurance;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = prodinsurance;
        }
        return acc;
      }, {});
      filtered = Object.values(latestDocs);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (doc) => getStationNameByNumber(doc.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.prodinsurance_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const prodinsuranceCounts = filterProdinsurance().reduce(
    (acc, doc) => {
      const expirationDate = new Date(parseDate(doc.expiration));
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

  // lifeinsurance

  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const setLifeinsurance = useAppStore((state) => state.setLifeinsurance);
  const [showAllLifeinsurance, setShowAllLifeinsurance] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "lifeinsurances"),
      setLifeinsurance,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setLifeinsurance]);

  const filterLifeinsurances = () => {
    let filtered = [...lifeinsurance];

    if (!showAllLifeinsurance) {
      // Оставляем только последние лицензии для каждой станции
      const latestLifeinsurance = filtered.reduce((acc, lifeinsurance) => {
        const { station_id, expiration } = lifeinsurance;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = lifeinsurance;
        }
        return acc;
      }, {});
      filtered = Object.values(latestLifeinsurance);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (lifeinsurance) =>
          getStationNameByNumber(lifeinsurance.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((gasanalyzer) =>
        lifeinsurance.lifeinsurance_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const lifeinsuranceCounts = filterLifeinsurances().reduce(
    (acc, lifeinsurance) => {
      const expirationDate = new Date(parseDate(lifeinsurance.expiration));
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

  // Ecology

  const ecology = useAppStore((state) => state.ecology);
  const setEcology = useAppStore((state) => state.setEcology);
  const [showAllEcology, setShowAllEcology] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ecology"),
      setEcology,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setEcology]);

  const filterEcology = () => {
    let filtered = [...ecology];

    if (!showAllEcology) {
      const latestEcology = filtered.reduce((acc, ecology) => {
        const { station_id, expiration } = ecology;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = ecology;
        }
        return acc;
      }, {});
      filtered = Object.values(latestEcology);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (ecology) =>
          getStationNameByNumber(ecology.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((ecology) =>
        ecology.ecology_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const ecologyCounts = filterEcology().reduce(
    (acc, ecology) => {
      const expirationDate = new Date(parseDate(ecology.expiration));
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
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl " to="/licenses">
              Лицензиялар
            </Link>
            <div className="flex gap-8">
              {licenseCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {licenseCounts.active}
                  </span>
                </div>
              )}
              {licenseCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500 ">
                    {licenseCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {licenseCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {licenseCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {licenseCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {licenseCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/ngsertificates">
              Табиий газ сертификатлари
            </Link>
            <div className="flex gap-8">
              {ngsertificateCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {ngsertificateCounts.active}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500 ">
                    {ngsertificateCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {ngsertificateCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {ngsertificateCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {ngsertificateCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/humidity">
              Влагомер сертификатлари
            </Link>
            <div className="flex gap-8">
              {humidityCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {humidityCounts.active}
                  </span>
                </div>
              )}
              {humidityCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {humidityCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {humidityCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {humidityCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {humidityCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {humidityCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/gasanalyzers">
              Газ анализатор сертификатлари
            </Link>
            <div className="flex gap-8">
              {gasanalyzerCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {gasanalyzerCounts.active}
                  </span>
                </div>
              )}
              {gasanalyzerCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {gasanalyzerCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {gasanalyzerCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {gasanalyzerCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {gasanalyzerCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {gasanalyzerCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/prodinsurance">
              Хавфли ишлаб чиқариш полисилари
            </Link>
            <div className="flex gap-8">
              {prodinsuranceCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {prodinsuranceCounts.active}
                  </span>
                </div>
              )}
              {prodinsuranceCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {prodinsuranceCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {prodinsuranceCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {prodinsuranceCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {prodinsuranceCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {prodinsuranceCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/lifeinsurance">
              Ходимларни хаётини суғурталаш полисилари
            </Link>
            <div className="flex gap-8">
              {lifeinsuranceCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {lifeinsuranceCounts.active}
                  </span>
                </div>
              )}
              {lifeinsuranceCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {lifeinsuranceCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {lifeinsuranceCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {lifeinsuranceCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {lifeinsuranceCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {lifeinsuranceCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/ecology">
              Экология хулосалари
            </Link>
            <div className="flex gap-8">
              {ecologyCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {ecologyCounts.active}
                  </span>
                </div>
              )}
              {ecologyCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {ecologyCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {ecologyCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {ecologyCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {ecologyCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {ecologyCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>
      </ul>
      <div>
        <button className="btn btn-outline">
          <Link to="/">Орқага</Link>
        </button>
      </div>
    </div>
  );
}

export default Docs;
