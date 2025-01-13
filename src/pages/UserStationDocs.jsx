import { useAppStore } from "../lib/zustand";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

export default function UserStationDocs() {
  const { stationId } = useParams();
  const stations = useAppStore((state) => state.stations);
  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ik = useAppStore((state) => state.ik);

  const allDocuments = [
    ...licenses.map((doc) => ({ ...doc, document_type: "licenses" })),
    ...ngsertificates.map((doc) => ({
      ...doc,
      document_type: "ngsertificates",
    })),
    ...humidity.map((doc) => ({ ...doc, document_type: "humidity" })),
    ...gasanalyzers.map((doc) => ({ ...doc, document_type: "gasanalyzers" })),
    ...prodinsurance.map((doc) => ({ ...doc, document_type: "prodinsurance" })),
    ...lifeinsurance.map((doc) => ({ ...doc, document_type: "lifeinsurance" })),
    ...ecology.map((doc) => ({ ...doc, document_type: "ecology" })),
    ...ik.map((doc) => ({ ...doc, document_type: "ik" })),
  ];

  const documents = allDocuments.filter(
    (doc) => String(doc.station_id) === String(stationId)
  );

  const getRowClass = (daysRemaining) => {
    if (daysRemaining > 30) return "";
    if (daysRemaining > 15) return "bg-green-500";
    if (daysRemaining > 5) return "bg-yellow-500";
    if (daysRemaining > 0) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="overflow-x-auto">
      <h1>Документы станции</h1>
      <table className="table table-xs">
        <thead>
          <tr>
            <th>#</th>
            <th>Тип документа</th>
            <th>Номер документа</th>
            <th>Дата выдачи документа</th>
            <th>Дата окончания документа</th>
            <th>Документ загрузка</th>
            <th>Срок</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => {
            // Проверка на валидность даты
            const expirationDate = dayjs(doc.expiration);
            const isValidDate = expirationDate.isValid();

            const daysRemaining = isValidDate
              ? expirationDate.diff(dayjs(), "day")
              : null;

            return (
              <tr
                key={index}
                className={isValidDate ? getRowClass(daysRemaining) : ""}
              >
                <td>{index + 1}</td>
                <td>{doc.document_type}</td>
                <td>{doc.number || "Без названия"}</td>
                <td>{doc.issue || "Нет данных"}</td>
                <td>{doc.expiration || "Нет данных"}</td>
                <td>
                  {doc.value ? (
                    <a
                      href={doc.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-file-download"></i>
                    </a>
                  ) : (
                    "Нет данных"
                  )}
                </td>
                <td>
                  {isValidDate
                    ? daysRemaining > 0
                      ? `Осталось ${daysRemaining} дней`
                      : `Просрочено ${Math.abs(daysRemaining)} дней`
                    : "Некорректная дата"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center items-center py-5">
        <button className="btn btn-outline">
          <Link to="/userstations">Орқага</Link>
        </button>
      </div>
    </div>
  );
}
