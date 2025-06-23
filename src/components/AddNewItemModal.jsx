// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { useAppStore } from "../lib/zustand";
// import { useState, useEffect } from "react";
// import { ClipLoader } from "react-spinners";
// import { toast } from "sonner";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { registerUser, refreshToken } from "../request";

// import { getFormData } from "../my-utils";

// export default function AddNewItemModal({ setSendingData, sendingData }) {
//   const [loading, setLoading] = useState(false);
//   const [type, setType] = useState("");
//   const [selectedStations, setSelectedStations] = useState([]);

//   const addItemModal = useAppStore((state) => state.addItemModal);
//   const setAddItemModal = useAppStore((state) => state.setAddItemModal);
//   const user = useAppStore((state) => state.user);
//   const setUser = useAppStore((state) => state.setUser);

//   function handleSubmit(e) {
//     e.preventDefault();
//     const result = getFormData(e.target);
//     setSendingData(result);
//   }

//   useEffect(() => {
//     if (sendingData) {
//       setLoading(true);
//       registerUser(user?.access_token, sendingData)
//         .then((res) => {
//           toast.dismiss();
//           toast.success("Янги фойдаланувчи мувафақиятли қўшилди!");
//           setSendingData(null);
//           setAddItemModal;
//         })
//         .catch(({ message }) => {
//           if (message === "403") {
//             refreshToken(user?.refresh_token)
//               .then(({ access_token }) => {
//                 setUser(...user, access_token);
//               })
//               .catch(() => {
//                 toast.info("Тизимга қайта киринг!");
//                 setUser(null);
//               });
//           }
//           toast.error(message);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [sendingData, user]);

//   return (
//     <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl md:text-2xl font-bold">
//             Добавление нового пользователя
//           </DialogTitle>
//           <DialogDescription>
//             Заполните форму, чтобы добавить нового пользователя
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Основные поля формы */}
//             <div className="space-y-2">
//               <Label htmlFor="surname">Имя</Label>
//               <Input id="surname" name="surname" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="lastname">Фамилия</Label>
//               <Input id="lastname" name="lastname" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="username">Логин</Label>
//               <Input id="username" name="username" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Пароль</Label>
//               <Input id="password" name="password" type="password" required />
//             </div>

//             {/* Выбор типа пользователя */}
//             <div className="space-y-2">
//               <Label>Тип пользователя</Label>
//               <Select
//                 onValueChange={(value) => {
//                   setType(value);
//                   // Очищаем выбранные станции если тип не требует их
//                   if (!["user", "operator", "guest"].includes(value)) {
//                     setSelectedStations([]);
//                   }
//                 }}
//                 value={type}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Выберите тип" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="admin">Админ</SelectItem>
//                   <SelectItem value="nazorat">Контроль</SelectItem>
//                   <SelectItem value="user">Руководитель</SelectItem>
//                   <SelectItem value="operator">Оператор</SelectItem>
//                   <SelectItem value="guest">Гость</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Даты начала/окончания работы */}
//             <div className="space-y-2">
//               <Label htmlFor="startDate">Начало работы</Label>
//               <Input id="startDate" name="startDate" type="date" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="endDate">Окончание работы</Label>
//               <Input id="endDate" name="endDate" type="date" />
//             </div>
//           </div>

//           {/* Кнопки отправки/отмены */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               variant="outline"
//               type="button"
//               onClick={() => setAddItemModal(false)}
//               disabled={loading}
//             >
//               Отмена
//             </Button>
//             <Button type="submit" disabled={loading || !type}>
//               {loading ? <ClipLoader color="#ffffff" size={15} /> : "Добавить"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getFormDataUser } from "../my-utils";
import { refreshToken, registerUser, getUsers } from "../request";
import { toast } from "sonner";

