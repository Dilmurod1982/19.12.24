import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function DailyReportDetailModal({ partner, onClose }) {
  //   console.log(partner);
  // Форматирование даты
  const formattedDate =
    partner.date && !isNaN(new Date(partner.date).getTime())
      ? format(new Date(partner.date), "dd.MM.yyyy", { locale: ru })
      : "Дата не указана";

  // Форматирование чисел
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    const number = typeof num === "string" ? parseFloat(num) : num;
    return number.toLocaleString("ru-RU", {});
  };

  // Получаем данные о шлангах
  const shlangs = [];
  for (let i = 1; i <= 10; i++) {
    const shlangKey = `shlang${i}`;
    if (partner[shlangKey] !== undefined) {
      shlangs.push({
        number: i,
        value: partner[shlangKey],
      });
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">
          {partner.date} кунги батафсил ҳисоботи
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Ҳисобот санаси:</p>
            <p>{partner.date}</p>
          </div>

          <div>
            <p className="font-semibold">Пилот кўрсаткичи:</p>
            <p>{partner.pilot} м3</p>
          </div>

          <div>
            <p className="font-semibold">Йўқотиш коэф:</p>
            <p>{partner.losscoef}%</p>
          </div>

          <div>
            <p className="font-semibold">Шартнома газ:</p>
            <p>{partner.transfer} м3</p>
          </div>

          <div>
            <p className="font-semibold">Шартнома сумма:</p>
            <p>{partner.transfersum} м3</p>
          </div>

          <div>
            <p className="font-semibold">Терминал:</p>
            <p>{partner.terminal} сўм</p>
          </div>

          <div>
            <p className="font-semibold">Сотув нархи:</p>
            <p>{partner.price} сўм</p>
          </div>

          <div>
            <p className="font-semibold">Z-отчет:</p>
            <p>{partner.zreport} сўм</p>
          </div>
        </div>

        {/* Информация о шлангах */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Шланглар кўрсаткичи:</h4>
          <div className="grid grid-cols-5 gap-2">
            {shlangs.map((shlang) => (
              <div key={shlang.number} className="border p-2 rounded">
                <p className="font-medium">Шланг-{shlang.number}</p>
                <p>{shlang.value ? shlang.value : "Кўрсаткич мавжуд эмас"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Продажи юридическим лицам */}
        {partner.partnersReports && partner.partnersReports.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">
              Шартномага сотилган газ рўйхати:
            </h4>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Номи</th>
                    <th>Сотилган газ ҳажми</th>
                    <th>Нархи (сўм)</th>
                    <th>Суммаси (сўм)</th>
                  </tr>
                </thead>
                <tbody>
                  {partner.partnersReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.partner_name}</td>
                      <td>{formatNumber(report.gas)}</td>
                      <td>{formatNumber(report.price)}</td>
                      <td>{formatNumber(report.total_sum)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button onClick={onClose} className="btn">
            Ёпиш
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyReportDetailModal;
