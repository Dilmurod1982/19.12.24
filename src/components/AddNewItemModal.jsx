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
import { refreshToken, registerUser } from "../request";
import { toast } from "sonner";

export default function AddNewItemModal({ setSendingData, sendingData }) {
  const [loading, setLoading] = useState(false);
  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  function handleSubmit(e) {
    e.preventDefault();
    const result = getFormData(e.target);

    setSendingData(result);
  }

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerUser(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги фойдаланувчи мувафақиятли қўшилди!");
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

  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги фойдаланувчи қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги фойдаланувчини қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="username">Фойдаланувчи логини</Label>
              <Input
                id="username"
                name="username"
                placeholder="Фойдаланувчи логиини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="password">Фойдаланувчи пароли</Label>
              <Input
                id="password"
                name="password"
                placeholder="Фойдаланувчи паролини киритинг"
                required
              />
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
              <Button className="w-[160px]" disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={15} /> : "Қўшиш"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
