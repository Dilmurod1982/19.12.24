import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAppStore } from "../../lib/zustand";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  allowPdfSizeDoc,
  allowPdfSizeLicense,
  getFormData,
} from "../../my-utils";
import { refreshToken, uploadImage, getDocs, registerDoc } from "../../request";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialFormState = {
  station_id: "",
  ltd_name: "",
  docNumber: "",
  station_number: "",
  issue: null,
  expiration: null,
  file_image_url: "",
  kolonki: [],
};

export default function AddNewKolonkaDoc({
  setSendingData,
  sendingData,
  stationId,
  baseKolonkaName,
  docKolonkaName,
  onClose,
}) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [numColumns, setNumColumns] = useState(1);

  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const kolonkamarka = useAppStore((state) => state.kolonkamarka);
  const setKolonkamarka = useAppStore((state) => state.setKolonkamarka);
  const kolonka = useAppStore((state) => state.kolonka); //zamena
  const setKolonka = useAppStore((state) => state.setKolonka); //zamena
  const base = useAppStore((state) => state[baseKolonkaName]);
  const setBase = useAppStore((state) => state[`set${baseKolonkaName}`]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    getDocs(user?.access_token, "stations")
      .then(({ data }) => setStations(data))
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getDocs(access_token, "stations");
            })
            .then(({ data }) => setStations(data))
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });

    getDocs(user?.access_token, "ltd")
      .then(({ data }) => setLtd(data))
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getDocs(access_token, "ltd");
            })
            .then(({ data }) => setLtd(data))
            .catch((error) => console.error("Error fetching ltd:", error));
        }
      });

    getDocs(user?.access_token, "kolonkamarka")
      .then(({ data }) => {
        setKolonkamarka(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getDocs(access_token, "kolonkamarka");
            })
            .then(({ data }) => setKolonkamarka(data))
            .catch((error) =>
              console.error("Error fetching kolonkamarka:", error)
            );
        }
      });
  }, [user, setStations, setLtd, setKolonkamarka]);

  useEffect(() => {
    if (stationId && stations.length > 0) {
      const selectedStation = stations.find(
        (station) => station.id === Number(stationId)
      );
      if (selectedStation) {
        const associatedLtd = ltd.find((l) => l.id === selectedStation.ltd_id);
        setFormState((prev) => ({
          ...prev,
          station_id: selectedStation.id,
          station_number: selectedStation.station_number || "",
          ltd_id: associatedLtd?.id || "",
          ltd_name: associatedLtd?.ltd_name || "",
        }));
      }
    }
  }, [stationId, stations, ltd]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "station_id") {
      const selectedStation = stations.find(
        (station) => station.id === Number(value)
      );

      if (selectedStation) {
        const associatedLtd = ltd.find((l) => l.id === selectedStation.ltd_id);

        setFormState((prev) => ({
          ...prev,
          station_id: value,
          station_number: selectedStation.station_number || "",
          ltd_id: associatedLtd?.id || "",
          ltd_name: associatedLtd?.ltd_name || "",
        }));
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (field, date) => {
    const dateObj = new Date(date);
    setFormState((prev) => ({
      ...prev,
      [field]: dateObj.toLocaleDateString(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Илтимос, барча зарурий бўш жойларни тўлдиринг");
      return;
    }

    const result = getFormData(e.target);

    result.ltd_id = formState.ltd_id;
    result.station_number = formState.station_number;
    result.station_id = formState.station_id;

    delete result.ltd_name;

    result.issue = formState.issue;
    result.expiration = formState.expiration;
    result.value = formState.file_image_url;
    result.kolonki = formState.kolonki; // Теперь это массив объектов

    setSendingData(result);
    setFormState(initialFormState);
    setAddItemModal();
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerDoc(user?.access_token, sendingData, baseKolonkaName)
        .then((res) => {
          toast.dismiss();
          toast.success(`Янги ${docKolonkaName} мувафақиятли қўшилди!`);
          setSendingData(null); // Очищаем sendingData
          onClose(); // Закрываем модальное окно и очищаем selectedDoc

          // Обновляем данные
          getDocs(user?.access_token, `${baseKolonkaName}`)
            .then(({ data }) => {
              setBase(data);
            })
            .catch((error) => console.error("Error fetching licenses:", error));
        })
        .catch(({ message }) => {
          if (message === "403") {
            refreshToken(user?.refresh_token)
              .then(({ access_token }) => {
                setUser({ ...user, access_token });
              })
              .catch(() => {
                toast.info("Тизимга қайта киринг!");
                setUser(null);
              });
          }
          toast.error(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    sendingData,
    base,
    user,
    setBase,
    setSendingData,
    docKolonkaName,
    baseKolonkaName,
    setUser,
    onClose,
  ]);

  function handleUploadImage(file) {
    if (file.size >= allowPdfSizeDoc) {
      toast.error("pdf файл 1.0 Mb кичик бўлиши керак!");
    } else {
      toast.promise(uploadImage(file), {
        loading: "Файл серверга юкланмоқда...",
        success: (url) => {
          setValue(url);
          setFormState((prev) => ({
            ...prev,
            file_image_url: url,
          }));
          return `Файл юкланди`;
        },
        error: ({ message }) => message,
      });
    }
  }

  // Update form validation status
  useEffect(() => {
    const requiredFields = [
      formState.station_id,
      formState.ltd_name,
      formState.station_number,
      formState.docNumber, //zamena
      formState.issue,
      formState.expiration,
      formState.file_image_url,
      ...formState.kolonki,
    ];

    setIsFormValid(requiredFields.every(Boolean));
  }, [formState]);

  const getStationNameByNumber = (stationId) => {
    if (!stations || stations.length === 0) return "Номаълум";
    const stationsItem = stations.find((item) => item.id == stationId);
    return stationsItem ? stationsItem.moljal : "Номаълум";
  };

  const parseDate = (dateString) => {
    if (!dateString) return null; // Если строка пустая, возвращаем null
    const [day, month, year] = dateString.split(".");
    return new Date(`${year}-${month}-${day}`); // Преобразуем в формат YYYY-MM-DD
  };

  const handleCloseModal = () => {
    setFormState(initialFormState); // Сбрасываем состояние формы
    onClose(); // Вызываем переданный обработчик закрытия
  };

  const handleColumnChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumColumns(num);
    setFormState((prev) => ({
      ...prev,
      kolonki: Array(num).fill({ marka: "", serialNumber: "" }), // Создаем массив объектов
    }));
  };

  const handleKolonkaChange = (index, field, value) => {
    setFormState((prev) => {
      const newKolonki = [...prev.kolonki];
      newKolonki[index] = { ...newKolonki[index], [field]: value }; // Обновляем конкретное поле
      return {
        ...prev,
        kolonki: newKolonki,
      };
    });
  };

  return (
    <Dialog open={addItemModal} onOpenChange={handleCloseModal}>
      <DialogContent className="h-screen">
        <div className="pb-0 mb-0">
          <DialogTitle className="text-2xl font-bold p-0">
            Янги {docKolonkaName} қўшиш:
          </DialogTitle>
          <DialogDescription className="p-0">
            Формани тўлдириб, янги {docKolonkaName} қўшинг.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <div className="w-full max-w-[450px] flex flex-col gap-2 mt-0 pt-0">
            {/* Station Selection */}
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="station_id">Шахобча номи</Label>
              <input
                type="text"
                name="station_id"
                value={getStationNameByNumber(stationId)}
                placeholder={getStationNameByNumber(stationId)}
              />
            </div>

            {/* Display selected station and ltd */}
            <div className="w-full flex flex-col gap-2 my-4">
              <Label>МЧЖ номи ва филиал рақами</Label>
              <h1 className="w-full">
                {formState.ltd_name || "МЧЖ танланмаган"} АГТКШ №
                {formState.station_number || "шахобча танланмаган"}
              </h1>
            </div>
            <div className="flex flex-col gap-3 max-h-60 p-4 overflow-y-auto border-gray-950 border rounded-md ">
              {/* License number */}
              <div className="w-full flex flex-col gap-2 border-blue-500 border rounded-md p-2">
                <Label htmlFor="docNumber">Сертификат рақами</Label>
                <Input
                  type="text"
                  id="docNumber"
                  name="docNumber"
                  value={formState.docNumber}
                  onChange={handleChange}
                  placeholder={`Сертификат рақамини киритинг`}
                  required
                />
              </div>

              {/* Issue Date */}
              <div className="w-full flex flex-col gap-1 border-green-500 border rounded-md p-2">
                <Label>Берилган санаси</Label>
                <DatePicker
                  selected={parseDate(formState.issue)} // Преобразуем строку в Date
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = date
                        .toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, ".");
                      setFormState((prev) => ({
                        ...prev,
                        issue: formattedDate,
                      }));
                    }
                  }}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Сана танланмаган"
                  showTimeSelect={false}
                />
              </div>

              {/* Expiration Date */}
              <div className="w-full flex flex-col gap-1 border-red-500 border rounded-md p-2">
                <Label>Тугаш санаси</Label>
                <DatePicker
                  selected={parseDate(formState.expiration)} // Преобразуем строку в Date
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = date
                        .toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, ".");
                      setFormState((prev) => ({
                        ...prev,
                        expiration: formattedDate,
                      }));
                    }
                  }}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Сана танланмаган"
                  showTimeSelect={false}
                />
              </div>

              <div className="border-blue-500 border rounded-md p-2">
                <div className="w-full flex flex-col gap-1 ">
                  <Label htmlFor="numColumns">Колонкалар сони</Label>
                  <select
                    name="numColumns"
                    value={numColumns}
                    onChange={handleColumnChange}
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {Array.from({ length: numColumns }, (_, i) => (
                  <div key={i} className="w-full flex flex-col gap-2">
                    <Label htmlFor={`kolonka-${i}`}>№ {i + 1} колонка </Label>

                    {/* Выбор марки колонки */}
                    <div className="flex gap-2">
                      <select
                        value={formState.kolonki[i]?.marka || ""}
                        onChange={(e) =>
                          handleKolonkaChange(i, "marka", e.target.value)
                        }
                        required
                      >
                        <option value="" disabled>
                          Маркани танланг
                        </option>
                        {Array.isArray(kolonkamarka) &&
                          kolonkamarka.map((marka) => (
                            <option key={marka.id} value={marka.type_name}>
                              {marka.type_name}
                            </option>
                          ))}
                      </select>

                      {/* Поле для заводского номера */}
                      <Input
                        type="text"
                        value={formState.kolonki[i]?.serialNumber || ""}
                        onChange={(e) =>
                          handleKolonkaChange(i, "serialNumber", e.target.value)
                        }
                        placeholder="Завод рақамини киритинг"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* File upload */}
              <div className="flex flex-col items-center gap-1 mt-4 border-gray-700 border rounded-md p-2">
                <Label>Расм юклаш</Label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={({ target }) => handleUploadImage(target.files[0])}
                  ref={fileInputRef}
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleCloseModal}>
                Отмена
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                {loading ? <ClipLoader size={16} color="#fff" /> : "Добавить"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
