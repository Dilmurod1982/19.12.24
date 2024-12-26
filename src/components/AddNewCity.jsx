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
  registerCity,
  getRegions,
} from "../request";
import { toast } from "sonner";

export default function AddNewCity({ setSendingData, sendingData }) {
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const regions = useAppStore((state) => state.regions);
  const setRegions = useAppStore((state) => state.setRegions);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const [formState, setFormState] = useState({
    city_name: "",
    region_id: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = getFormData(e.target);
    result.region_id = Number(formState.region_id);
    setSendingData(result);
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerCity(user?.access_token, sendingData)
        .then((res) => {
          toast.dismiss();
          toast.success("Янги туман/шаҳар мувафақиятли қўшилди!");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = useMemo(() => {
    const requiredFields = [formState.city_name, formState.region_id];

    return requiredFields.every(Boolean);
  }, [formState]);

  useEffect(() => {
    console.log("formState updated:", formState);
  }, [formState]);
  return (
    <div>
      <Dialog open={addItemModal} onOpenChange={setAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Янги туман/шаҳар қўшиш:
            </DialogTitle>
            <DialogDescription>
              Формани тўлдириб, янги туман/шаҳар қўшинг.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-6 "
          >
            <div className="w-full flex flex-col gap-2 max-h-96 overflow-y-auto">
              <div className="flex flex-col gap-2 ">
                <Label htmlFor="city_name">Туман/шаҳар номи</Label>
                <Input
                  type="text"
                  id="city_name"
                  name="city_name"
                  placeholder="Туман/шаҳар номини киритинг"
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="region_id">МЧЖ номи</Label>
                <select
                  name="region_id"
                  value={formState.region_id} // Здесь используется region_id из formState
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Вилоятни танланг
                  </option>
                  {Array.isArray(regions) &&
                    regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region_name}
                      </option>
                    ))}
                </select>
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
