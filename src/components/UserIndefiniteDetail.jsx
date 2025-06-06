import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../my-utils/index";
import { useAppStore } from "../lib/zustand";

export default function UserIndefiniteDetail() {
  const user = useAppStore((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };

  const {
    id,
    moljal,
    ltd_name,
    station_number,
    docNumber,
    issue,
    value,
    text,
    docType,
    stationId,
  } = location.state;

  console.log(ltd_name);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDocNumber, setEditedDocNumber] = useState(docNumber); //zamena
  const [editedIssueDate, setEditedIssueDate] = useState(issue);

  const handleSave = async () => {
    try {
      const token = user.access_token;
      const data = {
        docNumber: editedDocNumber, //zamena
        issue: formatDate(editedIssueDate),
      };

      const res = await fetch(`${BASE_URL}/mol/${id}`, {
        //zamena
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
        navigate("/mol"); //zamena
      } else {
        throw new Error("Маълумотларни сақлашда хатолик юз берди!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`flex flex-col pt-5 items-center gap-3 h-screen `}>
      <div className="flex justify-center">
        <h1 className="font-bold text-3xl">{docType}</h1>
      </div>
      <div className="pl-10 flex flex-col gap-4">
        <h1>
          <span className="font-bold">{docType} эгаси:</span> {ltd_name} АГТКШ №{" "}
          {station_number}
        </h1>
        <h1>
          <span className="font-bold">Шахобча номи:</span> {moljal}
        </h1>
        <h1>
          <span className="font-bold">{docType} рақами:</span>{" "}
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
          <span className="font-bold">Хужжат санаси:</span>{" "}
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
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 100 100"
              >
                <path
                  fill="#fefdef"
                  d="M29.614,12.307h-1.268c-4.803,0-8.732,3.93-8.732,8.732v61.535c0,4.803,3.93,8.732,8.732,8.732h43.535c4.803,0,8.732-3.93,8.732-8.732v-50.02C72.74,24.68,68.241,20.182,60.367,12.307H41.614"
                ></path>
                <path
                  fill="#1f212b"
                  d="M71.882,92.307H28.347c-5.367,0-9.732-4.366-9.732-9.732V21.04c0-5.367,4.366-9.732,9.732-9.732h1.268c0.552,0,1,0.448,1,1s-0.448,1-1,1h-1.268c-4.264,0-7.732,3.469-7.732,7.732v61.535c0,4.264,3.469,7.732,7.732,7.732h43.535c4.264,0,7.732-3.469,7.732-7.732V32.969L59.953,13.307H41.614c-0.552,0-1-0.448-1-1s0.448-1,1-1h18.752c0.265,0,0.52,0.105,0.707,0.293l20.248,20.248c0.188,0.188,0.293,0.442,0.293,0.707v50.02C81.614,87.941,77.248,92.307,71.882,92.307z"
                ></path>
                <path
                  fill="#fef6aa"
                  d="M60.114,12.807v10.986c0,4.958,4.057,9.014,9.014,9.014h11.986"
                ></path>
                <path
                  fill="#1f212b"
                  d="M81.114 33.307H69.129c-5.247 0-9.515-4.268-9.515-9.515V12.807c0-.276.224-.5.5-.5s.5.224.5.5v10.985c0 4.695 3.82 8.515 8.515 8.515h11.985c.276 0 .5.224.5.5S81.391 33.307 81.114 33.307zM75.114 51.307c-.276 0-.5-.224-.5-.5v-3c0-.276.224-.5.5-.5s.5.224.5.5v3C75.614 51.083 75.391 51.307 75.114 51.307zM75.114 59.307c-.276 0-.5-.224-.5-.5v-6c0-.276.224-.5.5-.5s.5.224.5.5v6C75.614 59.083 75.391 59.307 75.114 59.307zM67.956 86.307H32.272c-4.223 0-7.658-3.45-7.658-7.689V25.955c0-2.549 1.264-4.931 3.382-6.371.228-.156.54-.095.695.132.155.229.096.54-.132.695-1.844 1.254-2.944 3.326-2.944 5.544v52.663c0 3.688 2.987 6.689 6.658 6.689h35.685c3.671 0 6.658-3.001 6.658-6.689V60.807c0-.276.224-.5.5-.5s.5.224.5.5v17.811C75.614,82.857,72.179,86.307,67.956,86.307z"
                ></path>
                <path
                  fill="#1f212b"
                  d="M39.802 14.307l-.117 11.834c0 2.21-2.085 3.666-4.036 3.666-1.951 0-4.217-1.439-4.217-3.649l.037-12.58c0-1.307 1.607-2.451 2.801-2.451 1.194 0 2.345 1.149 2.345 2.456l.021 10.829c0 0-.083.667-1.005.645-.507-.012-1.145-.356-1.016-.906v-9.843h-.813l-.021 9.708c0 1.38.54 1.948 1.875 1.948s1.959-.714 1.959-2.094V13.665c0-2.271-1.36-3.5-3.436-3.5s-3.564 1.261-3.564 3.532l.032 12.11c0 3.04 2.123 4.906 4.968 4.906 2.845 0 5-1.71 5-4.75V14.307H39.802zM53.114 52.307h-23c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h23c.276 0 .5.224.5.5S53.391 52.307 53.114 52.307zM44.114 59.307h-14c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h14c.276 0 .5.224.5.5S44.391 59.307 44.114 59.307zM70.114 59.307h-24c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h24c.276 0 .5.224.5.5S70.391 59.307 70.114 59.307zM61.114 66.307h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11c.276 0 .5.224.5.5S61.391 66.307 61.114 66.307zM71.114 66.307h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5S71.391 66.307 71.114 66.307zM48.114 66.307h-18c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h18c.276 0 .5.224.5.5S48.391 66.307 48.114 66.307zM70.114 73.307h-13c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h13c.276 0 .5.224.5.5S70.391 73.307 70.114 73.307zM54.114 73.307h-24c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h24c.276 0 .5.224.5.5S54.391 73.307 54.114 73.307z"
                ></path>
              </svg>
            </Link>
          ) : (
            <span>Бириктирилган файл мавжуд эмас</span>
          )}
        </h1>
      </div>

      <div className="flex justify-center mt-5 w-full">
        <Link to={`/userindefinitedocs/${stationId}`}>
          <button className="btn btn-outline">Орқага</button>
        </Link>
      </div>
    </div>
  );
}
