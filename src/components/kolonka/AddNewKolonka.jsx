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
import { useAppStore } from "../../lib/zustand/index";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { allowPdfSizeDoc, getFormData } from "../../my-utils";
import {
  refreshToken,
  uploadImage,
  registerDoc,
  getDocs,
} from "../../request/index";
import { toast } from "sonner";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";

const initialFormState = {
  station_id: "",
  ltd_name: "",
  station_number: "",
  docNumber: "",
  issue: "",
  expiration: "",
  file_image_url: "",
  kolonki: [], // Теперь это массив объектов
};

export default function AddNewKolonka({ setSendingData, sendingData }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [numColumns, setNumColumns] = useState(1);
  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const kolonkamarka = useAppStore((state) => state.kolonkamarka);
  const setKolonkamarka = useAppStore((state) => state.setKolonkamarka);
  const kolonka = useAppStore((state) => state.kolonka); //zamena
  const setKolonka = useAppStore((state) => state.setKolonka); //zamena
  const base = "kolonka"; //zamena

  const fileInputRef = useRef(null);

  useEffect(() => {
    getDocs(user?.access_token, "stations")
      .then(({ data }) => {
        setStations(data);
      })
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
      .then(({ data }) => {
        setLtd(data);
      })
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
      registerDoc(user?.access_token, sendingData, base)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги сертификат мувафақиятли қўшилди!");
          setSendingData(null);
          setAddItemModal;
          getDocs(user?.access_token, base)
            .then(({ data }) => {
              setKolonka(data); //zamena
            })
            .catch((error) => console.error("Error fetching:", error));
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
  }, [sendingData, kolonka, user, setAddItemModal, setKolonka]); //zamena

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

  const handleReset = () => {
    setFormState(initialFormState);
    setValue(null);
    setAddItemModal(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent className="h-screen">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги Колонкалар сертификатини қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги сертификат қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="relative">
            <div className="w-[450px] p-2 flex flex-col gap-2 max-h-[450px] overflow-y-auto">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="station_id">Шахобча номи</Label>
                <select
                  name="station_id"
                  value={formState.station_id}
                  onChange={(e) => {
                    const selectedMoljal = e.target.value;

                    const selectedStation = stations.find(
                      (station) => station.id === Number(selectedMoljal)
                    );

                    if (selectedStation) {
                      const relatedLtd = ltd.find(
                        (item) => item.id === selectedStation.ltd_id
                      );

                      setFormState((prev) => ({
                        ...prev,
                        station_id: selectedMoljal,
                        station_number: selectedStation.station_number || "",
                        ltd_id: relatedLtd?.id || "",
                        ltd_name: relatedLtd?.ltd_name || "",
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
                <Label htmlFor="docNumber">Сертификат рақами</Label>
                <Input
                  type="text"
                  id="docNumber" //zamena
                  name="docNumber" //zamena
                  value={formState.docNumber} //zamena
                  onChange={handleChange}
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
                        ? new Date(formState.issue).toLocaleDateString()
                        : "Сана танланмаган"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto">
                    <Calendar
                      mode="single"
                      selected={new Date(formState.issue)}
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
                        ? new Date(formState.expiration).toLocaleDateString()
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

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="numColumns">Количество колонок</Label>
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
                  <Label htmlFor={`kolonka-${i}`}>Колонка {i + 1}</Label>

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
                      placeholder="Заводской номер"
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-center gap-2 mt-4">
                <Label htmlFor="file">Расм юклаш</Label>
                <input
                  ref={fileInputRef}
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
                  disabled={loading}
                >
                  {loading ? <ClipLoader color="#ffffff" size={15} /> : "Қўшиш"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
