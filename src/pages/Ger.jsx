import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand/index";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../components/ui/input";
import GerList from "../components/ger/GerList";
import AddNewGer from "../components/ger/AddNewGer";

function Ger() {
  // замена
  const [sendingData, setSendingData] = useState(null);
  const [showAllDocs, setShowAllDocs] = useState(true);
  const [selectedStation, setSelectedStation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpirationFilter, setSelectedExpirationFilter] =
    useState("all");
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const ger = useAppStore((state) => state.ger); //zamena
  const setGer = useAppStore((state) => state.setGer); //zamena

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser
    );
  }, [user, setStations]);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ltd"),
      setLtd,
      user,
      setUser
    );
  }, [user, setLtd]);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "ger"), // zamena
      setGer, // zamena
      user,
      setUser
    );
  }, [user, setGer]); // zamena

  const getLtdNameById = (id) => {
    if (!ltd || ltd.length === 0) return "Номаълум";
    const ltdItem = ltd.find((item) => item.id === id);
    return ltdItem ? ltdItem.ltd_name : "Номаълум";
  };

  const getStationNameByNumber = (stationId) => {
    if (!stations || stations.length === 0) return "Номаълум";
    const stationsItem = stations.find((item) => item.id == stationId);
    return stationsItem ? stationsItem.moljal : "Номаълум";
  };

  const getStationNumberByNumber = (stationNumber) => {
    const stationItem = stations.find(
      (item) => item.station_number === stationNumber
    );
    return stationItem ? stationItem.station_number : "Номаълум";
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const filteredDocs = () => {
    let filtered = [...ger]; //zamena

    if (!showAllDocs) {
      const latestDocs = filtered.reduce((acc, doc) => {
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
      filtered = Object.values(latestDocs);
    }

    if (selectedStation && selectedStation !== "all") {
      filtered = filtered.filter(
        (doc) => getStationNameByNumber(doc.station_id) === selectedStation
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) => doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) //zamena
      );
    }

    if (selectedExpirationFilter !== "all") {
      const currentDate = new Date();
      filtered = filtered.filter((doc) => {
        const expirationDate = new Date(parseDate(doc.expiration));
        const daysLeft = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);

        if (selectedExpirationFilter === "5" && daysLeft <= 5 && daysLeft > 0) {
          return true;
        }
        if (
          selectedExpirationFilter === "15" &&
          daysLeft <= 15 &&
          daysLeft > 5
        ) {
          return true;
        }
        if (
          selectedExpirationFilter === "30" &&
          daysLeft <= 30 &&
          daysLeft > 15
        ) {
          return true;
        }
        if (selectedExpirationFilter === "expired" && daysLeft <= 0) {
          return true;
        }

        return false;
      });
    }

    return filtered;
  };

  if (!stations || !ger || !ltd) {
    //zamena
    return (
      <div className="flex items-center justify-center h-screen">
        <PulseLoader speedMultiplier={0.5} />
      </div>
    );
  }

  const exportToExcel = () => {
    const filteredExcel = filteredDocs();

    const data = filteredExcel.map((doc, index) => ({
      "#": index + 1,
      "Шахобча номи": getStationNameByNumber(doc.station_id),
      "МЧЖ номи ва рақами": `${getLtdNameById(
        doc.ltd_id
      )} АГТКШ № ${getStationNumberByNumber(doc.station_number)}`,
      "Далолатнома рақами": doc.docNumber, //zamena
      "Берилган сана": doc.issue,
      "Амал қилиш санаси": doc.expiration,
      Холати:
        new Date(parseDate(doc.expiration)) > new Date()
          ? "Амалда"
          : "Муддати тугаган",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GERMETIKA"); //zamena

    XLSX.writeFile(workbook, "germetika.xlsx"); //zamena
  };
  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col items-center justify-between gap-1">
          <div className="flex justify-between w-full px-4">
            <h1 className="text-3xl font-bold">
              Кўпик орқали технологиялардан утечкаларни текшириш далолатномалари
            </h1>
            {user.type === "admin" ? (
              <Button
                onClick={setAddItemModal}
                disabled={ger ? false : true} //zamena
                className={ger ? "cursor-pointer" : "cursor-not-allowed"} //zamena
              >
                Янги далолатнома қўшиш
              </Button> //zamena
            ) : null}
          </div>
          <div></div>

          <div className="flex flex-col items-center font-bold mb-4">
            <div className="flex items-end gap-10 justify-between w-full">
              <div className="flex items-center mb-1">
                <label className="mr-2"></label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showAllDocs}
                  onChange={(e) => setShowAllDocs(e.target.checked)}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1>Саралаш</h1>
                <div className="flex gap-5">
                  <Select
                    onValueChange={(value) => setSelectedStation(value)}
                    className="w-[180px]"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Шахобча номи билан" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Шахобча номи</SelectLabel>
                        <SelectItem value="all" className="font-bold">
                          Барча шахобчалар
                        </SelectItem>

                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.moljal}>
                            {station.moljal}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setSelectedExpirationFilter(value)
                    }
                    className="w-[180px]"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Муддати бўйича" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Тугаш санаси</SelectLabel>
                        <SelectItem value="all" className="font-bold">
                          Барчаси
                        </SelectItem>
                        <SelectItem value="5">5 кун қолганлари</SelectItem>
                        <SelectItem value="15">15 кун қолганлари</SelectItem>
                        <SelectItem value="30">30 кун қолганлари</SelectItem>
                        <SelectItem value="expired">
                          Муддати ўтганлари
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="далолатнома рақами билан" //zamena
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-[200px]"
                  />
                </div>
              </div>

              <div className="flex justify-between px-4">
                <Button
                  onClick={exportToExcel}
                  className="ml-2"
                  variant="outline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.53125 C 27.867188 6.808594 27.867188 7.128906 28 7.40625 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 34 37 L 34 35 L 30 35 L 30 29 L 34 29 L 34 27 L 30 27 L 30 22 L 34 22 L 34 20 L 30 20 L 30 15 L 34 15 L 34 13 L 30 13 Z M 36 13 L 36 15 L 44 15 L 44 13 Z M 6.6875 15.6875 L 12.15625 25.03125 L 6.1875 34.375 L 11.1875 34.375 L 14.4375 28.34375 C 14.664063 27.761719 14.8125 27.316406 14.875 27.03125 L 14.90625 27.03125 C 15.035156 27.640625 15.160156 28.054688 15.28125 28.28125 L 18.53125 34.375 L 23.5 34.375 L 17.75 24.9375 L 23.34375 15.6875 L 18.65625 15.6875 L 15.6875 21.21875 C 15.402344 21.941406 15.199219 22.511719 15.09375 22.875 L 15.0625 22.875 C 14.898438 22.265625 14.710938 21.722656 14.5 21.28125 L 11.8125 15.6875 Z M 36 20 L 36 22 L 44 22 L 44 20 Z M 36 27 L 36 29 L 44 29 L 44 27 Z M 36 35 L 36 37 L 44 37 L 44 35 Z"></path>
                  </svg>
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Шахобча номи</th>
              <th className="text-center">МЧЖ номи ва рақами</th>
              <th className="text-center">сертификат рақами</th>
              <th className="text-center">Берилган сана</th>
              <th className="text-center">Амал қилиш санаси</th>
              <th className="text-center">Файл</th>
              <th className="text-center">Холати</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs().length > 0 ? (
              filteredDocs().map(
                ({
                  id,
                  station_id,
                  ltd_id,
                  station_number,
                  docNumber, //zamena
                  issue,
                  expiration,
                  value,
                }) => (
                  <GerList
                    key={id}
                    id={id}
                    moljal={getStationNameByNumber(station_id)}
                    ltd_name={getLtdNameById(ltd_id)}
                    station_number={getStationNumberByNumber(station_number)}
                    docNumber={docNumber} //zamena
                    issue={issue}
                    expiration={expiration}
                    value={value}
                  />
                )
              )
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <h1 className="my-5 btn-link text-2xl italic">
                    Далолатномалар мавжуд эмас
                  </h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddNewGer sendingData={sendingData} setSendingData={setSendingData} />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/docs">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Ger;
