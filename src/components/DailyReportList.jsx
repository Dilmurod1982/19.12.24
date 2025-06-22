import { useEffect, useState } from "react";
import DailyReportDetailModal from "./DailyReportDetailModal";
import { useAppStore } from "../lib/zustand";
import { getStations, refreshToken } from "../request";

function DailyReportList({
  id,
  date,
  price,
  pilot,
  kolonka,
  difference,
  losscoef,
  transfer,
  transfersum,
  terminal,
  zreport,
  stationName,
  shlang1,
  shlang2,
  shlang3,
  shlang4,
  shlang5,
  shlang6,
  shlang7,
  shlang8,
  shlang9,
  shlang10,
  partnersDailyReports, // Добавьте этот пропс
  partners, // Добавьте этот пропс
}) {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
              console.log("Stations after refresh:", data);
              setStations(data);
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });
  }, [user, setStations, setUser]);

  const filteredStations = Array.isArray(stations) 
  ? stations.filter((station) => station.operators.includes(user?.id.toString()))
  : [];

  const station_id = filteredStations[0];

  // Функция для форматирования даты в ДД.ММ.ГГГГ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("ru-RU");
  };

  // Функция для форматирования чисел с разделителями групп
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "";
    const number = typeof num === "string" ? parseFloat(num) : num;
    return number.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Получаем отчеты по партнерам для этого daily report
  const partnersReports = partnersDailyReports
    ?.filter((report) => {
      const reportDate = new Date(report.date).toISOString().split("T")[0];
      const currentDate = new Date(date).toISOString().split("T")[0];
      return reportDate === currentDate && report.station_id === station_id.id;
    })
    .map((report) => ({
      ...report,
      partner_name:
        partners.find((p) => p.id === Number(report.partner_id))
          ?.partner_name || "Неизвестный партнер",
    }));

  const report = {
    id,
    date: formatDate(date),
    price: formatNumber(price),
    pilot: formatNumber(pilot),
    kolonka: formatNumber(kolonka),
    difference: formatNumber(difference),
    losscoef,
    transfer: formatNumber(transfer),
    transfersum: formatNumber(transfersum),
    terminal: formatNumber(terminal),
    zreport: formatNumber(zreport),
    stationName,
    // Добавляем данные о шлангах
    shlang1: formatNumber(shlang1),
    shlang2: formatNumber(shlang2),
    shlang3: formatNumber(shlang3),
    shlang4: formatNumber(shlang4),
    shlang5: formatNumber(shlang5),
    shlang6: formatNumber(shlang6),
    shlang7: formatNumber(shlang7),
    shlang8: formatNumber(shlang8),
    shlang9: formatNumber(shlang9),
    shlang10: formatNumber(shlang10),
    // Добавляем отчеты по партнерам
    partnersReports,
  };

  return (
    <>
      <tr>
        <th>{id}</th>
        <th>{report.date}</th>
        <td>{report.price}</td>
        <td>{report.pilot}</td>
        <td>{report.kolonka}</td>
        <td>{report.difference}</td>
        <td>{report.losscoef}</td>
        <td>{report.transfer}</td>
        <td>{report.terminal}</td>
        <td>{report.zreport}</td>
        <td>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline"
          >
            Батафсил
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <DailyReportDetailModal
          partner={report}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default DailyReportList;
