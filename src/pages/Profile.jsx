import { useState } from "react";
import { useAppStore } from "../lib/zustand";
import { BASE_URL } from "../my-utils";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Импортируем иконки

export default function Profile() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Функция для валидации пароля
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Паролингиз камида 8 тадан иборат бўлиши керак";
    }
    if (!/\d/.test(password)) {
      return "Паролингизда камида 1 рақам бўлиши керак";
    }
    if (!/[A-Z]/.test(password)) {
      return "Паролингизда камида 1 катта харф (Бош харф) бўлиши керак";
    }
    if (!/[a-z]/.test(password)) {
      return "Паролингизда камида 1 кичик харф бўлиши керак";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Паролингизда камида 1 махсус белги (!/[!@#$%^&*(),.?) бўлиши керак";
    }
    return "";
  };

  // Функция для отправки PATCH-запроса
  const handleSave = async () => {
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordError(""); // Очищаем ошибку если валидация прошла

    try {
      const response = await fetch(BASE_URL + `/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Парольни ўзгартиришда хатолик юз берди!"
        );
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("Пароль муваффақиятли ўзгартирилди!");
      setIsEditing(false);
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center gap-5">
      <div>
        <h1 className="text-3xl font-bold">Фойдаланувчи ҳақида маълумот</h1>
      </div>
      <div className="flex flex-col gap-3">
        <h1>
          <span className="font-bold">Фойдаланувчи номи:</span> {user.username}
        </h1>
        <h1>
          <span className="font-bold">Фойдаланувчи тури:</span> {user.type}
        </h1>
        <h1>
          <span className="font-bold">Фойдаланувчи пароли:</span>{" "}
          {isEditing ? (
            <div className="flex flex-col">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Меняем тип ввода
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="input input-bordered w-full pr-10" // Добавляем отступ справа
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Паролингизда камида:
                <ul className="list-disc pl-5">
                  <li>8 та белгидан иборат бўлиши</li>
                  <li>бир дона рақам</li>
                  <li>бир дона катта харф</li>
                  <li>бир дона кичик харф</li>
                  <li>бир дона махсус белги (!/[!@#$%^&*(),.?)</li>
                </ul>
              </p>
            </div>
          ) : (
            "********"
          )}
        </h1>
      </div>

      <div>
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn btn-success">
              Сақлаш
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPasswordError("");
                setNewPassword("");
              }}
              className="btn btn-error ml-2"
            >
              Бекор қилиш
            </button>
          </>
        ) : (
          <div className="flex justify-between w-96">
            <Link to="/">
              <button className="btn btn-outline">Орқага</button>
            </Link>
            <Button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Паролни алмаштириш
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
