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
};

export default function AddNewGer({ setSendingData, sendingData }) {
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
  const ger = useAppStore((state) => state.ger); //zamena
  const setGer = useAppStore((state) => state.setGer); //zamena
  const base = "ger"; //zamena

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
              setGer(data); //zamena
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
  }, [sendingData, ger, user, setAddItemModal, setGer]); //zamena

  useEffect(() => {
    const requiredFields = [
      formState.station_id,
      formState.ltd_name,
      formState.station_number,
      formState.docNumber, //zamena
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

  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent className="h-screen">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги утечкаларни текшириш далолатномасини қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги далолатнома қўшинг.
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
                <Label htmlFor="docNumber">Далолатнома рақами</Label>
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
