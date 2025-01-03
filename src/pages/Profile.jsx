import { useState } from "react";
import { useAppStore } from "../lib/zustand";
import { BASE_URL } from "../my-utils";
import { toast } from "react-hot-toast"; // Для уведомлений
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Функция для отправки PATCH-запроса
  const handleSave = async () => {
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
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered"
            />
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
              onClick={() => setIsEditing(false)}
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
