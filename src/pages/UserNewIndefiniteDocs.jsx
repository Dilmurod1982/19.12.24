import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddNewDocs from "../components/adduserdocs/AddNewDocs";
import { useAppStore } from "../lib/zustand";
import AddNewIndefiniteDocs from "../components/adduserdocs/AddNewIndefiniteDocs";

export default function UserNewIndefiniteDocs() {
  const { stationId } = useParams();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const [sendingData, setSendingData] = useState(null);

  const handleCloseModal = () => {
    setSelectedDoc(null); // Очищаем selectedDoc
    setAddItemModal(false); // Закрываем модальное окно
  };

  return (
    <div>
      <h1 className="font-bold text-2xl text-center mb-5">
        Янги муддатсиз хужжатлар рўйхати
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-3">
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "hokim",
              setBaseName: "setHokim",
              docName: "хоким қарори",
            });
            setAddItemModal(true);
          }}
        >
          1. Хоким қарорини қўшиш
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "contract",
              setBaseName: "setContract",
              docName: "олди-сотди шартномаси",
            });
            setAddItemModal(true);
          }}
        >
          2. Олди-сотди шартномаси
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "apz",
              setBaseName: "setApz",
              docName: "АПЗ",
            });
            setAddItemModal(true);
          }}
        >
          3. Архитектура режалаштириш топшириғи (АПЗ)
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "gastx",
              setBaseName: "setGastx",
              docName: "Газ техник шарти",
            });
            setAddItemModal(true);
          }}
        >
          4. Газ идорасининг техник шарти
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "elektrtx",
              setBaseName: "setElektrtx",
              docName: "Электр техник шарти",
            });
            setAddItemModal(true);
          }}
        >
          5. Электр идорасининг техник шарти
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "suvtx",
              setBaseName: "setSuvtx",
              docName: "Сув техник шарти",
            });
            setAddItemModal(true);
          }}
        >
          6. Сув идорасининг техник шарти
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "gasloyiha",
              setBaseName: "setGasloyiha",
              docName: "газ тармоғини лойиҳаси",
            });
            setAddItemModal(true);
          }}
        >
          7. Келтирувчи газ тармоғини лойиҳаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "elektrloyiha",
              setBaseName: "setElektrloyiha",
              docName: "электр тармоғини лоийҳаси",
            });
            setAddItemModal(true);
          }}
        >
          8. Электр тармоғини лойихаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "suvloyiha",
              setBaseName: "setSuvloyiha",
              docName: "Сув тармоғини лойиҳаси",
            });
            setAddItemModal(true);
          }}
        >
          9. Сув тармоғини лоийҳаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "inshloyiha",
              setBaseName: "setInshloyiha",
              docName: "Заправка лойихаси",
            });
            setAddItemModal(true);
          }}
        >
          10. Заправканинг лоийҳаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "inshexpertiza",
              setBaseName: "setInshexpertiza",
              docName: "заправка лойихаси экспертизаси",
            });
            setAddItemModal(true);
          }}
        >
          11. Заправка лойиҳасининг экспертизаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "prodexpertiza",
              setBaseName: "setProdexpertiza",
              docName: "саноат экспертизаси",
            });
            setAddItemModal(true);
          }}
        >
          12. Заправкани саноат экспертизаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "iden",
              setBaseName: "setIden",
              docName: "Идентификация",
            });
            setAddItemModal(true);
          }}
        >
          13. Идентификация
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "foyda",
              setBaseName: "setFoyda",
              docName: "Фойдаланишга қабул қилиш далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          14. Фойдаланишга қабул қилиш далолатномаси
        </button>
      </div>
      <div className="flex justify-around items-center">
        <div className=" flex justify-center items-center mt-5">
          <Link to="/userindefinite" className="btn btn-outline">
            Шахобчалар рўйхатига ўтиш
          </Link>
        </div>
        <div className=" flex justify-center items-center mt-5">
          <Link to={`/userindefinitedocs/${stationId}`}>
            <button className="btn btn-outline">Орқага</button>
          </Link>
        </div>
      </div>

      {selectedDoc && (
        <AddNewIndefiniteDocs
          setSendingData={setSendingData}
          sendingData={sendingData}
          stationId={stationId}
          baseName={selectedDoc.baseName}
          setBaseName={selectedDoc.setBaseName}
          docName={selectedDoc.docName}
          onClose={handleCloseModal} // Передаем обработчик закрытия
        />
      )}
    </div>
  );
}
