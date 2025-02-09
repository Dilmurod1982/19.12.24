import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddNewDocs from "../components/adduserdocs/AddNewDocs";
import { useAppStore } from "../lib/zustand";

export default function UserNewDocs() {
  const { stationId } = useParams();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const [sendingData, setSendingData] = useState(null);

  return (
    <div>
      <h1 className="font-bold text-2xl text-center mb-5">
        Янги хужжатлар рўйхати
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-3">
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "licenses",
              docName: "лицензия",
            });
            setAddItemModal(true);
          }}
        >
          Лицензия қўшиш
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "ngsertificates",
              docName: "сертификат",
            });
            setAddItemModal(true);
          }}
        >
          Табиий газ сертификати
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "humidityes",
              docName: "Влагомер сертификати",
            });
            setAddItemModal(true);
          }}
        >
          Влагомер сертификати
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "gasanalyzers",
              docName: "Газ анализатор сертификати",
            });
            setAddItemModal(true);
          }}
        >
          Газ анализатор сертификати
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "prodinsurances",
              docName: "Хавфли ишлаб чиқариш полиси",
            });
            setAddItemModal(true);
          }}
        >
          Хавфли ишлаб чиқариш полиси
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "lifeinsurances",
              docName: "Ходимлар соғлиғини сақлаш полиси",
            });
            setAddItemModal(true);
          }}
        >
          Ходимлар соғлиғини сақлаш полиси
        </button>
        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "ecology",
              docName: "Экология хулосаси",
            });
            setAddItemModal(true);
          }}
        >
          Экология хулосаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "ik",
              docName: "Ўлчов комплекси (ИК) сертификати",
            });
            setAddItemModal(true);
          }}
        >
          Ўлчов комплекси (ИК) сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "pilot",
              docName: "Автопилот сертификати",
            });
            setAddItemModal(true);
          }}
        >
          Автопилот сертификати
        </button>
      </div>
      <div className=" flex justify-center items-center mt-5">
        <Link to="/userstations" className="btn btn-outline">
          Шахобчалар рўйхатига ўтиш
        </Link>
      </div>

      {selectedDoc && (
        <>
          {/* {console.log("Рендеринг AddNewDocs:", selectedDoc)} */}
          <AddNewDocs
            setSendingData={setSendingData}
            sendingData={sendingData}
            stationId={stationId}
            baseName={selectedDoc.baseName}
            docName={selectedDoc.docName}
          />
        </>
      )}
    </div>
  );
}
