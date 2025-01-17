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
import { allowPdfSizeLicense, getFormData } from "../../my-utils";
import { refreshToken, uploadImage, getDocs, registerDoc } from "../../request";
import { toast } from "sonner";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialFormState = {
  station_id: "",
  ltd_name: "",
  station_number: "",
  license_number: "",
  issue: null,
  expiration: null,
  file_image_url: "",
};

export default function AddLicense({ setSendingData, sendingData, stationId }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [isFormValid, setIsFormValid] = useState(false);

  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const licenses = useAppStore((state) => state.licenses);
  const setLicenses = useAppStore((state) => state.setLicenses);

  const fileInputRef = useRef(null);

  // Fetch stations and ltd on mount
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
  }, [user, setStations, setLtd]);

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
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  console.log(handleChange);

  const handleDateChange = (field, date) => {
    const dateObj = new Date(date); // Преобразуем в объект Date
    setFormState((prev) => ({
      ...prev,
      [field]: dateObj.toLocaleDateString(), // Убираем время
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Пожалуйста, заполните все обязательные поля!");
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

    setSendingData(result);
    setFormState(initialFormState);
    setAddItemModal(false);
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerDoc(user?.access_token, sendingData, "licenses")
        .then((res) => {
          toast.dismiss();
          toast.success("Янги лицензия мувафақиятли қўшилди!");
          setSendingData(null);
          // Только здесь закрываем модальное окно
          setAddItemModal;
          getDocs(user?.access_token, "licenses")
            .then(({ data }) => {
              setLicenses(data);
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
  }, [sendingData, licenses, user, setAddItemModal, setLicenses]);

  function handleUploadImage(file) {
    if (file.size >= allowPdfSizeLicense) {
      toast.error("pdf файл 1.0 Mb кичик бўлиши керак!");
    } else {
      toast.promise(uploadImage(file), {
        loading: "Файл серверга юкланмоқда...",
        success: (url) => {
          setValue(url);
          setFormState((prev) => ({
            ...prev,
            file_image_url: url, // Обновляем состояние формы
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
      formState.license_number,
      formState.issue,
      formState.expiration,
      formState.file_image_url,
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

  return (
    <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
      <DialogContent className="h-screen">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Янги лицензия қўшиш:
          </DialogTitle>
          <DialogDescription>
            Формани тўлдириб, янги лицензия қўшинг.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="relative">
          <div className="w-[450px] p-2 flex flex-col gap-2">
            {/* Station Selection */}
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="station_id">Наименование станции</Label>
              <input
                type="text"
                name="station_id"
                value={getStationNameByNumber(stationId)}
                placeholder={getStationNameByNumber(stationId)}
              />            
            </div>

            {/* Display selected station and ltd */}
            <div className="w-full flex flex-col gap-2 my-7">
              <Label>Название ООО и номер станции</Label>
              <h1 className="w-full">
                {formState.ltd_name || "не выбран ООО"} АГТКШ №
                {formState.station_number || "не выбран номер станции"}
              </h1>
            </div>

            {/* License number */}
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="license_number">Лицензия рақами</Label>
              <Input
                type="text"
                id="license_number"
                name="license_number"
                value={formState.license_number}
                onChange={handleChange}
                placeholder="Лицензия рақамини киритинг"
                required
              />
            </div>

            {/* Issue Date */}
            <div className="w-full flex flex-col gap-2">
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
                    setFormState((prev) => ({ ...prev, issue: formattedDate }));
                  }
                }}
                dateFormat="dd.MM.yyyy"
                placeholderText="Сана танланмаган"
                showTimeSelect={false}
              />
            </div>

            {/* Expiration Date */}
            <div className="w-full flex flex-col gap-2">
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

            {/* File upload */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <Label>Расм юклаш</Label>
              <input
                type="file"
                accept=".pdf"
                onChange={({ target }) => handleUploadImage(target.files[0])}
                ref={fileInputRef}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setAddItemModal(false)}>
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
