import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getFormData } from "../my-utils";
import { getPartners, refreshToken, registerPartner } from "../request";
import { toast } from "sonner";

export default function AddNewPartner({ setSendingData, sendingData }) {
  const [loading, setLoading] = useState(false);
  const [stirError, setStirError] = useState("");
  const [partnersList, setPartnersList] = useState([]);
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
      registerPartner(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги хамкор ташкилот  мувафақиятли қўшилди!");
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
    if (addItemModal && user?.access_token) {
      getPartners(user.access_token).then(setPartnersList).catch(console.error);
    }
  }, [addItemModal, user]);

  function handleStirChange(e) {
    const inputStir = e.target.value;
    if (!inputStir) {
      setStirError("");
      return;
    }

    const exists = partnersList.some((partner) => partner.stir === inputStir);
    if (exists) {
      setStirError("Бундай СТИР га эга ташкилот базада мавжуд!");
    } else {
      setStirError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Проверяем СТИР перед отправкой
    const formData = getFormData(e.target);
    const exists = partnersList.some(
      (partner) => partner.stir === formData.stir
    );

    if (exists) {
      toast.error(
        "Бундай СТИР га эга ташкилот базада мавжуд! Илтимос текшириб, қайта киритинг."
      );
      return;
    }

    setSendingData(formData);
  }

  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги Хамкор ташкилот қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги ташкилот қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="partner_name">Ташкилот номи</Label>
              <Input
                type="text"
                id="partner_name"
                name="partner_name"
                placeholder="ташкилот номини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="direktor">Директор</Label>
              <Input
                type="text"
                id="direktor"
                name="direktor"
                placeholder="Директор Ф.И.Ш. киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="bank">Банк</Label>
              <Input
                type="text"
                id="bank"
                name="bank"
                placeholder="Банк номини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="mfo">МФО</Label>
              <Input
                type="number"
                id="mfo"
                name="mfo"
                placeholder="Банк МФОсини киритинг"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="stir">СТИР</Label>
              <Input
                type="number"
                id="stir"
                name="stir"
                placeholder="СТИР киритинг"
                required
                onChange={handleStirChange}
              />
              {stirError && <p className="text-sm text-red-500">{stirError}</p>}
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="tel">Директор телефони</Label>
              <Input
                type="number"
                id="tel"
                name="tel"
                placeholder="Директор телефон рақамини киритинг"
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
