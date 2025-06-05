import React, { useState, useEffect } from "react";
import { useAppStore } from "../lib/zustand";
import { getPartnerDailyReports, getPartners, getStations } from "../request";

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

  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

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

  // Получаем данные за выбранный месяц и год
  const getMonthlyData = () => {
    if (!partnersDailyReports || !partners) return [];

    return partners.map((partner) => {
      // Фильтруем отчеты по партнеру и выбранному месяцу/году
      const partnerReports = partnersDailyReports.filter((report) => {
        const reportDate = new Date(report.date);
        return (
          report.partner_id === partner.id.toString() &&
          reportDate.getFullYear() === selectedYear &&
          reportDate.getMonth() + 1 === selectedMonth
        );
      });

      // Начальное сальдо (берем первый день месяца)
      const initialBalanceReport = partnerReports.find((report) => {
        const reportDate = new Date(report.date);
        return reportDate.getDate() === 1;
      });
      const initialBalance = initialBalanceReport?.initial_balance || 0;

      // Суммируем показатели за месяц
      const totalGas = partnerReports.reduce(
        (sum, report) => sum + (report.gas || 0),
        0
      );
      const totalSum = partnerReports.reduce(
        (sum, report) => sum + (report.total_sum || 0),
        0
      );
      const totalPayment = partnerReports.reduce(
        (sum, report) => sum + (report.payment || 0),
        0
      );

      // Конечное сальдо (берем последний отчет)
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
        hasPositiveBalance: finalBalance > 0, // Добавляем флаг для положительного сальдо
      };
    });
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Отчет по юридическим лицам</h1>

      {/* Фильтры по году и месяцу */}
      <div className="flex gap-4 mb-6">
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
            <div className="grid grid-cols-7 bg-gray-50 py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">ID</div>
              <div className="col-span-1 text-center">Номи</div>
              <div className="col-span-1 text-center">Ой бошига сальдо</div>
              <div className="col-span-1 text-center">Тўлдирилди, м3</div>
              <div className="col-span-1 text-center">Қиймати</div>
              <div className="col-span-1 text-center">Тўланди</div>
              <div className="col-span-1 text-center">Ой охирига сальдо</div>
            </div>

            {/* Тело таблицы */}
            <div className="divide-y divide-gray-200">
              {monthlyData.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-7 py-3 px-4 ${
                    item.hasPositiveBalance ? "bg-red-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="col-span-1 text-center">{item.id}</div>
                  <div className="col-span-1">{item.name}</div>
                  <div className="col-span-1 text-center">
                    {item.initialBalance.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    {item.totalGas.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    {item.totalSum.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    {item.totalPayment.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    {item.finalBalance.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
