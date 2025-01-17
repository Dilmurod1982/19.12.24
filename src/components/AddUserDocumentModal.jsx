import React, { useState } from "react";
import { registerDoc } from "../request/index";

const AddUserDocumentModal = ({ token, onClose }) => {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [formData, setFormData] = useState({
    station_id: "",
    document_number: "",
    issue: "",
    expiration: "",
    value: "",
  });

  const docTypes = [
    { label: "Новая лицензия", base: "licenses" },
    { label: "Новый сертификат соответвия газа", base: "ngsertificates" },
    { label: "Новый сертификат влагомера", base: "humidity" },
    { label: "Новый сертификат газ анализатора", base: "gasanalyzers" },
    { label: "Новый полис производства", base: "prodinsurance" },
    { label: "Новый полис сотрудников", base: "lifeinsurance" },
    { label: "Новое заключение экология", base: "ecology" },
    { label: "Новый сертификат ИК", base: "ik" },
  ];

  const handleSubmit = async () => {
    try {
      await registerDoc(token, formData, selectedDocType);
      alert("Документ добавлен успешно!");
      onClose();
    } catch (error) {
      alert("Ошибка при добавлении документа: " + error.message);
    }
  };

  return (
    <div className="modal">
      <h2>Добавить новый документ</h2>
      <select
        onChange={(e) => setSelectedDocType(e.target.value)}
        value={selectedDocType}
      >
        <option value="">Выберите тип документа</option>
        {docTypes.map((doc) => (
          <option key={doc.base} value={doc.base}>
            {doc.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="ID станции"
        value={formData.station_id}
        onChange={(e) =>
          setFormData({ ...formData, station_id: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Номер документа"
        value={formData.document_number}
        onChange={(e) =>
          setFormData({ ...formData, document_number: e.target.value })
        }
      />
      <input
        type="date"
        placeholder="Дата выдачи"
        value={formData.issue}
        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
      />
      <input
        type="date"
        placeholder="Дата окончания"
        value={formData.expiration}
        onChange={(e) =>
          setFormData({ ...formData, expiration: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Ссылка на файл"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
      />

      <button onClick={handleSubmit}>Добавить</button>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default AddUserDocumentModal;
