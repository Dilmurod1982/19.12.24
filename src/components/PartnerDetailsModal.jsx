import React, { useState, useEffect } from "react";
import { useAppStore } from "../lib/zustand";
import {
  getStations,
  assignStation,
  unassignStation,
  refreshToken,
} from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { BASE_URL } from "../my-utils";

function PartnerDetailsModal({ partner, onClose }) {
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [isEditingStations, setIsEditingStations] = useState(false);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    if (partner) {
      fetchStations();
    }
  }, [partner]);

  const fetchStations = () => {
    setLoadingStations(true);
    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
        // Получаем станции, где текущий партнер есть в partners
        const partnerStations = data.filter((station) =>
          station.partners?.includes(partner.id.toString())
        );
        setSelectedStations(partnerStations.map((station) => station.id));
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
              const partnerStations = data.filter((station) =>
                station.partners?.includes(partner.id.toString())
              );
              setSelectedStations(partnerStations.map((station) => station.id));
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      })
      .finally(() => setLoadingStations(false));
  };

  const saveStationsChanges = async () => {
    setLoading(true);
    try {
      // Получаем текущие станции партнера
      const currentPartnerStations = stations
        .filter((station) => station.partners?.includes(partner.id.toString()))
        .map((station) => station.id);

      // Станции для добавления
      const toAdd = selectedStations.filter(
        (stationId) => !currentPartnerStations.includes(stationId)
      );

      // Станции для удаления
      const toRemove = currentPartnerStations.filter(
        (stationId) => !selectedStations.includes(stationId)
      );

      // Обновляем все станции
      await Promise.all([
        ...toAdd.map(async (stationId) => {
          const station = stations.find((s) => s.id === stationId);
          const updatedPartners = [
            ...(station.partners || []),
            partner.id.toString(),
          ];
          // Используем PATCH для обновления partners станции
          await fetch(`${BASE_URL}/stations/${stationId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify({ partners: updatedPartners }),
          });
        }),
        ...toRemove.map(async (stationId) => {
          const station = stations.find((s) => s.id === stationId);
          const updatedPartners =
            station.partners?.filter(
              (partnerId) => partnerId !== partner.id.toString()
            ) || [];
          // Используем PATCH для обновления partners станции
          await fetch(`${BASE_URL}/stations/${stationId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify({ partners: updatedPartners }),
          });
        }),
      ]);

      // Обновляем данные
      await fetchStations();
      setIsEditingStations(false);
    } catch (error) {
      if (error.message === "403") {
        const { access_token } = await refreshToken(user?.refreshToken);
        setUser({ ...user, access_token });
        await saveStationsChanges(); // Повторяем с новым токеном
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

  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Хамкор маълумотлари</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">МЧЖ номи:</h3>
            <p>{partner.partner_name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Директор:</h3>
            <p>{partner.direktor}</p>
          </div>
          <div>
            <h3 className="font-semibold">Банк:</h3>
            <p>{partner.bank}</p>
          </div>
          <div>
            <h3 className="font-semibold">МФО:</h3>
            <p>{partner.mfo}</p>
          </div>
          <div>
            <h3 className="font-semibold">ИНН:</h3>
            <p>{partner.stir}</p>
          </div>
          <div>
            <h3 className="font-semibold">Телефон:</h3>
            <p>{partner.tel}</p>
          </div>
        </div>

        <div className="border-t pt-4">
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
            <div className="space-y-3 max-h-60 overflow-y-auto p-2 border rounded">
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
                  .filter((station) =>
                    station.partners?.includes(partner.id.toString())
                  )
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

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Ёпиш
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartnerDetailsModal;
