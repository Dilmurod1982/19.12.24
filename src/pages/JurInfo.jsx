import React, { useState, useEffect } from "react";
import { useAppStore } from "../lib/zustand";
import {
  getDocs,
  getPartnerDailyReports,
  getPartners,
  getStations,
} from "../request";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { Link } from "react-router-dom";
import PartnerReportDetail from "../components/PartnerReportDetail";
import * as XLSX from "xlsx";

export default function JurInfo() {
  const user = useAppStore((state) => state.user);
  const partners = useAppStore((state) => state.partners);
  const setPartners = useAppStore((state) => state.setPartners);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const partnersDailyReports = useAppStore(
    (state) => state.partnersDailyReports
  );
  const setPartnersDailyReports = useAppStore(
    (state) => state.setPartnersDailyReports
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedStation, setSelectedStation] = useState("all");

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  const openPartnerDetails = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const stationsResponse = await getStations(user?.access_token);
      setStations(stationsResponse.data);

      const partnersReportsResponse = await getPartnerDailyReports(
        user?.access_token
      );
      setPartnersDailyReports(partnersReportsResponse);

      const partnersResponse = await getPartners(user?.access_token);
      setPartners(partnersResponse);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  // Годы для выпадающего списка
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  // Месяцы для выпадающего списка
  const months = [
    { value: 1, name: "Январь" },
    { value: 2, name: "Февраль" },
    { value: 3, name: "Март" },
    { value: 4, name: "Апрель" },
    { value: 5, name: "Май" },
    { value: 6, name: "Июнь" },
    { value: 7, name: "Июль" },
    { value: 8, name: "Август" },
    { value: 9, name: "Сентябрь" },
    { value: 10, name: "Октябрь" },
    { value: 11, name: "Ноябрь" },
    { value: 12, name: "Декабрь" },
  ];

  // Фильтруем станции, доступные текущему пользователю
  const getUserStations = () => {
    if (!stations || !user) return [];
    return stations.filter((station) =>
      station.operators?.includes(user.id.toString())
    );
  };

  const userStations = getUserStations();

  // Форматирование числа с группировкой
  const formatNumber = (num) => {
    return new Intl.NumberFormat("ru-RU").format(num);
  };

  // Экспорт в Excel
  const exportToExcel = () => {
    const dataForExport = monthlyData.map((item) => ({
      ID: item.id,
      Номи: item.name,
      "Ой бошига сальдо": item.initialBalance,
      "Тўлдирилди, м3": item.totalGas,
      Қиймати: item.totalSum,
      Тўланди: item.totalPayment,
      "Ой охирига сальдо": item.finalBalance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Юридик шахслар");

    // Генерируем название файла
    const stationName =
      selectedStation === "all"
        ? "Барча станциялар"
        : userStations.find((s) => s.id === Number(selectedStation))?.moljal ||
          "Станция";
    const fileName = `Юридик шахслар_${stationName}_${
      months[selectedMonth - 1].name
    }_${selectedYear}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Получаем данные за выбранный месяц и год с фильтрацией по станции
  const getMonthlyData = () => {
    if (!partnersDailyReports || !partners || !userStations) return [];

    // Находим выбранную станцию
    const currentStation = userStations.find((station) =>
      selectedStation !== "all" ? station.id === Number(selectedStation) : false
    );

    // Фильтруем партнеров по выбранной станции
    const filteredPartners =
      selectedStation === "all"
        ? partners
        : partners.filter((partner) =>
            currentStation?.partners?.includes(partner.id.toString())
          );

    return filteredPartners.map((partner) => {
      const partnerReports = partnersDailyReports.filter((report) => {
        const reportDate = new Date(report.date);
        return (
          report.partner_id === partner.id &&
          reportDate.getFullYear() === selectedYear &&
          reportDate.getMonth() + 1 === selectedMonth &&
          (selectedStation === "all" ||
            report.station_id === Number(selectedStation))
        );
      });

      const initialBalanceReport = partnerReports.find((report) => {
        const reportDate = new Date(report.date);
        return reportDate.getDate() === 1;
      });
      const initialBalance = initialBalanceReport?.initial_balace || 0;

      const totalGas = partnerReports.reduce(
        (sum, report) => sum + (Number(report.gas) || 0),
        0
      );
      const totalSum = partnerReports.reduce(
        (sum, report) => sum + (Number(report.total_sum) || 0),
        0
      );

      const totalPayment = partnerReports.reduce((sum, report) => {
        if (!report.payment) return sum;

        if (Array.isArray(report.payment)) {
          return (
            sum +
            report.payment.reduce((paymentSum, payment) => {
              return paymentSum + (Number(payment.paymentSum) || 0);
            }, 0)
          );
        } else if (typeof report.payment === "string") {
          try {
            const parsedPayment = JSON.parse(report.payment);
            if (Array.isArray(parsedPayment)) {
              return (
                sum +
                parsedPayment.reduce((paymentSum, payment) => {
                  return paymentSum + (Number(payment.paymentSum) || 0);
                }, 0)
              );
            }
          } catch (e) {
            console.error("Error parsing payment:", e);
          }
        } else if (typeof report.payment === "number") {
          return sum + report.payment;
        }

        return sum;
      }, 0);

      const lastReport = partnerReports[partnerReports.length - 1];
      const finalBalance = lastReport?.final_balance || initialBalance;

      return {
        id: partner.id,
        name: partner.partner_name,
        initialBalance,
        totalGas,
        totalSum,
        totalPayment,
        finalBalance,
        hasPositiveBalance: finalBalance > 0,
      };
    });
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Отчет по юридическим лицам</h1>

      {/* Фильтры по году, месяцу и станции */}
      <div className="flex gap-4 mb-6 flex-wrap items-end">
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Год
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Месяц
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="station"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Станция
          </label>
          <select
            id="station"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все станции</option>
            {userStations?.map((station) => (
              <option key={station.id} value={station.id}>
                {station.moljal} (№{station.station_number})
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка экспорта в Excel */}
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Excelга юклаб олиш
        </button>
      </div>

      {/* Таблица с данными */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Заголовки таблицы */}
            <div className="grid grid-cols-8 bg-gray-50 py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">ID</div>
              <div className="col-span-1 text-center">Номи</div>
              <div className="col-span-1 text-center">Ой бошига сальдо</div>
              <div className="col-span-1 text-center">Тўлдирилди, м3</div>
              <div className="col-span-1 text-center">Қиймати</div>
              <div className="col-span-1 text-center">Тўланди</div>
              <div className="col-span-1 text-center">Ой охирига сальдо</div>
              <div className="col-span-1 text-center"></div>
            </div>

            {/* Тело таблицы */}
            <div className="divide-y divide-gray-200">
              {monthlyData.length > 0 ? (
                monthlyData.map((item) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-8 py-3 px-4 ${
                      item.hasPositiveBalance
                        ? "bg-red-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="col-span-1 text-center">{item.id}</div>
                    <div className="col-span-1">{item.name}</div>
                    <div className="col-span-1 text-center">
                      {formatNumber(item.initialBalance)}
                    </div>
                    <div className="col-span-1 text-center">
                      {formatNumber(item.totalGas)}
                    </div>
                    <div className="col-span-1 text-center">
                      {formatNumber(item.totalSum)}
                    </div>
                    <div className="col-span-1 text-center">
                      {formatNumber(item.totalPayment)}
                    </div>
                    <div className="col-span-1 text-center">
                      {formatNumber(item.finalBalance)}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        className="btn btn-outline"
                        onClick={() => openPartnerDetails(item)}
                      >
                        Подробно
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500 col-span-8">
                  Нет данных для отображения
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedPartner && (
        <PartnerReportDetail
          partners={partners}
          partner={selectedPartner}
          onClose={() => setIsModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
