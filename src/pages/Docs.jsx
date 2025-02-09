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
  const [showAllLicenses, setShowAllLicenses] = useState(false);

  const [selectedStation, setSelectedStation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const filterDocuments = (documents, showAll, selectedStation, searchTerm) => {
    let filtered = [...documents];

    if (!showAll) {
      const latestDocuments = filtered.reduce((acc, doc) => {
        const { station_id, expiration } = doc;
        const parsedExpiration = new Date(parseDate(expiration));

        if (
          !acc[station_id] ||
          new Date(parseDate(acc[station_id].expiration)) < parsedExpiration
        ) {
          acc[station_id] = doc;
        }
        return acc;
      }, {});
      filtered = Object.values(latestDocuments);
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

  const countDocuments = (documents) => {
    return documents.reduce(
      (acc, doc) => {
        const expirationDate = new Date(parseDate(doc.expiration));
        const currentDate = new Date();

        if (expirationDate < currentDate) {
          acc.expired += 1;
        } else if (
          (expirationDate - currentDate) / (1000 * 60 * 60 * 24) <=
          5
        ) {
          acc.expiringSoon5 += 1;
        } else if (
          (expirationDate - currentDate) / (1000 * 60 * 60 * 24) <=
          15
        ) {
          acc.expiringSoon15 += 1;
        } else if (
          (expirationDate - currentDate) / (1000 * 60 * 60 * 24) <=
          30
        ) {
          acc.active += 1;
        }
        return acc;
      },
      { active: 0, expiringSoon5: 0, expiringSoon15: 0, expired: 0 }
    );
  };

  const DocumentLink = ({ to, title, counts }) => (
    <li className="flex justify-center w-full">
      <Link
        className="flex justify-between items-center gap-5 w-full text-xl"
        to={to}
      >
        <Button className="flex justify-between items-center gap-5 w-full text-xl">
          {title}
          <div className="flex gap-8">
            {counts.active > 0 && (
              <div className="indicator">
                <span className="badge badge-sm indicator-item bg-green-500">
                  {counts.active}
                </span>
              </div>
            )}
            {counts.expiringSoon15 > 0 && (
              <div className="indicator">
                <span className="badge badge-sm indicator-item bg-yellow-500">
                  {counts.expiringSoon15}
                </span>
              </div>
            )}
            {counts.expiringSoon5 > 0 && (
              <div className="indicator">
                <span className="badge badge-sm indicator-item bg-orange-500">
                  {counts.expiringSoon5}
                </span>
              </div>
            )}
            {counts.expired > 0 && (
              <div className="indicator">
                <span className="badge badge-sm indicator-item bg-red-700 text-white">
                  {counts.expired}
                </span>
              </div>
            )}
          </div>
        </Button>
      </Link>
    </li>
  );

  // licenses
  const licenses = useAppStore((state) => state.licenses);
  const setLicenses = useAppStore((state) => state.setLicenses);
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

  const filterLicenses = () =>
    filterDocuments(licenses, showAllLicenses, selectedStation, searchTerm);
  const licenseCounts = countDocuments(filterLicenses());

  //ngsertificates

  const [showAllNGSertificates, setShowAllNGSertificates] = useState(false);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const setNgsertificates = useAppStore((state) => state.setNgsertificates);

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

  const filterNgsertificates = () =>
    filterDocuments(
      ngsertificates,
      showAllNGSertificates,
      selectedStation,
      searchTerm
    );
  const ngsertificatesCounts = countDocuments(filterNgsertificates());

  // humidity

  const humidity = useAppStore((state) => state.humidity); //zamena //zamena
  const setHumidity = useAppStore((state) => state.setHumidity); //zamena //zamena
  const [showAllHumidity, setShowAllHumidity] = useState(false); //zamena //zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "humidityes"), //zamena
      setHumidity, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setHumidity]); //zamena

  const filterHumidity = () =>
    //zamena
    filterDocuments(
      humidity, //zamena
      showAllHumidity, //zamena
      selectedStation,
      searchTerm
    );
  const humidityCounts = countDocuments(filterHumidity()); //zamena //zamena

  // gasanalyzers

  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const setGasanalyzers = useAppStore((state) => state.setGasanalyzers);
  const [showAllGasAnalyzers, setShowAllGasAnalyzers] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "gasanalyzers"), //zamena
      setGasanalyzers, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setGasanalyzers]); //zamena

  const filterGasanalyzers = () =>
    //zamena
    filterDocuments(
      gasanalyzers, //zamena
      showAllGasAnalyzers, //zamena
      selectedStation,
      searchTerm
    );
  const gasanalyzersCounts = countDocuments(filterGasanalyzers()); //zamena //zamena

  //prodinsurance

  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const setProdinsurance = useAppStore((state) => state.setProdinsurance);
  const [showAllProdinsurance, setShowAllProdinsurance] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "prodinsurances"), //zamena
      setProdinsurance, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setProdinsurance]); //zamena

  const filterProdinsurance = () =>
    //zamena
    filterDocuments(
      prodinsurance, //zamena
      showAllProdinsurance, //zamena
      selectedStation,
      searchTerm
    );
  const prodinsuranceCounts = countDocuments(filterProdinsurance()); //zamena //zamena

  //lifeinsurance

  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const setLifeinsurance = useAppStore((state) => state.setLifeinsurance);
  const [showAllLifeinsurance, setShowAllLifeinsurance] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "lifeinsurances"), //zamena
      setLifeinsurance, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setLifeinsurance]); //zamena

  const filterLifeinsurances = () =>
    //zamena
    filterDocuments(
      lifeinsurance, //zamena
      showAllLifeinsurance, //zamena
      selectedStation,
      searchTerm
    );
  const lifeinsuranceCounts = countDocuments(filterLifeinsurances()); //zamena //zamena

  //Ecology

  const ecology = useAppStore((state) => state.ecology);
  const setEcology = useAppStore((state) => state.setEcology);
  const [showAllEcology, setShowAllEcology] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ecology"), //zamena
      setEcology, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setEcology]); //zamena

  const filterEcology = () =>
    //zamena
    filterDocuments(
      ecology, //zamena
      showAllEcology, //zamena
      selectedStation,
      searchTerm
    );
  const ecologyCounts = countDocuments(filterEcology()); //zamena //zamena

  // ik

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

  const filterIk = () =>
    //zamena
    filterDocuments(
      ik, //zamena
      showAllIk, //zamena
      selectedStation,
      searchTerm
    );
  const ikCounts = countDocuments(filterIk()); //zamena //zamena

  //pilot

  const pilot = useAppStore((state) => state.pilot);
  const setPilot = useAppStore((state) => state.setPilot);
  const [showAllPilot, setShowAllPilot] = useState(false);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "pilot"), //zamena
      setPilot, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setPilot]); //zamena

  const filterPilot = () =>
    //zamena
    filterDocuments(
      pilot, //zamena
      showAllPilot, //zamena
      selectedStation,
      searchTerm
    );
  const pilotCounts = countDocuments(filterPilot()); //zamena //zamena

  //shayba

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

  const filterShayba = () =>
    //zamena
    filterDocuments(
      shayba, //zamena
      showAllShayba, //zamena
      selectedStation,
      searchTerm
    );
  const shaybaCounts = countDocuments(filterShayba()); //zamena //zamena

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

  const filterWater = () =>
    //zamena
    filterDocuments(
      water, //zamena
      showAllWater, //zamena
      selectedStation,
      searchTerm
    );
  const waterCounts = countDocuments(filterWater()); //zamena //zamena

  //electric

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

  const filterElectric = () =>
    //zamena
    filterDocuments(
      electric, //zamena
      showAllElectric, //zamena
      selectedStation,
      searchTerm
    );
  const electricCounts = countDocuments(filterElectric()); //zamena //zamena

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

  const filterKolonka = () =>
    //zamena
    filterDocuments(
      kolonka, //zamena
      showAllKolonka, //zamena
      selectedStation,
      searchTerm
    );
  const kolonkaCounts = countDocuments(filterKolonka()); //zamena //zamena

  //manometr

  const manometr = useAppStore((state) => state.manometr); // zamena zamena
  const setManometr = useAppStore((state) => state.setManometr); //zamena zamena
  const [showAllManometr, setShowAllManometr] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "manometr"), //zamena
      setManometr, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setManometr]); //zamena

  const filterManometr = () =>
    //zamena
    filterDocuments(
      manometr, //zamena
      showAllManometr, //zamena
      selectedStation,
      searchTerm
    );
  const manometrCounts = countDocuments(filterManometr()); //zamena //zamena

  //termometr

  const termometr = useAppStore((state) => state.termometr); // zamena zamena
  const setTermometr = useAppStore((state) => state.setTermometr); //zamena zamena
  const [showAllTermometr, setShowAllTermometr] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "termometr"), //zamena
      setTermometr, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setTermometr]); //zamena

  const filterTermometr = () =>
    //zamena
    filterDocuments(
      termometr, //zamena
      showAllTermometr, //zamena
      selectedStation,
      searchTerm
    );
  const termometrCounts = countDocuments(filterTermometr()); //zamena //zamena

  // voltmetr

  const voltmetr = useAppStore((state) => state.voltmetr); // zamena zamena
  const setVoltmetr = useAppStore((state) => state.setVoltmetr); //zamena zamena
  const [showAllVoltmetr, setShowAllVoltmetr] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "voltmetr"), //zamena
      setVoltmetr, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setVoltmetr]); //zamena

  const filterVoltmetr = () =>
    //zamena
    filterDocuments(
      voltmetr, //zamena
      showAllVoltmetr, //zamena
      selectedStation,
      searchTerm
    );
  const voltmetrCounts = countDocuments(filterVoltmetr()); //zamena //zamena

  //shlang

  const shlang = useAppStore((state) => state.shlang); // zamena zamena
  const setShlang = useAppStore((state) => state.setShlang); //zamena zamena
  const [showAllShlang, setShowAllShlang] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "shlang"), //zamena
      setShlang, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setShlang]); //zamena

  const filterShlang = () =>
    //zamena
    filterDocuments(
      shlang, //zamena
      showAllShlang, //zamena
      selectedStation,
      searchTerm
    );
  const shlangCounts = countDocuments(filterShlang()); //zamena //zamena

  //ppk

  const ppk = useAppStore((state) => state.ppk); // zamena zamena
  const setPpk = useAppStore((state) => state.setPpk); //zamena zamena
  const [showAllPpk, setShowAllPpk] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ppk"), //zamena
      setPpk, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setPpk]); //zamena

  const filterPpk = () =>
    //zamena
    filterDocuments(
      ppk, //zamena
      showAllPpk, //zamena
      selectedStation,
      searchTerm
    );
  const ppkCounts = countDocuments(filterPpk()); //zamena //zamena

  // elprotec

  const elprotec = useAppStore((state) => state.elprotec); // zamena zamena
  const setElprotec = useAppStore((state) => state.setElprotec); //zamena zamena
  const [showAllElprotec, setShowAllElprotec] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "elprotec"), //zamena
      setElprotec, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setElprotec]); //zamena

  const filterElprotec = () =>
    //zamena
    filterDocuments(
      elprotec, //zamena
      showAllElprotec, //zamena
      selectedStation,
      searchTerm
    );
  const elprotecCounts = countDocuments(filterElprotec()); //zamena //zamena

  // mol

  const mol = useAppStore((state) => state.mol); // zamena zamena
  const setMol = useAppStore((state) => state.setMol); //zamena zamena
  const [showAllMol, setShowAllMol] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "mol"), //zamena
      setMol, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setMol]); //zamena

  const filterMol = () =>
    //zamena
    filterDocuments(
      mol, //zamena
      showAllMol, //zamena
      selectedStation,
      searchTerm
    );
  const molCounts = countDocuments(filterMol()); //zamena //zamena

  //smazka

  const smazka = useAppStore((state) => state.smazka); // zamena zamena
  const setSmazka = useAppStore((state) => state.setSmazka); //zamena zamena
  const [showAllSmazka, setShowAllSmazka] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "smazka"), //zamena
      setSmazka, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setSmazka]); //zamena

  const filterSmazka = () =>
    //zamena
    filterDocuments(
      smazka, //zamena
      showAllSmazka, //zamena
      selectedStation,
      searchTerm
    );
  const smazkaCounts = countDocuments(filterSmazka()); //zamena //zamena

  //ger

  const ger = useAppStore((state) => state.ger); // zamena zamena
  const setGer = useAppStore((state) => state.setGer); //zamena zamena
  const [showAllGer, setShowAllGer] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ger"), //zamena
      setGer, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setGer]); //zamena

  const filterGer = () =>
    //zamena
    filterDocuments(
      ger, //zamena
      showAllGer, //zamena
      selectedStation,
      searchTerm
    );
  const gerCounts = countDocuments(filterGer()); //zamena //zamena

  //aptechka

  const aptek = useAppStore((state) => state.aptek); // zamena zamena
  const setAptek = useAppStore((state) => state.setAptek); //zamena zamena
  const [showAllAptek, setShowAllAptek] = useState(false); //zamena zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "aptek"), //zamena
      setAptek, //zamena
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setAptek]); //zamena

  const filterAptek = () =>
    //zamena
    filterDocuments(
      aptek, //zamena
      showAllAptek, //zamena
      selectedStation,
      searchTerm
    );
  const aptekCounts = countDocuments(filterAptek()); //zamena //zamena

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Хужжатлар рўйхати</h1>
      </div>
      <ul className="flex flex-col justify-center items-center gap-3 w-[600px]">
        <DocumentLink
          to="/licenses"
          title="1. Лицензиялар"
          counts={licenseCounts}
        />

        <DocumentLink
          to="/ngsertificates" //zamena
          title="2. Табиий газ сертификатлари" //zamena
          counts={ngsertificatesCounts} //zamena
        />

        <DocumentLink
          to="/humidity" //zamena
          title="3. Влагомер сертификатлари" //zamena
          counts={humidityCounts} //zamena
        />

        <DocumentLink
          to="/gasanalyzers" //zamena
          title="4. Газ анализатор сертификатлари" //zamena
          counts={gasanalyzersCounts} //zamena
        />

        <DocumentLink
          to="/prodinsurance" //zamena
          title="5. Хавфли ишлаб чиқариш объекти полиси" //zamena
          counts={prodinsuranceCounts} //zamena
        />

        <DocumentLink
          to="/lifeinsurance" //zamena
          title="6. Ходимлар хаётини суғурталаш полиси" //zamena
          counts={lifeinsuranceCounts} //zamena
        />

        <DocumentLink
          to="/ecology" //zamena
          title="7. Экология хулосалари" //zamena
          counts={ecologyCounts} //zamena
        />

        <DocumentLink
          to="/ik" //zamena
          title="8. Ўлчов комплекси сертификатлари" //zamena
          counts={ikCounts} //zamena
        />

        <DocumentLink
          to="/pilot" //zamena
          title="9. Автопилот сертификатлари" //zamena
          counts={pilotCounts} //zamena
        />

        <DocumentLink
          to="/shayba" //zamena
          title="10. Шайба сертификатлари" //zamena
          counts={shaybaCounts} //zamena
        />

        <DocumentLink
          to="/water" //zamena
          title="11. Сув ҳисоблагич сертификатлари" //zamena
          counts={waterCounts} //zamena
        />

        <DocumentLink
          to="/electric" //zamena
          title="12. Электр энергия ҳисоблагич сертификатлари" //zamena
          counts={electricCounts} //zamena
        />

        <DocumentLink
          to="/kolonka" //zamena
          title="13. Колонкалар сертификатлари" //zamena
          counts={kolonkaCounts} //zamena
        />

        <DocumentLink
          to="/manometr" //zamena
          title="14. Манометрлар сертификатлари" //zamena
          counts={manometrCounts} //zamena
        />

        <DocumentLink
          to="/termometr" //zamena
          title="15. Термометрлар сертификатлари" //zamena
          counts={termometrCounts} //zamena
        />

        <DocumentLink
          to="/voltmetr" //zamena
          title="16. Амперметр ва вольтметр сертификатлари" //zamena
          counts={voltmetrCounts} //zamena
        />

        <DocumentLink
          to="/shlang" //zamena
          title="17. Газ тўлдириш шланглари далолатномалари" //zamena
          counts={shlangCounts} //zamena
        />

        <DocumentLink
          to="/ppk" //zamena
          title='18. Сақловчи клапанлар ("ППК") синов далолатномалари' //zamena
          counts={ppkCounts} //zamena
        />

        <DocumentLink
          to="/elprotec" //zamena
          title="19. Электр ҳимоя воситалари синов далолатномалари" //zamena
          counts={elprotecCounts} //zamena
        />

        <DocumentLink
          to="/mol" //zamena
          title="20. Чақмоқ қайтаргич синов далолатномалари" //zamena
          counts={molCounts} //zamena
        />

        <DocumentLink
          to="/smazka" //zamena
          title="21. Технологияларни мойлаш далолатномалари" //zamena
          counts={smazkaCounts} //zamena
        />

        <DocumentLink
          to="/ger" //zamena
          title="22. Технологияларни кўпикда текшириш далолатномалари" //zamena
          counts={gerCounts} //zamena
        />

        <DocumentLink
          to="/aptek" //zamena
          title="23. Аптечкани  текшириш далолатномалари" //zamena
          counts={aptekCounts} //zamena
        />
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
