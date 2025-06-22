import React from "react";

export default function PaymentReportList({ UserPayments, partners }) {
  // Функция для получения имени партнера по ID
  const getPartnerName = (partnerId) => {
    if (!partnerId) return "Неизвестный партнер";
    const partner = partners.find((p) => Number(p.id) === Number(partnerId));
    return partner ? partner.partner_name : "Неизвестный партнер";
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return "Дата не указана";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      {UserPayments.map(
        (report, reportIndex) =>
          report.payment &&
          Array.isArray(report.payment) &&
          report.payment.map(
            (payment, paymentIndex) =>
              Number(payment.paymentSum) > 0 &&
              Number(payment.approval) === 1 && (
                <tr key={`${reportIndex}-${paymentIndex}`}>
                  <td className="text-center">{reportIndex + 1}</td>
                  <td className="text-center">{formatDate(report.date)}</td>
                  <td className="text-center">
                    {getPartnerName(report.partner_id)}
                  </td>
                  <td className="text-center">
                    {payment.paymentNumber || "Не указан"}
                  </td>
                  <td className="text-center">{payment.paymentSum} сўм</td>
                </tr>
              )
          )
      )}
    </>
  );
}
