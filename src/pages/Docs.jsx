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
        license.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        ngsertificate.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        humidity.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        gasanalyzer.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        lifeinsurance.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
        ecology.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  // IK

  const ik = useAppStore((state) => state.ik); // zamena zamena
  const setIk = useAppStore((state) => state.setIk); //zamena zamena
  const [showAllIk, setShowAllIk] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ik"), //zamena
      setIk, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setIk]); //zamena

  const filterIk = () => {
    //zamena
    let filtered = [...ik]; //zamena

    if (!showAllIk) {
      //zamena
      const latestIk = filtered.reduce((acc, ik) => {
        //zamena zamena
        const { station_id, expiration } = ik; //zamena
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = ik; //zamena
        }
        return acc;
      }, {});
      filtered = Object.values(latestIk); //zamena
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (
          ik //zamena
        ) => getStationNameByNumber(ik.station_id) === selectedStation //zamena
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (
          ik //zamena
        ) =>
          ik.docNumber //zamena zamena
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const ikCounts = filterIk().reduce(
    //zamena
    (acc, ik) => {
      //zamena
      const expirationDate = new Date(parseDate(ik.expiration)); //zamena
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

  // pilot

  const pilot = useAppStore((state) => state.pilot);
  const setPilot = useAppStore((state) => state.setPilot);
  const [showAllPilot, setShowAllPilot] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "pilot"),
      setPilot,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setPilot]);

  const filterPilot = () => {
    let filtered = [...pilot];

    if (!showAllPilot) {
      const latestPilot = filtered.reduce((acc, pilot) => {
        const { station_id, expiration } = pilot;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = pilot;
        }
        return acc;
      }, {});
      filtered = Object.values(latestPilot);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (pilot) => getStationNameByNumber(pilot.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((pilot) =>
        pilot.docNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const pilotCounts = filterPilot().reduce(
    (acc, pilot) => {
      const expirationDate = new Date(parseDate(pilot.expiration));
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

  // shayba

  const shayba = useAppStore((state) => state.shayba); // zamena zamena
  const setShayba = useAppStore((state) => state.setShayba); //zamena zamena
  const [showAllShayba, setShowAllShayba] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "shayba"), //zamena
      setShayba, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setShayba]); //zamena

  const filterShayba = () => {
    //zamena
    let filtered = [...shayba]; //zamena

    if (!showAllShayba) {
      //zamena
      const latestShayba = filtered.reduce((acc, shayba) => {
        //zamena zamena
        const { station_id, expiration } = shayba; //zamena
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = shayba; //zamena
        }
        return acc;
      }, {});
      filtered = Object.values(latestShayba); //zamena
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (
          shayba //zamena
        ) => getStationNameByNumber(shayba.station_id) === selectedStation //zamena
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (
          shayba //zamena
        ) =>
          shayba.docNumber //zamena zamena
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const shaybaCounts = filterShayba().reduce(
    //zamena
    (acc, shayba) => {
      //zamena
      const expirationDate = new Date(parseDate(shayba.expiration)); //zamena
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

  // water

  const water = useAppStore((state) => state.water); // zamena zamena
  const setWater = useAppStore((state) => state.setWater); //zamena zamena
  const [showAllWater, setShowAllWater] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "water"), //zamena
      setWater, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setWater]); //zamena

  const filterWater = () => {
    //zamena
    let filtered = [...water]; //zamena

    if (!showAllWater) {
      //zamena
      const latestWater = filtered.reduce((acc, water) => {
        //zamena zamena
        const { station_id, expiration } = water; //zamena
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = water; //zamena
        }
        return acc;
      }, {});
      filtered = Object.values(latestWater); //zamena
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (
          water //zamena
        ) => getStationNameByNumber(water.station_id) === selectedStation //zamena
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (
          water //zamena
        ) =>
          water.docNumber //zamena zamena
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const waterCounts = filterWater().reduce(
    //zamena
    (acc, water) => {
      //zamena
      const expirationDate = new Date(parseDate(water.expiration)); //zamena
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

  // electric

  const electric = useAppStore((state) => state.electric); // zamena zamena
  const setElectric = useAppStore((state) => state.setElectric); //zamena zamena
  const [showAllElectric, setShowAllElectric] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "electric"), //zamena
      setElectric, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setElectric]); //zamena

  const filterElectric = () => {
    //zamena
    let filtered = [...electric]; //zamena

    if (!showAllElectric) {
      //zamena
      const latestElectric = filtered.reduce((acc, electric) => {
        //zamena zamena
        const { station_id, expiration } = electric; //zamena
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = electric; //zamena
        }
        return acc;
      }, {});
      filtered = Object.values(latestElectric); //zamena
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (
          electric //zamena
        ) => getStationNameByNumber(electric.station_id) === selectedStation //zamena
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (
          electric //zamena
        ) =>
          electric.docNumber //zamena zamena
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const electricCounts = filterElectric().reduce(
    //zamena
    (acc, electric) => {
      //zamena
      const expirationDate = new Date(parseDate(electric.expiration)); //zamena
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

  // kolonka

  const kolonka = useAppStore((state) => state.kolonka); // zamena zamena
  const setKolonka = useAppStore((state) => state.setKolonka); //zamena zamena
  const [showAllKolonka, setShowAllKolonka] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "kolonka"), //zamena
      setKolonka, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setKolonka]); //zamena

  const filterKolonka = () => {
    //zamena
    let filtered = [...kolonka]; //zamena

    if (!showAllKolonka) {
      //zamena
      const latestKolonka = filtered.reduce((acc, kolonka) => {
        //zamena zamena
        const { station_id, expiration } = kolonka; //zamena
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = kolonka; //zamena
        }
        return acc;
      }, {});
      filtered = Object.values(latestKolonka); //zamena
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (
          kolonka //zamena
        ) => getStationNameByNumber(kolonka.station_id) === selectedStation //zamena
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (
          kolonka //zamena
        ) =>
          kolonka.docNumber //zamena zamena
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const kolonkaCounts = filterKolonka().reduce(
    //zamena
    (acc, kolonka) => {
      //zamena
      const expirationDate = new Date(parseDate(kolonka.expiration)); //zamena
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
          <Link
            className="flex justify-between items-center gap-5 w-full text-xl "
            to="/licenses"
          >
            <Button className="flex justify-between items-center gap-5 w-full text-xl">
              Лицензиялар
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
          </Link>
        </li>

        <li className="flex justify-center w-full">
          <Link
            className="flex justify-between items-center gap-5 w-full text-xl "
            to="/ngsertificates"
          >
            <Button className="flex justify-between items-center gap-5 w-full text-xl">
              Табиий газ сертификатлари
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
          </Link>
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

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/ik">
              Ўлов комплекслари ИК сертификатлари
            </Link>
            <div className="flex gap-8">
              {ikCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {ikCounts.active}
                  </span>
                </div>
              )}
              {ikCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {ikCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {ikCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {ikCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {ikCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {ikCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/pilot">
              Автопилот сертификатлари
            </Link>
            <div className="flex gap-8">
              {pilotCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {pilotCounts.active}
                  </span>
                </div>
              )}
              {pilotCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {pilotCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {pilotCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {pilotCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {pilotCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {pilotCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Button className="flex justify-between items-center gap-5 w-full">
            <Link className="text-xl" to="/shayba">
              Шайба сертификатлари
            </Link>
            <div className="flex gap-8">
              {shaybaCounts.active > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-green-500">
                    {shaybaCounts.active}
                  </span>
                </div>
              )}
              {shaybaCounts.expiringSoon15 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-yellow-500">
                    {shaybaCounts.expiringSoon15}
                  </span>
                </div>
              )}
              {shaybaCounts.expiringSoon5 > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-orange-500">
                    {shaybaCounts.expiringSoon5}
                  </span>
                </div>
              )}
              {shaybaCounts.expired > 0 && (
                <div className="indicator ">
                  <span className="badge badge-sm indicator-item bg-red-700 text-white">
                    {shaybaCounts.expired}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </li>

        <li className="flex justify-center w-full">
          <Link
            className="flex justify-between items-center gap-5 w-full text-xl "
            to="/water"
          >
            <Button className="flex justify-between items-center gap-5 w-full text-xl">
              Сув ҳисоблагич сертификатлари
              <div className="flex gap-8">
                {waterCounts.active > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-green-500">
                      {waterCounts.active}
                    </span>
                  </div>
                )}
                {waterCounts.expiringSoon15 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-yellow-500 ">
                      {waterCounts.expiringSoon15}
                    </span>
                  </div>
                )}
                {waterCounts.expiringSoon5 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-orange-500">
                      {waterCounts.expiringSoon5}
                    </span>
                  </div>
                )}
                {waterCounts.expired > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-red-700 text-white">
                      {waterCounts.expired}
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </Link>
        </li>

        <li className="flex justify-center w-full">
          <Link
            className="flex justify-between items-center gap-5 w-full text-xl "
            to="/electric"
          >
            <Button className="flex justify-between items-center gap-5 w-full text-xl">
              Электр ҳисоблагич сертификатлари
              <div className="flex gap-8">
                {electricCounts.active > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-green-500">
                      {electricCounts.active}
                    </span>
                  </div>
                )}
                {electricCounts.expiringSoon15 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-yellow-500 ">
                      {electricCounts.expiringSoon15}
                    </span>
                  </div>
                )}
                {electricCounts.expiringSoon5 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-orange-500">
                      {electricCounts.expiringSoon5}
                    </span>
                  </div>
                )}
                {electricCounts.expired > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-red-700 text-white">
                      {electricCounts.expired}
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </Link>
        </li>

        <li className="flex justify-center w-full">
          <Link
            className="flex justify-between items-center gap-5 w-full text-xl "
            to="/kolonka"
          >
            <Button className="flex justify-between items-center gap-5 w-full text-xl">
              Колонкалар сертификатлари
              <div className="flex gap-8">
                {kolonkaCounts.active > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-green-500">
                      {kolonkaCounts.active}
                    </span>
                  </div>
                )}
                {kolonkaCounts.expiringSoon15 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-yellow-500 ">
                      {kolonkaCounts.expiringSoon15}
                    </span>
                  </div>
                )}
                {kolonkaCounts.expiringSoon5 > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-orange-500">
                      {kolonkaCounts.expiringSoon5}
                    </span>
                  </div>
                )}
                {kolonkaCounts.expired > 0 && (
                  <div className="indicator ">
                    <span className="badge badge-sm indicator-item bg-red-700 text-white">
                      {kolonkaCounts.expired}
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </Link>
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
