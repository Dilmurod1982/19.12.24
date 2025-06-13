import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh } from "../request";
import { toast } from "sonner";

export function useTokenValidation(fetchCallback, setDataCallback) {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await fetchDataWithTokenRefresh(
          fetchCallback,
          setDataCallback,
          user,
          setUser,
          navigate,
          toast
        );
      } catch (error) {
        // Если произошла ошибка (например, токен невалиден), перенаправляем на логин
        navigate("/login");
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      }
    };

    validateToken();
  }, [user, setUser, navigate, fetchCallback, setDataCallback]);
}
