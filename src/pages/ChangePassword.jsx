import React, { useState } from "react";
import { useAppStore } from "../lib/zustand";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "../components/ui/toast"; // Используем для уведомлений
import { useTokenValidation } from "../hooks/useTokenValidation";
import { getDocs } from "../request";

function ChangePassword() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      Toast({
        title: "Ошибка",
        description: "Введите новый пароль",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      // Здесь выполняется запрос к серверу
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Если нужен токен
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        Toast({
          title: "Успех",
          description: "Пароль успешно изменён",
          variant: "success",
        });
        setNewPassword("");
      } else {
        Toast({
          title: "Ошибка",
          description: data.message || "Не удалось изменить пароль",
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      Toast({
        title: "Ошибка",
        description: "Произошла ошибка",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Изменение пароля</CardTitle>
          <CardDescription>
            В этом окне вы можете изменить пароль
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Ваш логин</Label>
                <Label>{user.username}</Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Введите новый пароль</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Новый пароль"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChangePassword;