export default function AddNewItemModal({ setSendingData, sendingData }) {
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [type, setType] = useState("");
  const formRef = useRef(null);
  const [usersList, setUsersList] = useState([]);

  // Загружаем список пользователей при открытии модального окна
  useEffect(() => {
    if (addItemModal) {
      setCheckingUsername(true);
      getUsers(user?.access_token)
        .then((users) => {
          setUsersList(users);
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
          toast.error("Фойдаланувчилар рўйхатини юклаб бўлмади");
        })
        .finally(() => {
          setCheckingUsername(false);
        });
    }
  }, [addItemModal, user, setUser]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = getFormDataUser(e.target);
    const username = formData.username;

    // Проверяем, существует ли пользователь с таким username
    const userExists = usersList.some((user) => user.username === username);

    if (userExists) {
      toast.error("Бундай логинга эга фойдаланувчи мавжуд!");
      setUsernameExists(true);
      return;
    }

    setUsernameExists(false);
    setSendingData(formData);
  }

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerUser(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги фойдаланувчи мувафақиятли қўшилди!");
          setSendingData(null);
          setAddItemModal(false);
          setType("");
          if (formRef.current) {
            formRef.current.reset();
          }
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
  }, [sendingData, user, setAddItemModal, setSendingData, setUser]);

  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги фойдаланувчи қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги фойдаланувчини қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-full grid gap-4">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="username">Фойдаланувчи логини</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Фойдаланувчи логиини киритинг"
                  required
                  onChange={() => setUsernameExists(false)}
                />
                {usernameExists && (
                  <p className="text-red-500 text-sm">
                    Бундай логинга эга фойдаланувчи мавжуд!
                  </p>
                )}
                {checkingUsername && (
                  <p className="text-gray-500 text-sm">
                    Логин тексhirilmoqda...
                  </p>
                )}
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="password">Фойдаланувчи пароли</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Фойдаланувчи паролини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="password">Фойдаланувчи Исми</Label>
                <Input
                  id="surname"
                  name="surname"
                  placeholder="Фойдаланувчи исмини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="password">Фойдаланувчи Отасини исми</Label>
                <Input
                  id="fname"
                  name="fname"
                  placeholder="Фойдаланувчи отасини исмини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="password">Фойдаланувчи Фамилияси</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Фойдаланувчи фамилиясини киритинг"
                  required
                />
              </div>
              {/* Выбор типа пользователя */}
              <div className="space-y-2">
                <Label>Тип пользователя</Label>
                <Select
                  name="type"
                  onValueChange={setType}
                  value={type}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Админ</SelectItem>
                    <SelectItem value="nazorat">Контроль</SelectItem>
                    <SelectItem value="nazoratBooker">БухКонтроль</SelectItem>
                    <SelectItem value="user">Руководитель</SelectItem>
                    <SelectItem value="booker">Бухгалтер</SelectItem>
                    <SelectItem value="operator">Оператор</SelectItem>
                    <SelectItem value="guest">Гость</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Начало работы</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Окончание работы</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="phone">Фойдаланувчи телефон рақами</Label>
              <Input
                id="phone"
                name="phone"
                type="number"
                placeholder="Фойдаланувчи телефон рақамини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="pseries">Фойдаланувчи паспорт серияси</Label>
              <Input
                id="pseries"
                name="pseries"
                placeholder="Фойдаланувчи паспорт сериясини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="pnumber">Фойдаланувчи паспорт рақами</Label>
              <Input
                id="pnumber"
                name="pnumber"
                type="number"
                placeholder="Фойдаланувчи паспорт рақамини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="pini">Фойдаланувчи ЖШШИР</Label>
              <Input
                id="pini"
                name="pini"
                type="number"
                placeholder="Фойдаланувчи ЖШШИР рақамини киритинг"
                required
              />
            </div>

            <div className="flex justify-between w-full pt-2">
              <Button
                type="button"
                className="w-[160px]"
                disabled={loading}
                variant="outline"
                onClick={() => setAddItemModal(false)}
              >
                Бекор қилиш
              </Button>
              <Button type="submit" className="w-[160px]" disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={15} /> : "Қўшиш"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
