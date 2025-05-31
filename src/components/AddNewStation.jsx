import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/zustand";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getFormData } from "../my-utils";
import {
  refreshToken,
  getLtd,
  getUsers,
  registerStation,
  getRegions,
  getCities,
} from "../request";
import { toast } from "sonner";

const initialFormState = {
  moljal: "",
  ltd_id: "",
  station_number: "",
  boshqaruvchi: "",
  region_id: "",
  city_id: "",
  kocha: "",
  uy: "",
  b_mexanik: "",
  b_mexanik_tel: "",
  gasLtd_id: "",
  operators: [],
};

export default function AddNewStation({ setSendingData, sendingData }) {
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [userOptions, setUserOptions] = useState([]);

  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const users = useAppStore((state) => state.users);
  const setUsers = useAppStore((state) => state.setUsers);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const regions = useAppStore((state) => state.regions);
  const setRegions = useAppStore((state) => state.setRegions);
  const cities = useAppStore((state) => state.cities);
  const setCities = useAppStore((state) => state.setCities);

  const [formState, setFormState] = useState(initialFormState);

  const handleAddOperator = () => {
    if (selectedOperator && !formState.operators.includes(selectedOperator)) {
      setFormState((prev) => ({
        ...prev,
        operators: [...prev.operators, selectedOperator],
      }));
      setSelectedOperator("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = getFormData(e.target);
    result.ltd_id = Number(formState.ltd_id);
    result.region_id = Number(formState.region_id);
    result.city_id = Number(formState.city_id);
    result.gasLtd_id = Number(formState.gasLtd_id);
    result.operators = formState.operators;
    setSendingData(result);
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerStation(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги шахобча мувафақиятли қўшилди!");
          setSendingData(null);
          setAddItemModal(false); // Закрытие модального окна
          setFormState(initialFormState); // Сброс состояния формы
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
  }, [sendingData, user]);

  useEffect(() => {
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
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setLtd, setUser]);

  useEffect(() => {
    getRegions(user?.access_token)
      .then(({ data }) => {
        setRegions(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getRegions(access_token);
            })
            .then(({ data }) => setRegions(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setRegions, setUser]);

  useEffect(() => {
    getCities(user?.access_token)
      .then(({ data }) => {
        setCities(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getCities(access_token);
            })
            .then(({ data }) => setCities(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setCities, setUser]);

  useEffect(() => {
    getUsers(user?.access_token)
      .then(({ data }) => {
        setUsers(data);
        setUserOptions(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getUsers(access_token);
            })
            .then(({ data }) => {
              setUsers(data);
              setUserOptions(data);
            })
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setUsers, setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formState.moljal,
      formState.ltd_id,
      formState.station_number,
      formState.boshqaruvchi,
      formState.region_id,
      formState.city_id,
      formState.kocha,
      formState.uy,
      formState.b_mexanik,
      formState.b_mexanik_tel,
      formState.gasLtd_id,
    ];

    const isOperatorsValid = formState.operators.length > 0;
    return requiredFields.every(Boolean) && isOperatorsValid;
  }, [formState]);

  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги шахобча қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги шахобча қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6 "
          >
            <div className="w-[450px] p-2 flex flex-col gap-2 max-h-96 overflow-y-auto">
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="moljal">Шахобча номи</Label>
                <Input
                  type="text"
                  id="moljal"
                  name="moljal"
                  placeholder="Шахобча номини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="ltd_id">МЧЖ номи</Label>
                <select
                  name="ltd_id"
                  value={formState.ltd_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    МЧЖни танланг
                  </option>
                  {Array.isArray(ltd) &&
                    ltd.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.ltd_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full flex flex-col mt-10 gap-2">
                <Label htmlFor="station_number">МЧЖни шахобча рақами</Label>
                <Input
                  type="number"
                  value={null}
                  id="station_number"
                  name="station_number"
                  placeholder="МЧЖни шахобча рақамини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="boshqaruvchi">Бошқарувчи Ф.И.Ш.</Label>
                <Input
                  type="text"
                  id="boshqaruvchi"
                  name="boshqaruvchi"
                  placeholder="Бошқарувчи Ф.И.Ш.ни киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="aloqa_tel">Бошқарувчи тел</Label>
                <Input
                  type="number"
                  id="aloqa_tel"
                  name="aloqa_tel"
                  placeholder="Жойлашган вилоят номини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="region_id">Вилоят номи</Label>
                <select
                  name="region_id"
                  value={formState.region_id}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFormState((prev) => ({
                      ...prev,
                      region_id: value,
                      city_id: "", // Сбрасываем выбранный город при смене региона
                    }));
                  }}
                  required
                >
                  <option value="" disabled>
                    вилоятни танланг
                  </option>
                  {Array.isArray(regions) &&
                    regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="city_id">Туман/шаҳар номи</Label>
                <select
                  name="city_id"
                  value={formState.city_id}
                  onChange={handleChange}
                  disabled={!formState.region_id} // Заблокировано, если region_id не выбран
                  required
                >
                  <option value="" disabled>
                    туман/шаҳарни танланг
                  </option>
                  {Array.isArray(cities) &&
                    cities
                      .filter(
                        (city) => city.region_id === Number(formState.region_id)
                      ) // Фильтрация городов
                      .map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city_name}
                        </option>
                      ))}
                </select>
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="kocha">Кўча</Label>
                <Input
                  type="text"
                  id="kocha"
                  name="kocha"
                  placeholder="Кўчаси номини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="uy">Уй</Label>
                <Input
                  type="number"
                  id="uy"
                  name="uy"
                  placeholder="Уй рақамини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="b_mexanik">Бош механик Ф.И.Ш.</Label>
                <Input
                  type="text"
                  id="b_mexanik"
                  name="b_mexanik"
                  placeholder="Бош механик Ф.И.Ш. киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="b_mexanik_tel">Бош механик тел</Label>
                <Input
                  type="number"
                  id="b_mexanik_tel"
                  name="b_mexanik_tel"
                  placeholder="Бош механик тел киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="gasLtd_id">Газ таъминоти корхонаси</Label>
                <select
                  name="gasLtd_id"
                  value={formState.gasLtd_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Газ корхонасини танланг
                  </option>
                  {cities &&
                    Array.isArray(cities) &&
                    cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city_name} газ
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="operators">Операторлар</Label>
                <div className="flex gap-2">
                  <select
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Фойдаланувчини танланг
                    </option>
                    {userOptions &&
                      userOptions.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddOperator}
                    className="btn btn-primary"
                  >
                    +
                  </button>
                </div>
                {/* Список выбранных операторов */}
                {formState.operators.length > 0 && (
                  <div className="mt-4">
                    <Label>Танланган операторлар:</Label>
                    <ul className="list-disc pl-6">
                      {formState.operators.map((operatorId, index) => {
                        const operator = userOptions.find(
                          (user) => user.id === operatorId
                        );
                        return (
                          <li key={index} className="text-sm">
                            {operator?.username}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div
              onClick={setAddItemModal}
              className="flex justify-between w-full"
            >
              <Button
                className="w-[160px]"
                disabled={loading}
                variant="outline"
              >
                Бекор қилиш
              </Button>
              <Button className="w-[160px]">
                {loading ? <ClipLoader color="#ffffff" size={15} /> : "Қўшиш"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
