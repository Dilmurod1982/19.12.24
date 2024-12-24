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
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getFormData } from "../my-utils";
import { refreshToken, getLtd, getUsers, registerStation } from "../request";
import { toast } from "sonner";

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

  const [formState, setFormState] = useState({
    moljal: "",
    ltd_id: null,
    station_number: "",
    boshqaruvchi: "",
    viloyat: "",
    tuman: "",
    kocha: "",
    uy: "",
    b_mexanik: "",
    b_mexanik_tel: "",
    gaz_taminot: "",
    operators: [], // Инициализировано как массив
  });

  const handleAddOperator = () => {
    if (selectedOperator && !formState.operators.includes(selectedOperator)) {
      setFormState((prev) => ({
        ...prev,
        operators: [...prev.operators, selectedOperator], // Добавление оператора
      }));
      setSelectedOperator(""); // Очистка выбранного оператора
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = getFormData(e.target);
    result.ltd_id = Number(formState.ltd_id); // Преобразуем в число
    result.operators = formState.operators; // Убедитесь, что передаете массив операторов
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
          setAddItemModal;
        })
        .catch(({ message }) => {
          if (message === "403") {
            refreshToken(user?.refresh_token)
              .then(({ access_token }) => {
                setUser(...user, access_token);
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
    getUsers(user?.access_token)
      .then(({ data }) => {
        setUsers(data);
        setUserOptions(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token }); // Обновляем токен
              return getUsers(access_token); // Повторный запрос
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

  const isFormValid = () => {
    const requiredFields = [
      formState.moljal,
      formState.ltd_id,
      formState.station_number,
      formState.boshqaruvchi,
      formState.viloyat,
      formState.tuman,
      formState.kocha,
      formState.uy,
      formState.b_mexanik,
      formState.b_mexanik_tel,
      formState.gaz_taminot,
    ];

    const isOperatorsValid = formState.operators.length > 0;

    return requiredFields.every(Boolean) && isOperatorsValid;
  };

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
            <div className="w-full flex flex-col gap-2 max-h-96 overflow-y-auto">
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
                <Label htmlFor="viloyat">Вилоят</Label>
                <Input
                  type="text"
                  id="viloyat"
                  name="viloyat"
                  placeholder="Жойлашган вилоят номини киритинг"
                  required
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="tuman">Шаҳар/туман</Label>
                <Input
                  type="text"
                  id="tuman"
                  name="tuman"
                  placeholder="Жойлашган шаҳар/туманни номини киритинг"
                  required
                />
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
                <Label htmlFor="gaz_taminot">Газ таъминот ташкилоти</Label>
                <Input
                  type="text"
                  id="gaz_taminot"
                  name="gaz_taminot"
                  placeholder="Газ таъминот ташкилоти киритинг"
                  required
                />
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
                    {userOptions.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}{" "}
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
              <Button
                className="w-[160px]"
                disabled={!isFormValid() || loading} // Кнопка неактивна, если форма невалидна
              >
                {loading ? <ClipLoader color="#ffffff" size={15} /> : "Қўшиш"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
