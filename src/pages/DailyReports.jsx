import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import {
  getDailyReports,
  getDocs,
  getPartnerDailyReports,
  getPartners,
  getStations,
  refreshToken,
} from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import DailyReportList from "../components/DailyReportList";
import AddNewDailyReport from "../components/AddNewDailyReport";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useTokenValidation } from "../hooks/useTokenValidation";

function DailyReports() {
  const [sendingData, setSendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStation, setSelectedStation] = useState("all");
  const [reportsLoaded, setReportsLoaded] = useState(false);

  const partnersDailyReports = useAppStore(
    (state) => state.partnersDailyReports
  );
  const partners = useAppStore((state) => state.partners);
  const setPartners = useAppStore((state) => state.setPartners);
  const setPartnersDailyReports = useAppStore(
    (state) => state.setPartnersDailyReports
  );

  const dailyreports = useAppStore((state) => state.dailyreports);
  const setDailyreports = useAppStore((state) => state.setDailyreports);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  // Получаем станции оператора
  const filteredStations =
    Array.isArray(stations) && stations.length > 0
      ? stations.filter((station) =>
          station.operators.includes(user?.id.toString())
        )
      : [];

  const [filStat] = filteredStations;

  // Фильтрация отчетов по выбранному месяцу, году и станции
  const filteredReports = reportsLoaded
    ? dailyreports?.filter((report) => {
        const reportDate = new Date(report.date);
        const matchesMonth = reportDate.getMonth() + 1 === selectedMonth;
        const matchesYear = reportDate.getFullYear() === selectedYear;
        const matchesStation =
          selectedStation === "all" ||
          report.station_id === parseInt(selectedStation);

        return matchesMonth && matchesYear && matchesStation;
      })
    : [];

  const loadData = async () => {
    setLoading(true);
    try {
      // Загрузка отчетов только при нажатии кнопки
      const reportsResponse = await getDailyReports(user?.access_token);
      setDailyreports(reportsResponse);
      setReportsLoaded(true);
    } catch (error) {
      console.error("Ошибка при загрузке отчетов:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // Загрузка станций при монтировании компонента
      const stationsResponse = await getStations(user?.access_token);
      setStations(stationsResponse.data);

      // Загрузка списка партнеров при монтировании компонента
      const partnersResponse = await getPartners(user?.access_token);
      setPartners(partnersResponse);
    } catch (error) {
      console.error("Ошибка при загрузке начальных данных:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  // Сортировка отчетов по дате
  const sortedReports = filteredReports
    ? [...filteredReports].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      })
    : null;

  // Генерация месяцев и годов для выпадающих списков
  const months = [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // Экспорт в Excel
  const exportToExcel = () => {
    if (!sortedReports || sortedReports.length === 0) return;

    const excelData = [
      [],
      [
        `${
          selectedStation === "all"
            ? "Барча"
            : getStationName(parseInt(selectedStation))
        }" заправкасини " ${selectedYear} " йил "${
          months[selectedMonth - 1].label
        }" ойи " ҳисоботи`,
      ],
      [`Ҳисобот тузилган вақт ${new Date().toLocaleString()}`],
      [],
      [
        "#",
        "Сана",
        "Сотув нархи",
        "Пилот",
        "Колонка",
        "Фарқи",
        "Йўқотиш коэф",
        "Шартнома",
        "Терминал",
        "Z-отчет",
        "Станция",
      ],
      ...sortedReports.map((report, index) => [
        index + 1,
        new Date(report.date).toLocaleDateString(),
        report.price,
        report.pilot,
        report.kolonka,
        report.difference,
        report.losscoef,
        report.transfer,
        report.terminal,
        report.zreport,
        getStationName(report.station_id),
      ]),
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    if (!worksheet["!merges"]) worksheet["!merges"] = [];
    worksheet["!merges"].push(
      { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } }
    );

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);

        if (!worksheet[cell_ref]) continue;

        worksheet[cell_ref].s = worksheet[cell_ref].s || {};
        worksheet[cell_ref].s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };

        if (R === 4) {
          worksheet[cell_ref].s.font = { bold: true };
        }
      }
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${months[selectedMonth - 1].label}_${selectedYear}`
    );

    XLSX.writeFile(
      workbook,
      `${months[selectedMonth - 1].label}_${selectedYear} кунлик ҳисоботи.xlsx`
    );
  };

  const getStationName = (id) => {
    if (!Array.isArray(stations)) return "Номаълум шахобча";
    const station = stations.find((s) => s.id === id);
    return station ? station.name : "Номаълум шахобча";
  };

  return (
    <>
      <div className="overflow-x-auto">
        {user.type === "operator" && (
          <div className="flex justify-between mx-5 mb-8">
            {loading ? (
              <PulseLoader size={10} />
            ) : (
              <h1 className="text-3xl font-bold">
                {filStat?.moljal} заправкасини кунлик ҳисоботи
              </h1>
            )}

            <div className="flex gap-2">
              <Button
                onClick={setAddItemModal}
                disabled={!filteredStations?.length || loading}
                className={
                  filteredStations?.length && !loading
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }
              >
                Кунлик ҳисоботни яратиш
              </Button>
            </div>
          </div>
        )}

        {/* Фильтры */}
        <div className="flex gap-4 mb-4 mx-5">
          <select
            className="select select-bordered"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {user?.type !== "operator" && (
            <select
              className="select select-bordered"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              <option value="all">Барча шахобчалар</option>
              {Array.isArray(stations) &&
                stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.moljal}
                  </option>
                ))}
            </select>
          )}

          <Button onClick={loadData} disabled={loading}>
            {loading ? <PulseLoader size={8} color="#fff" /> : "Юклаш"}
          </Button>

          <button
            onClick={exportToExcel}
            disabled={!sortedReports?.length}
            className="btn btn-outline"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Excel
          </button>
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
              {loading ? (
                <tr>
                  <td colSpan="11">
                    <div className="flex w-full mt-10 mb-10 justify-center items-center">
                      <PulseLoader speedMultiplier={0.5} />
                    </div>
                  </td>
                </tr>
              ) : reportsLoaded && sortedReports && sortedReports.length > 0 ? (
                sortedReports.map((report) => (
                  <DailyReportList
                    key={report.id}
                    {...report}
                    stationName={getStationName(report.station_id)}
                    partnersDailyReports={partnersDailyReports}
                    partners={partners}
                  />
                ))
              ) : reportsLoaded ? (
                <tr>
                  <td colSpan="11" className="text-center py-8">
                    {selectedStation === "all"
                      ? `Ҳисобот мавжуд эмас ${
                          months[selectedMonth - 1].label
                        } ${selectedYear} йил учун`
                      : `Ҳисобот мавжуд эмас ${
                          months[selectedMonth - 1].label
                        } ${selectedYear} йил учун "${getStationName(
                          parseInt(selectedStation)
                        )}" станцияси учун`}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-8">
                    Выберите месяц, год и станцию, затем нажмите "Загрузить"
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
      <div className="flex w-full h-screen justify-center">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default DailyReports;
