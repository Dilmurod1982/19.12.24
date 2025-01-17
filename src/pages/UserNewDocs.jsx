import React from "react";
import { useParams } from "react-router-dom";
import { AddLicense, AddNGSertificate } from "../components/adduserdocs";
import AddNewDocs from "../components/adduserdocs/AddNewDocs";

export default function UserNewDocs() {
  const { stationId } = useParams();

  const onClickLicense = () => {
    <AddNewDocs  />;
  };
  const onClickNGSertificate = () => {
    <AddNGSertificate />;
  };
  return (
    <div>
      <h1>Список для добавление новых документов по типам</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <button className="btn btn-primary" onClick={() => onClickLicense()}>
          добавить новую лицензию
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onClickNGSertificate()}
        >
          добавить новый сертификат газа
        </button>
      </div>
    </div>
  );
}
