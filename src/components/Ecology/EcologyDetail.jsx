import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../my-utils";
import { useAppStore } from "../../lib/zustand";

export default function EcologyDetail() {
  const user = useAppStore((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };
  // Получаем данные лицензии из state
  const {
    id,
    moljal,
    ltd_name,
    station_number,
    docNumber,
    issue,
    expiration,
    text,
    value,
    bgColorClass,
  } = location.state;

  // Состояние для редактируемых полей
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocNumber, setEditedDocNumber] = useState(docNumber);
  const [editedIssueDate, setEditedIssueDate] = useState(issue);
  const [editedExpirationDate, setEditedExpirationDate] = useState(expiration);

  // Обработчик сохранения изменений
  const handleSave = async () => {
    try {
      const token = user.access_token;
      const data = {
        docNumber: editedDocNumber,
        issue: formatDate(editedIssueDate),
        expiration: formatDate(editedExpirationDate),
      };

      const res = await fetch(`${BASE_URL}/ecology/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Маълумотлар сақланди!");
        setIsEditing(false);
        navigate("/ecology");
      } else {
        throw new Error("Маълумотларни сақлашда хатолик юз берди!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col pt-5 items-center gap-3 h-screen ${bgColorClass}`}
    >
      <div className="flex justify-center">
        <h1 className="font-bold text-3xl">Экология хулосаси</h1>
      </div>
      <div className="pl-10 flex flex-col gap-4">
        <h1>
          <span className="font-bold">Полис эгаси:</span> {ltd_name} АГТКШ №{" "}
          {station_number}
        </h1>
        <h1>
          <span className="font-bold">Шахобча номи:</span> {moljal}
        </h1>
        <h1>
          <span className="font-bold">Экология хулосаси рақами:</span>{" "}
          {isEditing ? (
            <input
              type="text"
              value={editedDocNumber}
              onChange={(e) => setEditedDocNumber(e.target.value)}
              className="input input-bordered"
            />
          ) : (
            docNumber
          )}
        </h1>
        <h1>
          <span className="font-bold">Хулоса сана:</span>{" "}
          {isEditing ? (
            <input
              type="date"
              value={editedIssueDate}
              onChange={(e) => setEditedIssueDate(e.target.value)}
              className="input input-bordered"
            />
          ) : (
            issue
          )}
        </h1>
        <h1>
          <span className="font-bold">Хулоса санаси:</span>{" "}
          {isEditing ? (
            <input
              type="date"
              value={editedExpirationDate}
              onChange={(e) => setEditedExpirationDate(e.target.value)}
              className="input input-bordered"
            />
          ) : (
            expiration
          )}
        </h1>
        <h1>
          <span className="font-bold">Хулоса холати:</span>{" "}
          <span className="text-2xl">{text}</span>
        </h1>
        <h1 className="flex gap-4">
          <span className="font-bold">Файл:</span>{" "}
          {value ? (
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(value, "_blank", "noopener,noreferrer");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 100 100"
              ></svg>
            </Link>
          ) : (
            <span>Бириктирилган файл мавжуд эмас</span>
          )}
        </h1>
      </div>

      <div className="flex justify-between w-96 mt-10">
        {isEditing ? (
          <div className="flex justify-between w-full">
            <button onClick={handleSave} className="btn btn-success">
              Сақлаш
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-error ml-2"
            >
              Бекор қилиш
            </button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <Link to="/ecology">
              <button className="btn btn-outline">Орқага</button>
            </Link>
            <button onClick={() => setIsEditing(true)} className="btn btn-info">
              Тахрирлаш
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
