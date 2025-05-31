import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPartners, getPartnerDailyReports } from "../request";

export default function TransferGasModal({
  open,
  onOpenChange,
  onSave,
  stationId,
}) {
  const [partners, setPartners] = useState([]);
  const [partnerReports, setPartnerReports] = useState([]);
  const [gasEntries, setGasEntries] = useState([]);
  const [totalGas, setTotalGas] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useAppStore((state) => state.user);
  const stations = useAppStore((state) => state.stations);

  useEffect(() => {
    if (!open || !stationId || !user?.access_token) return;

    setLoading(true);
    const currentStation = stations.find((s) => s.id === stationId);

    if (!currentStation?.partners) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const partnersResponse = await getPartners(user.access_token);
        if (!partnersResponse)
          throw new Error("Не удалось загрузить партнеров");

        const reportsResponse = await getPartnerDailyReports(user.access_token);

        const stationPartners = partnersResponse.filter((p) =>
          currentStation.partners.includes(p.id.toString())
        );

        setPartners(stationPartners.sort((a, b) => a.id - b.id));
        setPartnerReports(
          reportsResponse?.filter((r) => r.station_id === stationId) || []
        );

        const initialEntries = stationPartners.map((partner) => {
          const partnerReports = reportsResponse
            ?.filter(
              (r) =>
                r.station_id === stationId &&
                r.partner_id === partner.id.toString()
            )
            ?.sort((a, b) => new Date(b.date) - new Date(a.date));

          const lastReport = partnerReports?.[0];
          const lastPrice = lastReport?.price || 5200;

          return {
            partnerId: partner.id,
            partnerName: partner.partner_name,
            price: lastPrice,
            gasAmount: 0, // Всегда начинаем с 0
            amount: 0,
            initialBalance: lastReport?.final_balance || 0,
          };
        });

        setGasEntries(initialEntries);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, stationId, user?.access_token]);

  const handlePriceChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    if (isNaN(newValue) || newValue < 0) return;

    const newEntries = [...gasEntries];
    newEntries[index].price = newValue;
    newEntries[index].amount = newEntries[index].gasAmount * newValue;
    setGasEntries(newEntries);
    updateTotals(newEntries);
  };

  const handleGasChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    if (isNaN(newValue) || newValue < 0) return;

    const newEntries = [...gasEntries];
    newEntries[index].gasAmount = newValue;
    newEntries[index].amount = newValue * newEntries[index].price;
    setGasEntries(newEntries);
    updateTotals(newEntries);
  };

  const updateTotals = (entries) => {
    const gasTotal = entries.reduce((sum, entry) => sum + entry.gasAmount, 0);
    const amountTotal = entries.reduce((sum, entry) => sum + entry.amount, 0);
    setTotalGas(gasTotal);
    setTotalAmount(amountTotal);
  };

  const handleSave = () => {
    onSave({
      totalGas,
      totalAmount,
      details: gasEntries.map((entry) => ({
        partnerId: entry.partnerId,
        gasAmount: entry.gasAmount,
        price: entry.price,
        initialBalance: entry.initialBalance,
      })),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Шартномаларга газни тақсимлаш</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            Маълумотлар юкланмоқда...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">№</th>
                    <th className="px-4 py-2 text-left">Ташкилот номи</th>
                    <th className="px-4 py-2 text-left">Қарздорлиги</th>
                    <th className="px-4 py-2 text-left">Нарх (1 м³)</th>
                    <th className="px-4 py-2 text-left">Сотилган газ (м³)</th>
                    <th className="px-4 py-2 text-left">Суммаси</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gasEntries.map((entry, index) => (
                    <tr key={entry.partnerId}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{entry.partnerName}</td>
                      <td className="px-4 py-2">
                        <div
                          className={`p-2 rounded ${
                            entry.initialBalance > 0 ? "bg-red-100" : ""
                          }`}
                        >
                          {entry.initialBalance.toLocaleString("ru-RU")}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={entry.price}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          min="0"
                          step="100"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={entry.gasAmount}
                          onChange={(e) =>
                            handleGasChange(index, e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {entry.amount.toLocaleString("ru-RU")} сум
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium">Умумий газ хажми:</h3>
                <p className="text-xl">{totalGas.toFixed(2)} м³</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium">Умумий суммаси:</h3>
                <p className="text-xl">
                  {totalAmount.toLocaleString("ru-RU")} сўм
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Бекор
          </Button>
          <Button onClick={handleSave}>Сақлаш</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
