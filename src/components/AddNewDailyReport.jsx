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
import { useEffect, useMemo, useState, useRef } from "react";
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
  getPartners,
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
  const [partners, setPartners] = useState([]);

  const [countersModalOpen, setCountersModalOpen] = useState(false);
  const [counterReadings, setCounterReadings] = useState(Array(10).fill(""));
  const [previousReadings, setPreviousReadings] = useState({});
  const [hasPreviousReport, setHasPreviousReport] = useState(false);
  const [previousCounterReadings, setPreviousCounterReadings] = useState(
    Array(10).fill("")
  );
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

  const resultsRef = useRef(null);

  useEffect(() => {
    if (!user?.access_token) return;

    const loadData = async () => {
      try {
        const [stationsData, partnersData] = await Promise.all([
          getDocs(user.access_token, "stations"),
          getPartners(user.access_token),
        ]);
        setStations(stationsData);
        setPartners(partnersData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadData();
  }, [user]);

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
    if (!Array.isArray(stations)) return [];
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

  // Загружаем предыдущие показания счетчиков
  useEffect(() => {
    if (filteredStations?.length > 0 && user?.access_token) {
      const stationId = filteredStations[0]?.id;
      setDataLoading(true);

      // Находим последний отчет для этой станции
      const stationReports = dailyreports
        .filter((report) => report?.station_id === stationId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const hasReport = stationReports.length > 0;
      setHasPreviousReport(hasReport);

      if (hasReport) {
        const newPreviousReadings = Array(10).fill("");
        for (let i = 0; i < 10; i++) {
          const shlangKey = `shlang${i + 1}`;
          newPreviousReadings[i] =
            stationReports[0][shlangKey]?.toString() || "";
        }
        setPreviousCounterReadings(newPreviousReadings);
      }

      setDataLoading(false);
    }
  }, [filteredStations, dailyreports]);

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
    const { totalAmount } = transferData;

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

    // Прокрутка к результатам после расчета
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
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

    // Подготовка данных для подтверждения
    const dailyReportData = {
      date: formValues.date,
      price: formValues.price,
      pilot: formValues.pilot,
      kolonka: formValues.kolonka,
      transfer: transferData.totalGas,
      transfersum: transferData.totalAmount,
      terminal: formValues.terminal,
      station_id: filteredStations[0]?.id,
      shlang1: counterReadings[0] || "0",
      shlang2: counterReadings[1] || "0",
      shlang3: counterReadings[2] || "0",
      shlang4: counterReadings[3] || "0",
      shlang5: counterReadings[4] || "0",
      shlang6: counterReadings[5] || "0",
      shlang7: counterReadings[6] || "0",
      shlang8: counterReadings[7] || "0",
      shlang9: counterReadings[8] || "0",
      shlang10: counterReadings[9] || "0",
    };

    if (calculationResults) {
      dailyReportData.difference = calculationResults.difference;
      dailyReportData.losscoef = calculationResults.losscoef;
      dailyReportData.zreport = calculationResults.cashSales;
    }

    setFormDataToSubmit(dailyReportData);
    setConfirmationOpen(true);
  };

  const checkServerAvailability = async () => {
    try {
      const response = await fetch(`${BASE_URL}/kolonkamarka`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const validateFormData = (data) => {
    const requiredFields = ["date", "price", "pilot", "kolonka", "terminal"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Не заполнены обязательные поля: ${missingFields.join(", ")}`
      );
    }

    if (isNaN(parseFloat(data.price))) {
      throw new Error("Некорректное значение цены");
    }

    // Дополнительные проверки...
  };

  // const handleConfirmSubmit = async () => {
  //   if (!formDataToSubmit) {
  //     toast.error("Нет данных для сохранения");
  //     return;
  //   }

  //   setConfirmationOpen(false);
  //   setLoading(true);

  //   try {
  //     // 1. Сначала сохраняем основной отчет
  //     const reportResponse = await registerDailyReport(
  //       user.access_token,
  //       formDataToSubmit
  //     );

  //     // 2. Получаем предыдущие отчеты партнеров
  //     let previousReports = [];
  //     try {
  //       previousReports = await getPartnerDailyReports(user.access_token);
  //     } catch (error) {
  //       if (error.message === "403") {
  //         const { access_token } = await refreshToken(user.refresh_token);
  //         setUser({ ...user, access_token });
  //         previousReports = await getPartnerDailyReports(access_token);
  //       } else {
  //         throw error;
  //       }
  //     }

  //     // 3. Сохраняем отчеты по партнерам последовательно
  //     if (transferData.details.length > 0) {
  //       for (const entry of transferData.details) {
  //         const partnerPreviousReports =
  //           previousReports
  //             ?.filter((r) => r.partner_id === entry.partnerId.toString())
  //             ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  //         const lastReport = partnerPreviousReports[0];

  //         const initialBalance = lastReport
  //           ? parseFloat(lastReport.final_balance)
  //           : entry.initialBalance || 0;

  //         const totalSum = entry.gasAmount * entry.price;
  //         const payment = [];
  //         const finalBalance = initialBalance + totalSum - payment;

  //         const reportData = {
  //           date: formValues.date,
  //           station_id: filteredStations[0]?.id,
  //           partner_id: entry.partnerId,
  //           initial_balace: initialBalance,
  //           gas: entry.gasAmount,
  //           price: entry.price,
  //           total_sum: totalSum,
  //           payment: payment,
  //           final_balance: finalBalance,
  //           user_id: user.id,
  //           daily_report_id: reportResponse.id, // Используем ID основного отчета
  //           create_report: new Date().toISOString(),
  //         };

  //         await createPartnerDailyReport(user.access_token, reportData);
  //       }
  //     }

  //     toast.success("Ҳисобот мувафақиятли яратилди!");
  //     // Обновляем список отчетов
  //     const updatedReports = await getDailyReports(user.access_token);
  //     setDailyreports(updatedReports);

  //     resetForm();
  //     setAddItemModal(false);
  //   } catch (error) {
  //     console.error("Ошибка сохранения отчета:", error);
  //     toast.error(error.message || "Ҳисобот сақлашда ҳатолик!");

  //     if (error.message === "403") {
  //       try {
  //         const { access_token } = await refreshToken(user.refresh_token);
  //         setUser({ ...user, access_token });
  //         toast.success("Токен янгиланди. Қайта уриниб кўринг.");
  //       } catch (refreshError) {
  //         toast.error("Авторизация хатоси");
  //         setUser(null);
  //         navigate("/login");
  //       }
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) {
      toast.error("Нет данных для сохранения");
      return;
    }

    setConfirmationOpen(false);
    setLoading(true);

    try {
      // 1. Проверка соединения
      if (!navigator.onLine) {
        throw new Error("Нет подключения к интернету");
      }

      // 2. Получаем предыдущие отчеты партнеров
      let previousReports = [];
      try {
        previousReports = await getPartnerDailyReports(user.access_token);
      } catch (error) {
        if (error.message === "403") {
          const { access_token } = await refreshToken(user.refresh_token);
          setUser({ ...user, access_token });
          previousReports = await getPartnerDailyReports(access_token);
        } else {
          throw error;
        }
      }

      // 3. Локальная валидация
      validateFormData(formDataToSubmit);

      // 4. Если нет данных о передаче газа, создаем нулевые записи для всех партнеров
      const defaultPrice = 5200;
      const partnerDetails =
        transferData.details.length > 0
          ? transferData.details
          : filteredStations[0]?.partners?.map((partnerId) => {
              const partner = partners.find(
                (p) => p.id.toString() === partnerId.toString()
              );
              const partnerReports =
                previousReports?.filter(
                  (r) =>
                    r.partner_id.toString() === partnerId.toString() &&
                    r.station_id.toString() ===
                      filteredStations[0]?.id.toString()
                ) || [];
              const lastReport = partnerReports[0];

              return {
                partnerId: Number(partnerId),
                gasAmount: 0,
                price: defaultPrice,
                initialBalance: lastReport?.final_balance || 0,
              };
            }) || [];

      // 5. Сохраняем основной отчет
      const reportResponse = await registerDailyReport(
        user.access_token,
        formDataToSubmit
      );

      // 6. Сохраняем отчеты партнеров
      const failedPartnerReports = [];

      for (const [index, entry] of partnerDetails.entries()) {
        try {
          const reportData = {
            date: formValues.date,
            station_id: filteredStations[0]?.id,
            partner_id: entry.partnerId,
            initial_balace: entry.initialBalance,
            gas: entry.gasAmount,
            price: entry.price,
            total_sum: entry.gasAmount * entry.price,
            payment: 0,
            final_balance: entry.initialBalance + entry.gasAmount * entry.price,
            user_id: user.id,
            daily_report_id: reportResponse.id,
            create_report: new Date().toISOString(),
          };
          await createPartnerDailyReport(user.access_token, reportData);
        } catch (error) {
          console.error(
            `Ошибка сохранения отчета партнера ${entry.partnerId}:`,
            error
          );
          failedPartnerReports.push(entry);
        }
      }

      if (failedPartnerReports.length > 0) {
        throw new Error(
          `Не удалось сохранить ${failedPartnerReports.length} отчетов партнеров`
        );
      }

      // ОЧИСТКА ФОРМЫ ПОСЛЕ УСПЕШНОГО СОХРАНЕНИЯ
      resetForm();
      setCounterReadings(Array(10).fill(""));
      setTransferData({
        totalGas: 0,
        totalAmount: 0,
        details: [],
      });

      setAddItemModal(false);
      setConfirmationOpen(false);
      toast.success("Отчет успешно создан!");

      // Обновляем список отчетов
      const updatedReports = await getDailyReports(user.access_token);
      setDailyreports(updatedReports);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      toast.error(error.message || "Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, index) => {
              const prev = parseFloat(previousCounterReadings[index]) || 0;
              const curr = parseFloat(counterReadings[index]) || 0;
              const difference = curr - prev;
              const isInvalid = invalidReadings[index];

              return (
                <div key={`shlang-${index}`} className="space-y-2">
                  <Label htmlFor={`shlang-${index}`}>Шланг №{index + 1}</Label>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Олдингиси</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={previousCounterReadings[index] || ""}
                        onChange={(e) => {
                          const newReadings = [...previousCounterReadings];
                          newReadings[index] = e.target.value;
                          setPreviousCounterReadings(newReadings);
                        }}
                        className="w-full"
                        disabled={hasPreviousReport || loading}
                      />
                    </div>

                    <div className="flex-1">
                      <Label className="text-xs">Жорий</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={counterReadings[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, "."); // Заменяем запятые на точки
                          if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                            handleCounterChange(index, value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]|,|\.|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(
                              e.key
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full ${
                          isInvalid ? "border-red-500" : ""
                        }`}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div
                    className={`text-sm ${
                      isInvalid ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    Фарқи: {difference.toFixed(2)}
                  </div>

                  {isInvalid && (
                    <span className="text-xs text-red-500">
                      Жорий кўрсаткич олдинги кўрсаткичга тенг ёки кўп бўлиши
                      керак
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-4">
            <div className="text-lg font-semibold">
              Жами: {calculateTotalDifference()}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setCountersModalOpen(false)}
                disabled={loading}
              >
                Бекор
              </Button>
              <Button
                onClick={handleSaveCounters}
                disabled={
                  !allReadingsFilled || hasNegativeDifferences || loading
                }
              >
                Сақлаш
              </Button>
            </div>
          </div>
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
                  disabled={!isDateEditable || dataLoading || loading}
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
                  inputMode="decimal"
                  id="price"
                  name="price"
                  className="h-9 text-sm !appearance-none ![-moz-appearance:textfield]"
                  required
                  value={formValues.price}
                  onChange={(e) => {
                    if (/^\d*[,.]?\d{0,2}$/.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="pilot" className="text-sm">
                  Автопилот кўрсаткичи
                </Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  id="pilot"
                  name="pilot"
                  className="h-9 text-sm"
                  required
                  value={formValues.pilot}
                  onChange={(e) => {
                    // Разрешаем цифры, точку или запятую с максимум 2 знаками после запятой
                    const value = e.target.value.replace(/,/g, "."); // Заменяем запятые на точки

                    // Проверяем формат: цифры, необязательная точка и до 2 цифр после
                    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                      // Создаем искусственное событие с обновленным значением
                      const newEvent = {
                        ...e,
                        target: {
                          ...e.target,
                          name: "pilot",
                          value: value,
                        },
                      };
                      handleInputChange(newEvent);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Разрешаем: цифры, точку, запятую, Backspace, Delete, стрелки, Tab
                    if (
                      !/[0-9.,]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(
                        e.key
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="terminal" className="text-sm">
                  Терминаллар орқали сотилди
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="terminal"
                  name="terminal"
                  className="h-9 text-sm"
                  required
                  value={formValues.terminal}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  disabled={loading}
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
                        disabled={loading}
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
                  <Button
                    type="button"
                    onClick={handleOpenCountersModal}
                    className="h-9"
                    disabled={loading}
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
                  transferData.totalAmount === undefined) ||
                loading
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
              <div
                ref={resultsRef}
                className="space-y-2 p-3 border rounded-lg text-sm"
              >
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
                disabled={loading}
              >
                Бекор қилиш
              </Button>
              <Button
                className="h-9 flex-1"
                disabled={loading || !calculationResults}
                type="submit"
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={15} />
                ) : (
                  "Хисоботни сақлаш "
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Подтверждение */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ТАСДИҚЛАШ</DialogTitle>
            <DialogDescription>
              <span className="pt-5 text-red-700">
                Сиз {formValues.date} кунги ҳисоботни тақдиқлайсизми?
              </span>

              <div>
                <h1 className="text-black">
                  Нарх:{" "}
                  {formValues.price
                    ? Number(formValues.price).toLocaleString("ru-RU")
                    : "0"}{" "}
                  сўм
                </h1>
                <h1 className="text-black">
                  Пилот:{" "}
                  {Number(formValues.pilot).toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  м3
                </h1>
                <h1 className="text-black">
                  Колонка:{" "}
                  {Number(formValues.kolonka).toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  м3
                </h1>
                <h1 className="text-black">
                  Шартнома (газ ҳажм):{" "}
                  {transferData?.totalGas
                    ? Number(transferData.totalGas).toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0"}{" "}
                  м3
                </h1>
                <h1 className="text-black">
                  Шартнома (газ суммаси):{" "}
                  {transferData?.totalAmount
                    ? Number(transferData.totalAmount).toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0"}{" "}
                  сўм
                </h1>
                <h1 className="text-black">
                  Терминал:{" "}
                  {Number(formValues.terminal).toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  сўм
                </h1>
                <h1 className="text-black">
                  Z-отчет:{" "}
                  {calculationResults?.cashSales
                    ? calculationResults.cashSales.toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0"}{" "}
                  сўм
                </h1>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmationOpen(false)}
              disabled={loading}
            >
              Бекор
            </Button>
            <button
              onClick={handleConfirmSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={15} />
              ) : (
                "ХА, ТАСДИҚЛАЙМАН!"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <TransferGasModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        onSave={setTransferData}
        stationId={filteredStations[0]?.id}
        disabled={loading}
      />
    </div>
  );
}
