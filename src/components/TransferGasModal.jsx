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
        // Фильтруем отчеты только для текущей станции
        const stationReports =
          reportsResponse?.filter((r) => r.station_id === stationId) || [];
        setPartnerReports(stationReports);

        const initialEntries = stationPartners.map((partner) => {
          // Находим все отчеты для этого партнера на этой станции
          const partnerReports = stationReports
            .filter((r) => r.partner_id.toString() === partner.id.toString()) // Исправлено сравнение ID
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          const lastReport = partnerReports[0];
          const lastPrice = lastReport?.price || 5200;
          const hasPreviousReport = partnerReports.length > 0;

          // console.log({
          //   partnerId: partner.id,
          //   hasReports: hasPreviousReport,
          //   reportsCount: partnerReports.length,
          //   lastReport: lastReport,
          // }); // Добавим подробное логирование

          return {
            partnerId: partner.id,
            partnerName: partner.partner_name,
            price: lastPrice,
            gasAmount: 0,
            amount: 0,
            initialBalance: lastReport?.final_balance || 0,
            canEditInitialBalance: !hasPreviousReport,
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

  const handleInitialBalanceChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    if (isNaN(newValue)) return;

    const newEntries = [...gasEntries];
    newEntries[index].initialBalance = newValue;
    setGasEntries(newEntries);
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
        partnerId: entry.partnerId, // Already a number (no conversion needed)
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
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left w-10">№</th>
                    <th className="px-2 py-2 text-left min-w-[150px]">
                      Ташкилот номи
                    </th>
                    <th className="px-2 py-2 text-center w-[120px]">
                      Қарздорлиги <br />
                      (сўм)
                    </th>
                    <th className="px-2 py-2 text-center w-[110px]">
                      Нарх <br />
                      (1 м³)
                    </th>
                    <th className="px-2 py-2 text-center w-[120px]">
                      Сотилган <br />
                      газ (м³)
                    </th>
                    <th className="px-2 py-2 text-center w-[120px]">Суммаси</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gasEntries.map((entry, index) => (
                    <tr key={entry.partnerId}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{entry.partnerName}</td>
                      <td className="px-4 py-2">
                        {entry.canEditInitialBalance ? (
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={entry.initialBalance}
                            onChange={(e) =>
                              handleInitialBalanceChange(index, e.target.value)
                            }
                            className={`p-2 ${
                              entry.initialBalance > 0 ? "bg-red-100" : ""
                            }`}
                          />
                        ) : (
                          <div
                            className={`p-2 rounded ${
                              entry.initialBalance > 0 ? "bg-red-100" : ""
                            }`}
                          >
                            {entry.initialBalance.toLocaleString("ru-RU")}
                          </div>
                        )}
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
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={entry.gasAmount}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleGasChange(index, e.target.value);
                            }
                          }}
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
