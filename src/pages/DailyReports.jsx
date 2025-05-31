import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getDailyReports, getStations, refreshToken } from "../request";
import { Button } from "../components/ui/button";
import { ClockLoader, PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import DailyReportList from "../components/DailyReportList";
import AddNewDailyReport from "../components/AddNewDailyReport";

function DailyReports() {
  const [sendingData, setSendingData] = useState(null);
  const dailyreports = useAppStore((state) => state.dailyreports);
  const setDailyreports = useAppStore((state) => state.setDailyreports);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);

  // Получаем станции оператора
  const filteredStations = stations?.filter((station) =>
    station.operators.includes(user?.id.toString())
  );

  // Фильтруем отчеты по станциям оператора
  const filteredReports = dailyreports?.filter((report) =>
    filteredStations?.some((station) => station.id === report.station_id)
  );

  useEffect(() => {
    // Загрузка станций
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
              setStations(data);
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });

    // Загрузка отчетов
    getDailyReports(user?.access_token)
      .then((data) => {
        setDailyreports(data);
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getDailyReports(access_token);
            })
            .then((data) => setDailyreports(data))
            .catch((err) => console.error("Error after refresh:", err));
        }
      });
  }, [user, setDailyreports, setUser, sendingData, setStations]);

  const sortedReports = filteredReports
    ? [...filteredReports].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      })
    : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загрузка станций
        const stationsResponse = await getStations(user?.access_token);
        setStations(stationsResponse.data);

        // Загрузка отчетов
        const reportsResponse = await getDailyReports(user?.access_token);
        setDailyreports(reportsResponse);
      } catch (error) {
        // Обработка ошибок...
      }
    };

    loadData();
  }, [user, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Кунлик ҳисобот</h1>

          <Button
            onClick={setAddItemModal}
            disabled={!filteredStations?.length}
            className={
              filteredStations?.length ? "cursor-pointer" : "cursor-not-allowed"
            }
          >
            Кунлик ҳисоботни яратиш
          </Button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <table className="table table-xs">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th>#</th>
                <th>Сана</th>
                <th>Сотув нархи</th>
                <th>Пилот</th>
                <th>Колонка</th>
                <th>Фарқи</th>
                <th>Йўқотиш коэф</th>

                <th>Шартнома</th>
                <th>Терминал</th>
                <th>Z-отчет</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedReports ? (
                sortedReports.length > 0 ? (
                  sortedReports.map(
                    ({
                      id,
                      date,
                      price,
                      pilot,
                      kolonka,
                      difference,
                      losscoef,
                      transfer,
                      terminal,
                      zreport,
                    }) => (
                      <DailyReportList
                        key={id}
                        id={id}
                        date={date}
                        price={price}
                        pilot={pilot}
                        kolonka={kolonka}
                        difference={difference}
                        losscoef={losscoef}
                        transfer={transfer}
                        terminal={terminal}
                        zreport={zreport}
                      />
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="11">Ҳисобот мавжуд эмас</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    <div className="flex w-full mt-10 mb-10 justify-end items-center">
                      <PulseLoader speedMultiplier={0.5} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddNewDailyReport
        sendingData={sendingData}
        setSendingData={setSendingData}
        stations={filteredStations}
        dailyreports={dailyreports}
      />
      <div className="flex w-full h-screen justify-center ">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default DailyReports;
