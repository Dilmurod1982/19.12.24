import React, { useState } from "react";
import { Link } from "react-router-dom";
import PartnerDetailsModal from "./PartnerDetailsModal";

function DailyReportList({
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
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для форматирования даты в ДД.ММ.ГГГГ
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
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

  const report = {
    id,
    date: formatDate(date),
    price: formatNumber(price),
    pilot: formatNumber(pilot),
    kolonka: formatNumber(kolonka),
    difference: formatNumber(difference),
    losscoef,
    transfer: formatNumber(transfer),
    terminal: formatNumber(terminal),
    zreport: formatNumber(zreport),
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
            Подробно
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <PartnerDetailsModal
          partner={report}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default DailyReportList;
