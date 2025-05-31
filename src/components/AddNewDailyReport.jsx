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
import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  registerDailyReport,
  fetchDataWithTokenRefresh,
  getDocs,
  refreshToken,
  getKolonka,
  createPartnerDailyReport,
  getPartnerDailyReports,
  getDailyReports,
} from "../request";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TransferGasModal from "./TransferGasModal";

export default function AddNewDailyReport({
  setSendingData,
  sendingData,
  dailyreports,
}) {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const [countersModalOpen, setCountersModalOpen] = useState(false);
  const [kolonkaData, setKolonkaData] = useState(null);
  const [counterReadings, setCounterReadings] = useState([]);
  const [previousReadings, setPreviousReadings] = useState({});
  const [hasPreviousReport, setHasPreviousReport] = useState(false);
  const [previousCounterReadings, setPreviousCounterReadings] = useState([]);
  const [invalidReadings, setInvalidReadings] = useState({});

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferData, setTransferData] = useState({
    totalGas: 0,
    totalAmount: 0,
    details: [],
  });

  const [nextAllowedDate, setNextAllowedDate] = useState("");
  const [isDateEditable, setIsDateEditable] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    date: "",
    price: "",
    pilot: "",
    kolonka: "",
    transfer: "",
    terminal: "",
  });

  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const setDailyreports = useAppStore((state) => state.setDailyreports);

  // Проверяем, есть ли отрицательные разницы
  const hasNegativeDifferences = useMemo(() => {
    return counterReadings.some((reading, index) => {
      const prev = parseFloat(previousCounterReadings[index]) || 0;
      const curr = parseFloat(reading) || 0;
      return curr < prev;
    });
  }, [counterReadings, previousCounterReadings]);

  // Проверяем, все ли показания заполнены
  const allReadingsFilled = useMemo(() => {
    return counterReadings.every((reading) => reading !== "");
  }, [counterReadings]);

  // Обновляем состояние ошибок при изменении показаний
  useEffect(() => {
    const newInvalidReadings = {};
    counterReadings.forEach((reading, index) => {
      const prev = parseFloat(previousCounterReadings[index]) || 0;
      const curr = parseFloat(reading) || 0;
      if (curr < prev) {
        newInvalidReadings[index] = true;
      }
    });
    setInvalidReadings(newInvalidReadings);
  }, [counterReadings, previousCounterReadings]);

  const filteredStations = useMemo(() => {
    if (!Array.isArray(stations)) return []; // Добавлена недостающая скобка
    return stations.filter((station) =>
      station.operators?.includes(user?.id?.toString())
    );
  }, [stations, user?.id]);

  // Определяем следующую доступную дату при открытии модального окна
  useEffect(() => {
    if (addItemModal && filteredStations?.length > 0) {
      const stationId = filteredStations[0]?.id;
      setDataLoading(true);

      // Находим отчеты для текущей станции
      const stationReports = dailyreports
        .filter((report) => report?.station_id === stationId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (stationReports.length === 0) {
        const todayStr = today.toISOString().split("T")[0];
        setNextAllowedDate(todayStr);
        setIsDateEditable(true);
        setFormValues((prev) => ({ ...prev, date: todayStr }));
        setDataLoading(false);
        return;
      }

      // Правильный парсинг даты с учетом временной зоны
      const lastReportDateStr = stationReports[0].date;
      const [year, month, day] = lastReportDateStr.split("-").map(Number);
      const lastReportDate = new Date(year, month - 1, day);

      // Добавляем 1 день
      const nextDate = new Date(lastReportDate);
      nextDate.setDate(nextDate.getDate() + 1);

      // Форматируем дату в YYYY-MM-DD
      const nextDateStr = [
        nextDate.getFullYear(),
        String(nextDate.getMonth() + 1).padStart(2, "0"),
        String(nextDate.getDate()).padStart(2, "0"),
      ].join("-");

      setNextAllowedDate(nextDateStr);
      setIsDateEditable(false);
      setFormValues((prev) => ({ ...prev, date: nextDateStr }));

      if (nextDate > today) {
        toast.info(`Следующая доступная дата: ${nextDateStr}`);
      }

      setDataLoading(false);
    }
  }, [addItemModal, filteredStations, dailyreports]);

  // Загружаем данные станций
  useEffect(() => {
    if (!user?.access_token) return;

    setDataLoading(true);
    fetchDataWithTokenRefresh(
      () => getDocs(user.access_token, "stations"),
      setStations,
      user,
      setUser,
      navigate,
      toast
    ).finally(() => setDataLoading(false));
  }, [user, setStations, setUser, navigate]);

  // Загружаем данные колонок
  useEffect(() => {
    if (filteredStations?.length > 0 && user?.access_token) {
      const stationId = filteredStations[0]?.id;
      setDataLoading(true);

      fetchDataWithTokenRefresh(
        () => getKolonka(user.access_token),
        (data) => {
          const stationKolonka = data.find(
            (item) => item.station_id === stationId
          );
          setKolonkaData(stationKolonka);

          // Находим последний отчет для этой станции
          const stationReports = dailyreports
            .filter((report) => report?.station_id === stationId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          const hasReport = stationReports.length > 0;
          setHasPreviousReport(hasReport);

          // Инициализируем показания счетчиков
          const numCounters = stationKolonka?.numColumns
            ? parseInt(stationKolonka.numColumns) * 2
            : 0;

          const initialCurrentReadings = Array(numCounters).fill("");
          const initialPreviousReadings = Array(numCounters).fill("");

          if (hasReport) {
            for (let i = 0; i < numCounters; i++) {
              const shlangKey = `shlang${i + 1}`;
              initialPreviousReadings[i] =
                stationReports[0][shlangKey]?.toString() || "";
            }
          }

          setCounterReadings(initialCurrentReadings);
          setPreviousCounterReadings(initialPreviousReadings);
        },
        (error) => {
          console.error("Ошибка загрузки колонок:", error);
          toast.error("Не удалось загрузить данные колонок");
        },
        user,
        setUser,
        navigate,
        toast
      ).finally(() => setDataLoading(false));
    }
  }, [filteredStations, dailyreports, user, setUser, navigate]);

  const handleOpenCountersModal = () => {
    setCountersModalOpen(true);
  };

  const handleCounterChange = (index, value) => {
    const newReadings = [...counterReadings];
    newReadings[index] = value;
    setCounterReadings(newReadings);
  };

  const calculateTotalDifference = () => {
    return counterReadings.reduce((total, current, index) => {
      const prev = parseFloat(previousCounterReadings[index]) || 0;
      const curr = parseFloat(current) || 0;
      return total + (curr - prev);
    }, 0);
  };

  const handleSaveCounters = () => {
    const totalDifference = calculateTotalDifference();
    setFormValues((prev) => ({
      ...prev,
      kolonka: totalDifference.toString(),
    }));
    setCountersModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = () => {
    setCalculating(true);

    const { price, pilot, kolonka, terminal } = formValues;
    const { totalAmount } = transferData; // Используем данные из transferData

    const difference = parseFloat(pilot) - parseFloat(kolonka);
    const losscoef = (difference / (parseFloat(pilot) / 100)).toFixed(2);
    const cashSales =
      parseFloat(kolonka) * parseFloat(price) -
      parseFloat(totalAmount) -
      parseFloat(terminal);

    setCalculationResults({
      difference,
      losscoef,
      cashSales,
    });

    setCalculating(false);
  };

  const resetForm = () => {
    setFormValues({
      date: nextAllowedDate,
      price: "",
      pilot: "",
      kolonka: "",
      transfer: "",
      terminal: "",
    });
    setCalculationResults(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setAddItemModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDateEditable && formValues.date !== nextAllowedDate) {
      toast.error(`Можно создать отчет только на дату: ${nextAllowedDate}`);
      return;
    }

    try {
      setLoading(true);

      // 1. Сначала получаем предыдущие отчеты партнеров
      let previousReports = [];
      try {
        previousReports = await getPartnerDailyReports(user.access_token);
      } catch (error) {
        // Если ошибка авторизации, пробуем обновить токен
        if (error.message === "403") {
          const { access_token } = await refreshToken(user.refresh_token);
          setUser({ ...user, access_token });
          previousReports = await getPartnerDailyReports(access_token);
        } else {
          throw error;
        }
      }

      // 2. Формируем данные для основного отчета
      const dailyReportData = {
        date: formValues.date,
        price: formValues.price,
        pilot: formValues.pilot,
        kolonka: formValues.kolonka,
        transfer: transferData.totalGas,
        transfersum: transferData.totalAmount,
        terminal: formValues.terminal,
        station_id: filteredStations[0]?.id,
        ...counterReadings.reduce((acc, reading, index) => {
          acc[`shlang${index + 1}`] = reading;
          return acc;
        }, {}),
      };

      if (calculationResults) {
        dailyReportData.difference = calculationResults.difference;
        dailyReportData.losscoef = calculationResults.losscoef;
        dailyReportData.zreport = calculationResults.cashSales;
      }

      // 3. Сохраняем основной отчет
      const reportResponse = await registerDailyReport(
        user.access_token,
        dailyReportData
      );

      // 4. Сохраняем отчеты по партнерам
      if (transferData.details.length > 0) {
        await Promise.all(
          transferData.details.map(async (entry) => {
            const partnerPreviousReports =
              previousReports
                ?.filter((r) => r.partner_id === entry.partnerId.toString())
                ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

            const lastReport = partnerPreviousReports[0];

            const initialBalance = lastReport
              ? parseFloat(lastReport.final_balance)
              : entry.initialBalance || 0;

            const totalSum = entry.gasAmount * entry.price;
            const payment = 0;
            const finalBalance = initialBalance + totalSum - payment;

            const reportData = {
              date: formValues.date,
              station_id: filteredStations[0]?.id,
              partner_id: entry.partnerId.toString(),
              initial_balace: initialBalance,
              gas: entry.gasAmount,
              price: entry.price,
              total_sum: totalSum,
              payment: payment,
              final_balance: finalBalance,
              user_id: user.id,
              daily_report_id: reportResponse.id,
              create_report: new Date().toISOString(),
            };

            return createPartnerDailyReport(user.access_token, reportData);
          })
        );
      }

      toast.success("Ҳисобот мувафақиятли яратилди!");
      // Загрузка отчетов
      getDailyReports(user?.access_token)
        .then((data) => {
          setDailyreports(data);
        })
        .catch((error) => {
          if (error.message === "403") {
            refreshToken(user?.refreshToken)
              .then(({ access_token }) => {
                setUser({ ...user, access_token });
                return getDailyReports(access_token);
              })
              .then((data) => setDailyreports(data))
              .catch((err) => console.error("Error after refresh:", err));
          }
        });
      resetForm();
      setAddItemModal(false);
    } catch (error) {
      console.error("Ошибка сохранения отчета:", error);
      toast.error(error.message || "Ҳисобот сақлашда ҳатолик!");

      if (error.message === "403") {
        try {
          const { access_token } = await refreshToken(user.refresh_token);
          setUser({ ...user, access_token });
          toast.success("Токен янгиланди. Қайта уриниб кўринг.");
        } catch (refreshError) {
          toast.error("Авторизация хатоси");
          setUser(null);
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // В handleSubmit после сохранения основного отчета:
  const updatePartnerReports = async () => {
    for (const entry of transferData.details) {
      // 1. Получаем текущие данные партнера
      const currentPartner = await getPartnerData(entry.partnerId);

      // 2. Добавляем новый отчет
      const updatedReports = [
        ...(currentPartner.reports || []),
        {
          date: formValues.date,
          gas: entry.gasAmount,
          price: entry.price,
          user_id: user.id,
          create_date: new Date().toISOString(),
        },
      ];

      // 3. Обновляем данные партнера
      await updatePartnerData({
        ...currentPartner,
        reports: updatedReports,
      });
    }
  };

  const handleConfirmSubmit = () => {
    setConfirmationOpen(false);
    setSendingData(formDataToSubmit);
  };

  useEffect(() => {
    if (sendingData) {
      setLoading(true);
      registerDailyReport(user?.access_token, sendingData)
        .then(() => {
          toast.success("Ҳисобот мувафақиятли яратилди!");
          setSendingData(null);
          resetForm();
          setAddItemModal(false);
        })
        .catch(({ message }) => {
          if (message === "403") {
            refreshToken(user?.refresh_token)
              .then(({ access_token }) => {
                setUser({ ...user, access_token });
                return registerDailyReport(access_token, sendingData);
              })
              .then(() => {
                toast.success("Ҳисобот мувафақиятли яратилди!");
                setSendingData(null);
                setAddItemModal(false);
              })
              .catch(() => {
                toast.error("Ошибка авторизации");
                setUser(null);
              });
          } else {
            toast.error(message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sendingData, user, setUser, setSendingData, setAddItemModal]);

  return (
    <div>
      {/* Модальное окно счетчиков */}
      <Dialog open={countersModalOpen} onOpenChange={setCountersModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>Колонкалар ҳисоблагич кўрсаткичи</DialogTitle>
            <DialogDescription>
              {hasPreviousReport
                ? "Жорий кўрсаткичлар олдинги кўрсаткичлар билан солиштирилади"
                : "Хар бир шланг ҳисоблагич кўрсаткичини киритинг"}
            </DialogDescription>
          </DialogHeader>

          {kolonkaData ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Шланг №
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Олдингиси
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Жорий
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Фарқи
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({
                      length: parseInt(kolonkaData?.numColumns || 0) * 2,
                    }).map((_, index) => {
                      const prev =
                        parseFloat(previousCounterReadings[index]) || 0;
                      const curr = parseFloat(counterReadings[index]) || 0;
                      const difference = curr - prev;
                      const isInvalid = invalidReadings[index];

                      return (
                        <tr key={`shlang-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasPreviousReport ? (
                              previousCounterReadings[index] || "Нет данных"
                            ) : (
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={previousCounterReadings[index] || ""}
                                onChange={(e) => {
                                  const newReadings = [
                                    ...previousCounterReadings,
                                  ];
                                  newReadings[index] = e.target.value;
                                  setPreviousCounterReadings(newReadings);
                                }}
                                className="w-32"
                                disabled={hasPreviousReport}
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={counterReadings[index] || ""}
                                onChange={(e) =>
                                  handleCounterChange(index, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(
                                      e.key
                                    )
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                className={`w-32 ${
                                  isInvalid ? "border-red-500" : ""
                                }`}
                              />
                              {isInvalid && (
                                <span className="text-xs text-red-500 mt-1">
                                  Жорий кўрсаткич олдинги кўрсаткичга тенг ёки
                                  кўп бўлиши керак
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              isInvalid ? "text-red-500" : ""
                            }`}
                          >
                            {difference.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-4">
                <div className="text-lg font-semibold">
                  Жами: {calculateTotalDifference()}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCountersModalOpen(false)}
                  >
                    Бекор
                  </Button>
                  <Button
                    onClick={handleSaveCounters}
                    disabled={!allReadingsFilled || hasNegativeDifferences}
                  >
                    Сақлаш
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-500">
                Колонкалар кўрсаткичи ҳақида маълумот йўқ
              </p>
              <p>
                Илтимос, бошлиғингиз колонкалар ҳақида маълумотни базага
                киритсин
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Основное модальное окно */}
      <Dialog open={addItemModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pt-2 pb-4">
            <DialogTitle className="text-xl font-bold">
              Янги ҳисобот{" "}
              {filteredStations?.length > 0
                ? filteredStations[0].moljal
                : "шахобча йўқ"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {dataLoading
                ? "Маълумотлар юкланмоқда..."
                : isDateEditable
                ? "Ҳисобот санасини тангланг"
                : `Кейинги ҳисобот санаси: ${nextAllowedDate}`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="date" className="text-sm">
                  Ҳисобот санаси:
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  className="h-9 text-sm"
                  required
                  value={formValues.date}
                  onChange={handleInputChange}
                  disabled={!isDateEditable || dataLoading}
                  min={isDateEditable ? undefined : nextAllowedDate}
                  max={isDateEditable ? undefined : nextAllowedDate}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="price" className="text-sm">
                  Нарх
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="price"
                  name="price"
                  className="h-9 text-sm !appearance-none ![-moz-appearance:textfield]"
                  required
                  value={formValues.price}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      // Проверка на цифры
                      handleInputChange(e);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="pilot" className="text-sm">
                  Автопилот кўрсаткичи
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="pilot"
                  name="pilot"
                  className="h-9 text-sm"
                  required
                  value={formValues.pilot}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      // Проверка на цифры
                      handleInputChange(e);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="terminal" className="text-sm">
                  Терминаллар орқали сотилди
                </Label>
                <Input
                  type="text"
                  inputMode="numeric" // На мобильных откроет цифровую клавиатуру
                  pattern="[0-9]*" // Разрешает только цифры
                  id="terminal"
                  name="terminal"
                  className="h-9 text-sm"
                  required
                  value={formValues.terminal}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      // Проверка на цифры
                      handleInputChange(e);
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="transfer" className="text-sm">
                  Шартномага сотилди
                </Label>
                {filteredStations[0]?.partners?.length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm whitespace-nowrap mx-2 ">
                        {transferData.totalGas.toLocaleString("ru-RU")} м3
                      </span>

                      <span className="text-sm whitespace-nowrap mx-2 ">
                        {transferData.totalAmount.toLocaleString("ru-RU")} сўм
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center items-center mt-2">
                      <Button
                        type="button"
                        onClick={() => setTransferModalOpen(true)}
                        className="h-9"
                      >
                        Шартномалар рўйхати
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    "{filteredStations[0]?.moljal}" шахобчанинг шартномалари
                    мавжуд эмас
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="kolonka" className="text-sm">
                  Ҳисоблагич фарқи
                </Label>
                <div className="flex flex-col gap-2">
                  <span className="text-sm whitespace-nowrap mx-2 ">
                    {formValues.kolonka.toLocaleString("ru-RU")} м3
                  </span>
                  {/* <Input
                    type="number"
                    id="kolonka"
                    name="kolonka"
                    className="h-9 text-sm flex-1"
                    required
                    value={formValues.kolonka}
                    readOnly
                  /> */}
                  <Button
                    type="button"
                    onClick={handleOpenCountersModal}
                    className="h-9"
                  >
                    Кўрсаткичлар киритиш
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCalculate}
              disabled={
                !formValues.price ||
                !formValues.pilot ||
                !formValues.kolonka ||
                !formValues.terminal ||
                (filteredStations[0]?.partners?.length > 0 &&
                  transferData.totalAmount === undefined) // Изменено здесь
              }
              className="h-9 text-sm"
            >
              {calculating ? (
                <ClipLoader color="#ffffff" size={15} />
              ) : (
                "Қайта ҳисоб-китоб"
              )}
            </Button>

            {calculationResults && (
              <div className="space-y-2 p-3 border rounded-lg text-sm">
                <div className="flex justify-between">
                  <span>Фарқи:</span>
                  <span className="font-medium">
                    {calculationResults.difference.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Йўқотиш коэффициенти:</span>
                  <span className="font-medium">
                    {calculationResults.losscoef}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Z-отчет (Нақд):</span>
                  <span className="font-medium">
                    {calculationResults.cashSales.toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3 sticky bottom-0 bg-white pt-3 pb-1">
              <Button
                variant="outline"
                className="h-9 flex-1"
                onClick={handleCloseModal}
                type="button"
              >
                Бекор
              </Button>
              <Button
                className="h-9 flex-1"
                disabled={loading || !calculationResults}
                type="submit"
              >
                {loading ? <ClipLoader color="#ffffff" size={15} /> : "Сақлаш"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Подтверждение */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Тасдиқлаш</DialogTitle>
            <DialogDescription>
              Сиз {formValues.date} кунги ҳисоботни тасдиқлайсизми?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmationOpen(false)}
            >
              Бекор
            </Button>
            <Button onClick={handleConfirmSubmit}>Тасдиқлаш</Button>
          </div>
        </DialogContent>
      </Dialog>

      <TransferGasModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        onSave={setTransferData}
        stationId={filteredStations[0]?.id}
      />
    </div>
  );
}
