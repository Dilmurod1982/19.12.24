import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/zustand";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { allowPdfSizeDoc, getFormData } from "../my-utils";
import {
  refreshToken,
  getLtd,
  getStations,
  uploadImage,
  registerHumidity,
  getHumidityes,
} from "../request";
import { toast } from "sonner";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";

const initialFormState = {
  station_id: "",
  ltd_name: "",
  station_number: "",
  humidity_number: "",
  issue: "",
  expiration: "",
  file_image_url: "",
};

export default function AddNewHumidity({ setSendingData, sendingData }) {
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
  const humidity = useAppStore((state) => state.humidity);
  const setHumidity = useAppStore((state) => state.setHumidity);

  const fileInputRef = useRef(null);

  useEffect(() => {
    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getStations(access_token);
            })
            .then(({ data }) => setStations(data))
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });

    getLtd(user?.access_token)
      .then(({ data }) => {
        setLtd(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getLtd(access_token);
            })
            .then(({ data }) => setLtd(data))
            .catch((error) => console.error("Error fetching ltd:", error));
        }
      });
  }, [user, setStations, setLtd]);

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
    const dateObj = new Date(date); // Преобразуем в объект Date
    setFormState((prev) => ({
      ...prev,
      [field]: dateObj.toLocaleDateString(), // Убираем время
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Останавливаем стандартное поведение формы

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
    setAddItemModal();
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerHumidity(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги сертификат мувафақиятли қўшилди!");
          setSendingData(null);
          // Только здесь закрываем модальное окно
          setAddItemModal;
          getHumidityes(user?.access_token)
            .then(({ data }) => {
              setHumidity(data);
            })
            .catch((error) =>
              console.error("Error fetching sertificate:", error)
            );
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
  }, [sendingData, humidity, user, setAddItemModal, setHumidity]);

  useEffect(() => {
    const requiredFields = [
      formState.station_id,
      formState.ltd_name,
      formState.station_number,
      formState.humidity_number,
      formState.issue,
      formState.expiration,
      formState.file_image_url,
    ];

    setIsFormValid(requiredFields.every(Boolean));
  }, [formState]);

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
            file_image_url: url, // Обновляем состояние формы
          }));
          return `Файл юкланди`;
        },
        error: ({ message }) => message,
      });
    }
  }

  const handleReset = () => {
    setFormState(initialFormState);
    setValue(null); // Сбрасываем изображение
    setAddItemModal(false); // Закрытие модального окна

    // Сбрасываем значение поля ввода файла
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    console.log(isFormValid);
  }, [isFormValid]);
  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent className="h-screen">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги влагомер сертификатини қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги сертификатни қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="relative">
            <div className="w-[450px] p-2 flex flex-col gap-2 max-h-[450px] overflow-y-auto">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="station_id">Шахобча номи</Label>
                <select
                  name="station_id"
                  value={formState.station_id} // Связываем с состоянием
                  onChange={(e) => {
                    const selectedMoljal = e.target.value;

                    // Найти выбранную станцию
                    const selectedStation = stations.find(
                      (station) => station.id === Number(selectedMoljal)
                    );

                    if (selectedStation) {
                      // Найти соответствующий объект ltd
                      const relatedLtd = ltd.find(
                        (item) => item.id === selectedStation.ltd_id
                      );

                      // Обновить состояние
                      setFormState((prev) => ({
                        ...prev,
                        station_id: selectedMoljal,
                        station_number: selectedStation.station_number || "",
                        ltd_id: relatedLtd?.id || "",
                        ltd_name: relatedLtd?.ltd_name || "", // Добавляем ltd_name
                      }));
                    }
                  }}
                  required
                >
                  <option value="" disabled>
                    Шахобчани танланг
                  </option>
                  {Array.isArray(stations) &&
                    stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.moljal}
                      </option>
                    ))}
                </select>
              </div>

              <div className="w-full flex flex-col gap-2 my-7">
                <Label>МЧЖ номи ва шахобча рақами</Label>
                <h1 className="w-full">
                  {formState.ltd_name || "МЧЖ танланмаган"} АГТКШ №
                  {formState.station_number || "Шахобча танланмаган"}
                </h1>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="humidity_number">Сертификат рақами</Label>
                <Input
                  type="text"
                  id="humidity_number"
                  name="humidity_number"
                  value={formState.humidity_number} // Привязка значения
                  onChange={handleChange} // Обработчик изменения
                  placeholder="Сертификат рақамини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="issue">Берилган санаси</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {formState.issue
                        ? new Date(formState.issue).toLocaleDateString() // Убедитесь, что это объект Date
                        : "Сана танланмаган"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto">
                    <Calendar
                      mode="single"
                      selected={new Date(formState.issue)} // Передайте объект Date
                      onSelect={(date) => handleDateChange("issue", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="expiration">Тугаш санаси</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {formState.expiration
                        ? new Date(formState.expiration).toLocaleDateString() // Отображаем только дату
                        : "Сана танланмаган"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto">
                    <Calendar
                      mode="single"
                      selected={formState.expiration}
                      onSelect={(date) =>
                        handleDateChange("expiration", date.toISOString())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col items-center gap-2 mt-4">
                <Label htmlFor="file">Расм юклаш</Label>
                <input
                  ref={fileInputRef} // Привязываем реф
                  onChange={({ target: { files } }) => {
                    handleUploadImage(files[0]);
                  }}
                  type="file"
                  accept=".pdf"
                  id="file"
                  name="file"
                  className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                  placeholder="расм юкланг"
                  required
                />
              </div>

              {value && <img src={value} alt="Uploaded" />}
            </div>

            <div className="flex justify-between w-full items-center mt-10">
              <Button
                className="w-[160px]"
                disabled={loading}
                variant="outline"
                onClick={handleReset}
              >
                Отмена
              </Button>

              <div>
                <Button
                  onChange={setAddItemModal}
                  type="submit"
                  className="w-[160px]"
                  disabled={loading} // Запретить отправку, если форма не валидна
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={15} />
                  ) : (
                    "Добавить"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
