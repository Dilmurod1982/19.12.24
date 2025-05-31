import { useAppStore } from "../lib/zustand";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // ✅ Добавьте этот импорт
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import * as XLSX from "xlsx";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { toast } from "sonner";

dayjs.extend(customParseFormat);

export default function UserStationDocs() {
  const { stationId } = useParams();
  const [sendingData, setSendingData] = useState(null);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("all");
  const setStations = useAppStore((state) => state.setStations);

  const stations = useAppStore((state) => state.stations);
  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ecologytwo = useAppStore((state) => state.ecologytwo);
  const ik = useAppStore((state) => state.ik);
  const pilot = useAppStore((state) => state.pilot);
  const shayba = useAppStore((state) => state.shayba);
  const water = useAppStore((state) => state.water);
  const electric = useAppStore((state) => state.electric);
  const kolonka = useAppStore((state) => state.kolonka);
  const manometr = useAppStore((state) => state.manometr);
  const termometr = useAppStore((state) => state.termometr);
  const voltmetr = useAppStore((state) => state.voltmetr);
  const shlang = useAppStore((state) => state.shlang);
  const educ = useAppStore((state) => state.educ);
  const ppk = useAppStore((state) => state.ppk);
  const elprotec = useAppStore((state) => state.elprotec);
  const mol = useAppStore((state) => state.mol);
  const smazka = useAppStore((state) => state.smazka);
  const ger = useAppStore((state) => state.ger);
  const aptek = useAppStore((state) => state.aptek);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  console.log(user.type);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setStations]);

  const docTypes = {
    licenses: "Лицензия",
    ngsertificates: "Табиий газ сертификати",
    humidity: "Влагомер сертификати",
    gasanalyzers: "Газ анализатор сертификати",
    prodinsurance: "Ишлаб чиқариш полиси",
    lifeinsurance: "Ходимлар полиси",
    ecology: "Экология хулосаси (Ташлама)",
    ecologytwo: "Экология хулосаси (Чиқинди)",
    ik: "Ўлчов комплекси (ИК) сертификати",
    pilot: "Автопилот сертификати",
    shayba: "Шайба сертификати",
    water: "Сув ҳисоблагич сертификати",
    electric: "Электр ҳисоблагич сертификати",
    kolonka: "Колонкалар сертификати",
    manometr: "Манометрлар сертификати",
    termometr: "Термометрлар сертификати",
    voltmetr: "Амперметр ва вольтметрлар сертификати",
    shlang: "Газ тўлдириш шланглари синов дал-си",
    educ: "Ходимларни саноат хавфсизлигига ўқитиш баённомаси",
    ppk: "Сақлагич клапанлар синов далолатномаси",
    elprotec: "Электр ҳимоя воситалари дал-си",
    mol: "Чақмоқ қайтаргич ва кабеллар синов дал-си",
    smazka: "Технологияларни мойлаш дал-си",
    ger: "Технологияларда утечка текширилганлиги д-си",
    aptek: "Аптечка текширилганлиги дал-си",
  };

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
    ...ecologytwo.map((doc) => ({ ...doc, document_type: "ecologytwo" })),
    ...ik.map((doc) => ({ ...doc, document_type: "ik" })),
    ...pilot.map((doc) => ({ ...doc, document_type: "pilot" })),
    ...shayba.map((doc) => ({ ...doc, document_type: "shayba" })),
    ...water.map((doc) => ({ ...doc, document_type: "water" })),
    ...electric.map((doc) => ({ ...doc, document_type: "electric" })),
    ...kolonka.map((doc) => ({ ...doc, document_type: "kolonka" })),
    ...manometr.map((doc) => ({ ...doc, document_type: "manometr" })),
    ...termometr.map((doc) => ({ ...doc, document_type: "termometr" })),
    ...voltmetr.map((doc) => ({ ...doc, document_type: "voltmetr" })),
    ...shlang.map((doc) => ({ ...doc, document_type: "shlang" })),
    ...educ.map((doc) => ({ ...doc, document_type: "educ" })),
    ...ppk.map((doc) => ({ ...doc, document_type: "ppk" })),
    ...elprotec.map((doc) => ({ ...doc, document_type: "elprotec" })),
    ...mol.map((doc) => ({ ...doc, document_type: "mol" })),
    ...smazka.map((doc) => ({ ...doc, document_type: "smazka" })),
    ...ger.map((doc) => ({ ...doc, document_type: "ger" })),
    ...aptek.map((doc) => ({ ...doc, document_type: "aptek" })),
  ];

  const documents = allDocuments.filter(
    (doc) => String(doc.station_id) === String(stationId)
  );

  const getLatestDocuments = (docs) => {
    const grouped = {};
    docs.forEach((doc) => {
      if (
        !grouped[doc.document_type] ||
        dayjs(doc.expiration, "DD.MM.YYYY").isAfter(
          dayjs(grouped[doc.document_type].expiration, "DD.MM.YYYY")
        )
      ) {
        grouped[doc.document_type] = doc;
      }
    });
    return Object.values(grouped);
  };

  const displayedDocuments = showAllDocuments
    ? documents
    : getLatestDocuments(documents);

  const filteredDocuments =
    selectedDocType === "all"
      ? displayedDocuments
      : displayedDocuments.filter(
          (doc) => doc.document_type === selectedDocType
        );

  const missingDocTypes = Object.keys(docTypes).filter(
    (type) => !documents.some((doc) => doc.document_type === type)
  );

  const calculateDaysRemaining = (expirationDate) => {
    if (!expirationDate) return "Маълумот йўқ";
    const daysRemaining = dayjs(expirationDate, "DD.MM.YYYY").diff(
      dayjs(),
      "day"
    );
    return daysRemaining > 0
      ? `${daysRemaining} кун қолди`
      : `${Math.abs(daysRemaining)} кун ўтиб кетди`;
  };

  // Функция для определения класса строки в зависимости от оставшихся дней
  const getRowClass = (expirationDate) => {
    if (!expirationDate) return "";
    const expiration = dayjs(expirationDate, "DD.MM.YYYY").endOf("day");
    if (!expiration.isValid()) return "";
    const daysRemaining = expiration.diff(dayjs().endOf("day"), "day");
    if (daysRemaining > 15 && daysRemaining <= 30) return "bg-green-200";
    if (daysRemaining > 5 && daysRemaining <= 15) return "bg-yellow-200";
    if (daysRemaining > 0 && daysRemaining <= 5) return "bg-orange-200";
    if (daysRemaining <= 0) return "bg-red-200";
    return "";
  };

  const getStationNameByNumber = (stationId) => {
    if (!stations || stations.length === 0) return "Номаълум";
    const stationsItem = stations.find((item) => item.id == stationId);
    return stationsItem ? stationsItem.moljal : "Номаълум";
  };

  // Экспорт в Excel с добавлением пропущенных документов
  const exportToExcel = () => {
    const stationName = getStationNameByNumber(stationId);

    // Основные документы для экспорта
    const data = displayedDocuments.map((doc, index) => ({
      "#": index + 1,
      "Хужжат тури": docTypes[doc.document_type] || "Номаълум хужжат",
      "Хужжат рақами":
        doc.ik_number ||
        doc.ecology_number ||
        doc.lifeinsurance_number ||
        doc.prodinsurance_number ||
        doc.gasanalyzer_number ||
        doc.humidity_number ||
        doc.ngsertificate_number ||
        doc.license_number ||
        "Маълумот йўқ",
      "Берилган сана": doc.issue || "Маълумот йўқ",
      "Тугаш санаси": doc.expiration || "Маълумот йўқ",
      Холати: calculateDaysRemaining(doc.expiration),
    }));

    // Создаем рабочий лист
    const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" });

    // Добавляем заголовок
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`${stationName} заправкаси хужжатлари`]],
      { origin: "A1" }
    );

    // Добавляем пропущенные документы
    const missingDocuments = missingDocTypes.map((type, index) => ({
      "#": index + 1,
      "Хужжат тури": docTypes[type],
    }));

    if (missingDocuments.length > 0) {
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[`${stationName} заправкаси базага киритилмаган хужжатлар`]],
        { origin: `A${data.length + 5}` }
      );
      XLSX.utils.sheet_add_json(worksheet, missingDocuments, {
        origin: `A${data.length + 7}`,
      });
    }

    // Настройка границ и ширины столбцов
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    worksheet["!cols"] = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => (row[key] ? row[key].toString().length : 0))
      ),
    }));

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          cell.s = {
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }
    }

    // Создаем книгу и сохраняем файл
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");
    XLSX.writeFile(workbook, `${stationName}_hujjatlar_royhati.xlsx`);
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-5">
        {getStationNameByNumber(stationId)} заправкаси хужжатлари
      </h1>
      <div className="flex justify-between px-5">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="flex flex-row justify-around gap-20 items-end ">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showAllDocuments}
                onChange={() => setShowAllDocuments(!showAllDocuments)}
              />
              <span className="lg:text-xl text-[10px]">
                Барча хужжатларни кўрсатиш
              </span>
            </label>
          </div>
          <div>
            <select
              className="lg:w-[300px] w-[150px] h-[25px] lg:text-[15px] text-[10px] border rounded"
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
            >
              <option className="lg:text-[15px] text-[10px]" value="all">
                Барча хужжатлар
              </option>
              {Object.keys(docTypes).map((type) => (
                <option
                  className="lg:text-[15px] text-[10px]"
                  key={type}
                  value={type}
                >
                  {docTypes[type]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden lg:flex justify-between px-4">
          <Button onClick={exportToExcel} className="ml-2" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 50 50"
            >
              <path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.53125 C 27.867188 6.808594 27.867188 7.128906 28 7.40625 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 34 37 L 34 35 L 30 35 L 30 29 L 34 29 L 34 27 L 30 27 L 30 22 L 34 22 L 34 20 L 30 20 L 30 15 L 34 15 L 34 13 L 30 13 Z M 36 13 L 36 15 L 44 15 L 44 13 Z M 6.6875 15.6875 L 12.15625 25.03125 L 6.1875 34.375 L 11.1875 34.375 L 14.4375 28.34375 C 14.664063 27.761719 14.8125 27.316406 14.875 27.03125 L 14.90625 27.03125 C 15.035156 27.640625 15.160156 28.054688 15.28125 28.28125 L 18.53125 34.375 L 23.5 34.375 L 17.75 24.9375 L 23.34375 15.6875 L 18.65625 15.6875 L 15.6875 21.21875 C 15.402344 21.941406 15.199219 22.511719 15.09375 22.875 L 15.0625 22.875 C 14.898438 22.265625 14.710938 21.722656 14.5 21.28125 L 11.8125 15.6875 Z M 36 20 L 36 22 L 44 22 L 44 20 Z M 36 27 L 36 29 L 44 29 L 44 27 Z M 36 35 L 36 37 L 44 37 L 44 35 Z"></path>
            </svg>
            Excel
          </Button>
        </div>
        {user.type === "user" && (
          <div className="hidden lg:flex ">
            <Link
              to={`/usernewdocs/${stationId}`}
              class="h-8 inline-block rounded-lg bg-success px-6 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-white shadow-success-3 transition duration-150 ease-in-out hover:bg-success-accent-300 hover:shadow-success-2 focus:bg-success-accent-300 focus:shadow-success-2 focus:outline-none focus:ring-0 active:bg-success-600 active:shadow-success-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            >
              Янги хужжат қўшиш
            </Link>
          </div>
        )}
      </div>

      <table className="table table-xs">
        <thead>
          <tr>
            <th>#</th>
            <th>Хужжат тури</th>
            <th className="text-center hidden lg:table-cell ">Хужжат рақами</th>
            <th className="text-center hidden lg:table-cell">Берилган сана</th>
            <th className="text-center hidden lg:table-cell">Тугаш санаси</th>
            <th className="text-center hidden lg:table-cell">Хужжат</th>
            <th className="text-center">Холати</th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc, index) => (
            <tr
              key={`doc-${doc.id || doc.document_type}-${index}`}
              className={getRowClass(doc.expiration)}
            >
              <td>{index + 1}</td>
              <td>{docTypes[doc.document_type] || "Номаълум хужжат"}</td>
              <td className="text-center hidden lg:table-cell">
                {doc.docNumber || "Номсиз"}
              </td>
              <td className="text-center hidden lg:table-cell">
                {doc.issue || "Маълумот йўқ"}
              </td>
              <td className="text-center hidden lg:table-cell">
                {doc.expiration || "Маълумот йўқ"}
              </td>
              <td className="text-center hidden lg:table-cell">
                <Link
                  className="flex justify-center items-center"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (doc.value) {
                      window.open(doc.value, "_blank", "noopener,noreferrer");
                    } else {
                      alert("Хужжат бириктирилмаган");
                    }
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
              </td>
              <td className="text-center">
                {calculateDaysRemaining(doc.expiration)}
              </td>
              <td>
                <Link
                  class="inline-block rounded border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:border-blue-600 hover:text-blue-600 focus:border-neutral-300 focus:text-neutral-200 focus:outline-none focus:ring-0 active:border-neutral-300 active:text-neutral-200 motion-reduce:transition-none dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  data-twe-ripple-init
                  to="/userdocdetail"
                  state={{
                    id: doc.id,
                    moljal: doc.moljal,
                    ltd_name: doc.ltd_name,
                    station_number: doc.station_number,
                    docNumber: doc.docNumber,
                    issue: doc.issue,
                    expiration: doc.expiration,
                    value: doc.value,
                    text: doc.text,
                    bgColorClass: doc.bgColorClass,
                    docType: docTypes[doc.document_type],
                    daysRemaining: calculateDaysRemaining(doc.expiration),
                    stationId: stationId,
                  }}
                >
                  {" "}
                  Батафсил
                </Link>
              </td>
            </tr>
          ))}

          {/* Добавляем строки для отсутствующих типов документов */}
          {missingDocTypes.map((type, index) => (
            <tr key={`missing-${type}-${index}`} className="bg-gray-200">
              <td>-</td>
              <td>{docTypes[type]}</td>
              <td colSpan="5" className="text-center">
                {docTypes[type]} киритилмаган
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {user.type === "user" && (
        <div className="flex w-full justify-center mt-5 lg:hidden">
          <Link to={`/usernewdocs/${stationId}`} className="btn btn-neutral">
            Янги хужжат қўшиш
          </Link>
        </div>
      )}

      <div className="flex justify-center items-center py-5">
        <Link to="/userstations">
          <button className="btn btn-outline">Орқага </button>
        </Link>
      </div>
    </div>
  );
}
