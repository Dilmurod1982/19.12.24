// PartnerReportDetail.js
import React, { useState, useEffect } from "react";
import { getPartnerDailyReports } from "../request";

export default function PartnerReportDetail({
  partners,
  partner,
  onClose,
  user,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dailyReports, setDailyReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredPartners =
    partners && Array.isArray(partners)
      ? partners.filter((partnerss) => partnerss.id === partner.id)
      : [];

  // Годы и месяцы для выпадающих списков
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

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

  useEffect(() => {
    fetchDailyReports();
  }, [selectedYear, selectedMonth]);

  const fetchDailyReports = async () => {
    setLoading(true);
    try {
      const response = await getPartnerDailyReports(user?.access_token);
      const filteredReports = response.filter((report) => {
        const reportDate = new Date(report.date);
        return (
          report.partner_id === partner.id &&
          reportDate.getFullYear() === selectedYear &&
          reportDate.getMonth() + 1 === selectedMonth
        );
      });
      setDailyReports(filteredReports);
    } catch (error) {
      console.error("Ошибка при загрузке ежедневных отчетов:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPayment = (payment) => {
    if (!payment) return 0;

    if (Array.isArray(payment)) {
      return payment.reduce((sum, p) => sum + Number(p.paymentSum) || 0, 0);
    } else if (typeof payment === "string") {
      try {
        const parsed = JSON.parse(payment);
        if (Array.isArray(parsed)) {
          return parsed.reduce(
            (sum, p) => sum + (Number(p.paymentSum) || 0, 0)
          );
        }
      } catch (e) {
        console.error("Ошибка парсинга payment:", e);
      }
    } else if (typeof payment === "number") {
      return payment;
    }

    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:hidden">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none print:max-w-none print:rounded-none">
        <div className="p-6">
          {/* Заголовок и кнопки */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Детали отчета: {filteredPartners[0].partner_name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors print:hidden"
              >
                Печать
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl print:hidden"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Информация о партнере */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-200">
            <div>
              <p className="font-semibold">Название:</p>
              <p>{filteredPartners[0].partner_name}</p>
            </div>
            <div>
              <p className="font-semibold">Директор:</p>
              <p>{filteredPartners[0].direktor}</p>
            </div>
            <div>
              <p className="font-semibold">Банк:</p>
              <p>{filteredPartners[0].bank}</p>
            </div>
            <div>
              <p className="font-semibold">МФО:</p>
              <p>{filteredPartners[0].mfo}</p>
            </div>
            <div>
              <p className="font-semibold">СТИР:</p>
              <p>{filteredPartners[0].stir}</p>
            </div>
            <div>
              <p className="font-semibold">Телефон:</p>
              <p>{filteredPartners[0].tel}</p>
            </div>
          </div>

          {/* Фильтры периода (скрываем при печати) */}
          <div className="flex gap-4 mb-6 print:hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Год
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Месяц
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Заголовок периода для печати */}
          <div className="hidden print:block mb-4">
            <h3 className="text-lg font-semibold">
              Отчет за {months.find(m => m.value === selectedMonth)?.name} {selectedYear} года
            </h3>
          </div>

          {/* Таблица с ежедневными отчетами */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      №
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      День
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      Начальное сальдо
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      Заправленный газ, м3
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      Сумма, сум
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      Оплачено
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:border-b print:border-gray-200">
                      Конечное сальдо
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyReports.length > 0 ? (
                    dailyReports.map((report, index) => {
                      const reportDate = new Date(report.date);
                      return (
                        <tr key={report.id} className="print:border-b print:border-gray-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reportDate.getDate().toString().padStart(2, "0")}-
                            {(reportDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0")}
                            -{reportDate.getFullYear()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(report.initial_balace).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(report.gas).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(report.total_sum).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {calculateTotalPayment(
                              report.payment
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(report.final_balance).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Нет данных за выбранный период
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}