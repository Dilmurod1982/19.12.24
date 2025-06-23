import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import {
  getSingleUser,
  updateUser,
  refreshToken,
  getStations,
  assignStation,
  unassignStation,
} from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { BASE_URL } from "../my-utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";

function UserProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [stations, setStations] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [isEditingStations, setIsEditingStations] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    fetchUserData();
    fetchStations();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const data = await getSingleUser(id, user?.access_token);
      setUserData(data);
      // Получаем станции, где текущий пользователь есть в operators
      const userStations = stations.filter((station) =>
        station.operators?.includes(id.toString())
      );
      setSelectedStations(userStations.map((station) => station.id));
    } catch (error) {
      if (error.message === "403") {
        const { access_token } = await refreshToken(user?.refreshToken);
        setUser({ ...user, access_token });
        const data = await getSingleUser(id, access_token);
        setUserData(data);
        const userStations = stations.filter((station) =>
          station.operators?.includes(id.toString())
        );
        setSelectedStations(userStations.map((station) => station.id));
      }
    }
  };

  const fetchStations = () => {
    setLoadingStations(true);
    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
        // После загрузки станций обновляем выбранные станции пользователя
        if (userData) {
          const userStations = data.filter((station) =>
            station.operators?.includes(id.toString())
          );
          setSelectedStations(userStations.map((station) => station.id));
        }
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getStations(access_token);
            })
            .then(({ data }) => {
              setStations(data);
              if (userData) {
                const userStations = data.filter((station) =>
                  station.operators?.includes(id.toString())
                );
                setSelectedStations(userStations.map((station) => station.id));
              }
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      })
      .finally(() => setLoadingStations(false));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Пробуем разные форматы даты
      const formats = ["dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
      let parsedDate;

      for (const fmt of formats) {
        parsedDate = parse(dateString, fmt, new Date());
        if (isValid(parsedDate)) break;
      }

      return isValid(parsedDate)
        ? format(parsedDate, "dd-MM-yyyy")
        : dateString;
    } catch {
      return dateString;
    }
  };

  const parseDateInput = (dateString) => {
    if (!dateString) return null;

    const formats = ["dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
    for (const fmt of formats) {
      const parsedDate = parse(dateString, fmt, new Date());
      if (isValid(parsedDate)) return parsedDate;
    }
    return null;
  };

  const handleEdit = (field) => {
    setEditingField(field);
    if (field === "startDate" || field === "endDate") {
      const dateValue = parseDateInput(userData[field]);
      setEditValue(isValid(dateValue) ? dateValue : null);
    } else {
      setEditValue(userData[field]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let valueToSave = editValue;

      if (editingField === "startDate" || editingField === "endDate") {
        valueToSave = editValue ? format(editValue, "dd-MM-yyyy") : "";
      }

      const updatedUser = await updateUser(
        id,
        { [editingField]: valueToSave },
        user?.access_token
      );
      setUserData(updatedUser);
      setEditingField(null);
    } catch (error) {
      // ... (обработка ошибок)
    } finally {
      setLoading(false);
    }
  };

  const handleStationToggle = async (stationId, isAssigned) => {
    setLoading(true);
    try {
      const station = stations.find((s) => s.id === stationId);
      const updatedOperators = isAssigned
        ? station.operators?.filter((opId) => opId !== id.toString()) || []
        : [...(station.operators || []), id.toString()];

      if (isAssigned) {
        await unassignStation(
          stationId,
          id,
          user?.access_token,
          updatedOperators
        );
      } else {
        await assignStation(
          stationId,
          id,
          user?.access_token,
          updatedOperators
        );
      }

      await fetchStations();
      await fetchUserData();
    } catch (error) {
      if (error.message === "403") {
        const { access_token } = await refreshToken(user?.refreshToken);
        setUser({ ...user, access_token });
        await handleStationToggle(stationId, isAssigned); // Повторяем с новым токеном
      }
    } finally {
      setLoading(false);
    }
  };

  const saveStationsChanges = async () => {
    setLoading(true);
    try {
      // Получаем текущие станции пользователя
      const currentUserStations = stations
        .filter((station) => station.operators?.includes(id.toString()))
        .map((station) => station.id);

      // Станции для добавления
      const toAdd = selectedStations.filter(
        (stationId) => !currentUserStations.includes(stationId)
      );

      // Станции для удаления
      const toRemove = currentUserStations.filter(
        (stationId) => !selectedStations.includes(stationId)
      );

      // Сначала удаляем станции
      for (const stationId of toRemove) {
        const station = stations.find((s) => s.id === stationId);
        const updatedOperators =
          station.operators?.filter((opId) => opId !== id.toString()) || [];

        await fetch(`${BASE_URL}/stations/${stationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: JSON.stringify({ operators: updatedOperators }),
        });
        await new Promise((resolve) => setTimeout(resolve, 300)); // Задержка между запросами
      }

      // Затем добавляем новые станции
      for (const stationId of toAdd) {
        const station = stations.find((s) => s.id === stationId);
        const updatedOperators = [...(station.operators || []), id.toString()];

        await fetch(`${BASE_URL}/stations/${stationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: JSON.stringify({ operators: updatedOperators }),
        });
        await new Promise((resolve) => setTimeout(resolve, 300)); // Задержка между запросами
      }

      // Обновляем данные
      await fetchStations();
      setIsEditingStations(false);
    } catch (error) {
      if (error.message === "403") {
        const { access_token } = await refreshToken(user?.refreshToken);
        setUser({ ...user, access_token });
        await saveStationsChanges(); // Повторяем с новым токеном
      } else if (error.message.includes("429")) {
        alert(
          "Слишком много запросов. Пожалуйста, подождите и попробуйте снова."
        );
      } else {
        console.error("Ошибка при сохранении станций:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = (stationId) => {
    setSelectedStations((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
    );
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Фойдаланувчи профили</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Асосий маълумот</h2>
        <table className="w-full">
          <tbody>
            {Object.entries({
              surname: "Исми",
              fname: "Отасининг исми",
              lastname: "Фамилияси",
              phone: "Телефони",
              pseries: "Паспорт серияси",
              pnumber: "Паспорт рақами",
              pini: "ЖШШИР",
              startDate: "Иш бошлаган сана",
              endDate: "Иш тугатиш санаси",
            }).map(([field, label]) => (
              <tr key={field} className="border-b w-[600px]">
                <td className="py-3 font-medium w-[300px]">{label}</td>
                <td className="py-3 ">
                  {editingField === field ? (
                    field === "startDate" || field === "endDate" ? (
                      <DatePicker
                        selected={editValue}
                        onChange={(date) => setEditValue(date)}
                        onChangeRaw={(e) => e.preventDefault()}
                        dateFormat="dd-MM-yyyy"
                        className="border rounded px-2 py-1 w-full"
                        showYearDropdown
                        dropdownMode="select"
                        isClearable
                        placeholderText="Сана танланг"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    )
                  ) : (
                    formatDate(userData[field]) || "-"
                  )}
                </td>
                <td className="py-3 text-right space-x-2 w-[250px]">
                  {editingField === field ? (
                    <>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? <PulseLoader size={8} /> : "Сақлаш"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Бекор
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit(field)}>Тахрирлаш</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Бириктирилган шахобчалар</h2>
          {!isEditingStations ? (
            <Button onClick={() => setIsEditingStations(true)}>
              Тахрирлаш
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={saveStationsChanges} disabled={loading}>
                {loading ? <PulseLoader size={8} /> : "Сақлаш"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingStations(false)}
              >
                Бекор қилиш
              </Button>
            </div>
          )}
        </div>

        {loadingStations ? (
          <div className="flex justify-center">
            <PulseLoader size={8} />
          </div>
        ) : stations.length === 0 ? (
          <p>шахобчалар йўқ</p>
        ) : isEditingStations ? (
          <div className="space-y-3 max-h-96 overflow-y-auto p-2 border rounded">
            {stations.map((station) => (
              <div
                key={station.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  id={`station-${station.id}`}
                  checked={selectedStations.includes(station.id)}
                  onChange={() => handleStationSelect(station.id)}
                  className="mr-3 h-5 w-5 text-blue-600 rounded"
                />
                <label
                  htmlFor={`station-${station.id}`}
                  className="text-gray-700 select-none cursor-pointer"
                >
                  {station.moljal}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Шахобча номи</th>
                <th className="text-left py-3">Холати</th>
              </tr>
            </thead>
            <tbody>
              {stations
                .filter((station) => station.operators?.includes(id.toString()))
                .map((station) => (
                  <tr key={station.id} className="border-b">
                    <td className="py-3">{station.moljal}</td>
                    <td className="py-3">Бириктирилган</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6">
        <Link to="/users">
          <Button variant="outline">
            Орқага. Фойдаланувчилар рўйхатига қайтиш
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
