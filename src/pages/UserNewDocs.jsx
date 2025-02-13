import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddNewDocs from "../components/adduserdocs/AddNewDocs";
import { useAppStore } from "../lib/zustand";
import AddNewKolonkaDoc from "../components/adduserdocs/AddNewKolonkaDoc";

export default function UserNewDocs() {
  const { stationId } = useParams();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedKolonkaDoc, setSelectedKolonkaDoc] = useState(null);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const [sendingData, setSendingData] = useState(null);

  const handleCloseModal = () => {
    setSelectedDoc(null); // Очищаем selectedDoc
    setSelectedKolonkaDoc(null); // Очищаем selectedKolonkaDoc
    setAddItemModal(false); // Закрываем модальное окно
  };

  return (
    <div>
      <h1 className="font-bold text-2xl text-center mb-5">
        Янги хужжатлар рўйхати
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-3">
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
          1. Лицензия қўшиш
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
          2. Табиий газ сертификати
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
          3. Влагомер сертификати
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
          4. Газ анализатор сертификати
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
          5. Хавфли ишлаб чиқариш полиси
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
          6. Ходимлар соғлиғини сақлаш полиси
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
          7. Экология хулосаси
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
          8. Ўлчов комплекси (ИК) сертификати
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
          9. Автопилот сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "shayba",
              docName: "Шайба сертификати",
            });
            setAddItemModal(true);
          }}
        >
          10. Шайба сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "water",
              docName: "Сув ҳисоблагич сертификати",
            });
            setAddItemModal(true);
          }}
        >
          11. Сув ҳисоблагич сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "electric",
              docName: "Электр ҳисоблагич сертификати",
            });
            setAddItemModal(true);
          }}
        >
          12. Электр ҳисоблагич сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedKolonkaDoc({
              baseKolonkaName: "kolonka",
              docKolonkaName: "Колонкалар сертификати",
            });
            setAddItemModal(true);
          }}
        >
          13. Колонкалар сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "manometr",
              docName: "Манометрлар сертификати",
            });
            setAddItemModal(true);
          }}
        >
          14. Манометрлар сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "termometr",
              docName: "Термометрлар сертификати",
            });
            setAddItemModal(true);
          }}
        >
          15. Термометрлар сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "voltmetr",
              docName: "Амперметр ва вольтметр сертификати",
            });
            setAddItemModal(true);
          }}
        >
          16. Амперметр ва вольтметр сертификати
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "shlang",
              docName: "Шлангларни синов далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          17. Шлангларни синов далолатномаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "ppk",
              docName: "ППКларни синов далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          18. ППКларни синов далолатномаси
        </button>

        <button
          className="btn btn-neutral text-[20px] text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "elprotec",
              docName: "Электр ҳимоя воситалари ҳимоя далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          19. Электр ҳимоя воситалари ҳимоя далолатномаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "mol",
              docName: "Чақмоқ қайтаргич синов далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          20. Чақмоқ қайтаргич синов далолатномаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "smazka",
              docName: "Технологияларни мойлаш далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          21. Технологияларни мойлаш далолатномаси
        </button>

        <button
          className="btn btn-neutral text-[20px] text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "ger",
              docName: "Технологияларни утечкага текшириш далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          22. Технологияларни утечкага текшириш далолатномаси
        </button>

        <button
          className="btn btn-neutral text-xl text-white"
          onClick={() => {
            setSelectedDoc({
              baseName: "aptek",
              docName: "Аптечкани текшириш далолатномаси",
            });
            setAddItemModal(true);
          }}
        >
          23. Аптечкани текшириш далолатномаси
        </button>
      </div>
      <div className="flex justify-around items-center">
        <div className=" flex justify-center items-center mt-5">
          <Link to="/userstations" className="btn btn-outline">
            Шахобчалар рўйхатига ўтиш
          </Link>
        </div>
        <div className=" flex justify-center items-center mt-5">
          <Link to={`/userstationdocs/${stationId}`}>
            <button className="btn btn-outline">Орқага</button>
          </Link>
        </div>
      </div>

      {selectedDoc && (
        <AddNewDocs
          setSendingData={setSendingData}
          sendingData={sendingData}
          stationId={stationId}
          baseName={selectedDoc.baseName}
          docName={selectedDoc.docName}
          onClose={handleCloseModal} // Передаем обработчик закрытия
        />
      )}
      {selectedKolonkaDoc && (
        <AddNewKolonkaDoc
          setSendingData={setSendingData}
          sendingData={sendingData}
          stationId={stationId}
          baseKolonkaName={selectedKolonkaDoc.baseKolonkaName}
          docKolonkaName={selectedKolonkaDoc.docKolonkaName}
          onClose={handleCloseModal} // Передаем обработчик закрытия
        />
      )}
    </div>
  );
}
