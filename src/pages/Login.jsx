import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getFormData } from "../my-utils/index";
import { login } from "../request/index";
import { ClockLoader, FadeLoader } from "react-spinners";
import { toast } from "sonner";
import { useAppStore } from "../lib/zustand";

export default function Login() {
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    const result = getFormData(e.target);
    setLoading(true);
    login(result)
      .then((res) => {
        setUser(res);
        toast.success(`Хуш келибсиз жаноб ${res.username}`);
        setLoading(false);
      })
      .catch(({ message }) => {
        toast.error(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <>
      {loading ? (
        <div className="flex w-full h-screen justify-center items-center ">
          <ClockLoader size={149} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className="flex w-full h-screen justify-center items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-96 ">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Логинингизни киритинг"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Паролингизни киритинг"
              />
            </div>
            <div>
              <Button className="w-full " type="submit">
                Кириш
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
