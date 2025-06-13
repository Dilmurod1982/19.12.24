import React, { useState, useEffect } from "react";
import { Table, Select, Button, DatePicker, Modal, Input, message } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  getDocs,
  getPartners,
  getPayment,
  getStations,
  registerPayment,
} from "../request";
import { useAppStore } from "../lib/zustand";
import { BASE_URL } from "../my-utils";
import { useTokenValidation } from "../hooks/useTokenValidation";

const { Option } = Select;

const PaymentReport = () => {
  const [dailyReports, setDailyReports] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const partners = useAppStore((state) => state.partners) || [];
  const setPartners = useAppStore((state) => state.setPartners);
  const stations = useAppStore((state) => state.stations) || { data: [] };
  const setStations = useAppStore((state) => state.setStations);
  const user = useAppStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterYear, setFilterYear] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterStation, setFilterStation] = useState(null);
  const [filterPartner, setFilterPartner] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [userStations, setUserStations] = useState([]);

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  useEffect(() => {
    applyFilters();
  }, [dailyReports, filterYear, filterMonth, filterStation, filterPartner]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (stations?.data && user?.id) {
      // Фильтруем станции, доступные текущему пользователю
      const filtered = stations.data.filter(
        (station) =>
          station.operators && station.operators.includes(user.id.toString())
      );
      setUserStations(filtered || []);
    }
  }, [stations, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = user?.access_token;

      const [partnersData, stationsData] = await Promise.all([
        getPartners(token),
        getStations(token),
      ]);

      // Загружаем daily reports вместо payments
      const reportsResponse = await fetch(`${BASE_URL}/partnersdailyreports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reportsData = await reportsResponse.json();
      setDailyReports(reportsData.data || reportsData);
      setPartners(partnersData || []);
      setStations(stationsData || { data: [] });
    } catch (error) {
      message.error("Маълумотлар юкланишида хатолик");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(dailyReports)) {
      setFilteredPayments([]);
      return;
    }

    const allPayments = (
      Array.isArray(dailyReports) ? dailyReports : []
    ).reduce((acc, report) => {
      if (report?.payment && Array.isArray(report.payment)) {
        return [
          ...acc,
          ...report.payment.map((p) => ({
            ...p,
            date: report.date,
            partner_id: report.partner_id,
            station_id: report.station_id,
            reportId: report.id,
          })),
        ];
      }
      return acc;
    }, []);

    let filtered = [...allPayments];

    if (filterYear) {
      filtered = filtered.filter(
        (p) => p.date && new Date(p.date).getFullYear() === filterYear
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(
        (p) => p.date && new Date(p.date).getMonth() + 1 === filterMonth
      );
    }

    if (filterStation) {
      filtered = filtered.filter((p) => p.station_id == filterStation);
    }

    if (filterPartner) {
      filtered = filtered.filter((p) => p.partner_id == filterPartner);
    }

    setFilteredPayments(filtered);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredPayments.map((p) => ({
        ID: p.id,
        Партнер:
          partners.find((partner) => partner.id == p.partner_id)
            ?.partner_name || "Номаълум",
        "Тўлов санаси": p.date,
        "Тўлов рақами": p.paymentNumber,
        Сумма: p.paymentSum,
        Статус: getStatusText(p.approval),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Туловлар");
    XLSX.writeFile(wb, "Хисобот туловлар.xlsx");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Яратилган";
      case "1":
        return "Тасдиқланган";
      case "2":
        return "Бекор қилинган";
      default:
        return "Номаълум";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Хамкор",
      key: "partner",
      render: (_, record) =>
        partners.find((p) => p.id == record.partner_id)?.partner_name ||
        "Номаълум",
    },
    {
      title: "Тўлов санаси",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Тўлов рақами",
      dataIndex: "paymentNumber",
      key: "paymentNumber",
    },
    {
      title: "Сумма",
      dataIndex: "paymentSum",
      key: "paymentSum",
    },
    {
      title: "Холати",
      key: "status",
      render: (_, record) => getStatusText(record.approval),
    },
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ];

  const handleSavePayment = async (values, approvalStatus = "0") => {
    try {
      const token = user?.access_token;
      const paymentData = {
        paymentNumber: values.paymentNumber,
        paymentSum: values.paymentSum,
        approval: approvalStatus,
        user_id: user?.id,
        create_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (Number(values.paymentSum) <= 0) {
        throw new Error("Сумма платежа должна быть положительной");
      }

      // 1. Пытаемся найти существующий отчет
      const response = await fetch(
        `${BASE_URL}/partnersdailyreports?date=${values.date}&partner_id=${values.partner_id}&station_id=${values.station_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка при получении отчетов");

      const responseData = await response.json();
      console.log("Полный ответ сервера:", responseData);

      // Извлекаем отчет из массива data
      let reportToUpdate = responseData.data?.[0];

      // 2. Если отчета нет - создаем новый
      if (!reportToUpdate) {
        const newReportResponse = await fetch(
          `${BASE_URL}/partnersdailyreports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              date: values.date,
              partner_id: values.partner_id,
              station_id: values.station_id,
              initial_balace: "0",
              total_sum: "0",
              final_balance: "0",
              payment: [],
            }),
          }
        );

        if (!newReportResponse.ok) {
          throw new Error("Ошибка при создании нового отчета");
        }

        const newReportData = await newReportResponse.json();
        reportToUpdate = newReportData.data?.[0] || newReportData;
      }

      console.log("Отчет для обновления:", reportToUpdate);

      if (!reportToUpdate?.id) {
        throw new Error("ID отчета не найден в ответе сервера");
      }

      // 3. Проверка уникальности платежа
      const existingPayments = reportToUpdate.payment || [];
      if (
        existingPayments.some((p) => p.paymentNumber === values.paymentNumber)
      ) {
        throw new Error("Платеж с таким номером уже существует");
      }

      // 4. Обновляем отчет
      const updatedPayment = [...existingPayments, paymentData];
      const totalPayment = updatedPayment.reduce(
        (sum, p) => sum + Number(p.paymentSum),
        0
      );

      const initialBalance = Number(reportToUpdate.initial_balace) || 0;
      const totalSum = Number(reportToUpdate.total_sum) || 0;
      const updatedFinalBalance = initialBalance + totalSum - totalPayment;

      const updateData = {
        payment: updatedPayment,
        final_balance: updatedFinalBalance.toString(),
      };

      const updateResponse = await fetch(
        `${BASE_URL}/partnersdailyreports/${reportToUpdate.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(
          `Ошибка обновления отчета: ${updateResponse.status} - ${errorText}`
        );
      }

      message.success("Оплата успешно добавлена");
      setIsModalVisible(false);
      setIsConfirmationModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Полная ошибка:", error);
      message.error(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div>
      <div
        style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <Select
          placeholder="Йил"
          style={{ width: 120 }}
          onChange={setFilterYear}
          allowClear
        >
          {years.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Ой"
          style={{ width: 120 }}
          onChange={setFilterMonth}
          allowClear
        >
          {months.map((month) => (
            <Option key={month.value} value={month.value}>
              {month.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Шахобча"
          style={{ width: 200 }}
          onChange={(value) => {
            setFilterStation(value);
            setFilterPartner(null); // Сбрасываем выбор партнера при смене станции
          }}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {userStations.map((station) => (
            <Option key={station.id} value={station.id}>
              {station.moljal}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Хамкор"
          style={{ width: 200 }}
          onChange={setFilterPartner}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          disabled={!filterStation} // Делаем неактивным, если не выбрана станция
        >
          {filterStation &&
            partners
              .filter((partner) => {
                const station = userStations.find((s) => s.id == filterStation);
                return (
                  station &&
                  station.partners &&
                  station.partners.includes(partner.id.toString())
                );
              })
              .map((partner) => (
                <Option key={partner.id} value={partner.id}>
                  {partner.partner_name}
                </Option>
              ))}
        </Select>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
        >
          Excel
        </Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Новая оплата
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        loading={loading}
      />

      <AddNewPayment
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSavePayment}
        partners={partners}
        stations={{ data: userStations }} // Передаем только станции пользователя
        user={user}
        isConfirmationModalVisible={isConfirmationModalVisible}
        setIsConfirmationModalVisible={setIsConfirmationModalVisible}
      />
    </div>
  );
};

const AddNewPayment = ({
  visible,
  onCancel,
  onSave,
  partners,
  stations = [],
  user,
  isConfirmationModalVisible,
  setIsConfirmationModalVisible,
}) => {
  const [form, setForm] = useState({
    partner_id: null,
    station_id: null,
    date: dayjs().format("YYYY-MM-DD"),
    paymentNumber: "",
    paymentSum: "",
  });
  const [searchPartner, setSearchPartner] = useState("");
  const [searchStation, setSearchStation] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [availablePartners, setAvailablePartners] = useState([]);

  // Фильтруем партнеров при изменении выбранной станции
  useEffect(() => {
    if (form.station_id) {
      const selectedStation = stations.data.find(
        (s) => s.id == form.station_id
      );
      if (selectedStation && selectedStation.partners) {
        const filtered = partners.filter((partner) =>
          selectedStation.partners.includes(partner.id.toString())
        );
        setAvailablePartners(filtered);
      } else {
        setAvailablePartners([]);
      }
    } else {
      setAvailablePartners([]);
    }
    // Сбрасываем выбранного партнера при смене станции
    setForm((prev) => ({ ...prev, partner_id: null }));
  }, [form.station_id, partners, stations]);

  const handleSubmit = () => {
    if (
      !form.partner_id ||
      !form.station_id ||
      !form.date ||
      !form.paymentNumber ||
      !form.paymentSum
    ) {
      message.error("Заполните все поля");
      return;
    }

    if (user?.type === "booker") {
      setIsConfirmationModalVisible(true);
    } else {
      onSave(form);
    }
  };

  const handleConfirmation = async (approvalStatus) => {
    setConfirmLoading(true);
    try {
      await onSave({ ...form, approval: approvalStatus }, approvalStatus);
      setIsConfirmationModalVisible(false);
    } catch (error) {
      message.error("Ошибка при сохранении оплаты");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredStations =
    stations && Array.isArray(stations.data)
      ? stations.data.filter((station) =>
          station.moljal?.toLowerCase().includes(searchStation.toLowerCase())
        )
      : [];

  const filteredPartners = availablePartners.filter((partner) =>
    partner.partner_name.toLowerCase().includes(searchPartner.toLowerCase())
  );

  return (
    <>
      <Modal
        title="Новая оплата"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Сохранить
          </Button>,
        ]}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div>Станция</div>
            <Select
              showSearch
              placeholder="Выберите станцию"
              style={{ width: "100%" }}
              value={form.station_id}
              onChange={(value) => setForm({ ...form, station_id: value })}
              onSearch={setSearchStation}
              filterOption={false}
            >
              {filteredStations.map((station) => (
                <Option key={station.id} value={station.id}>
                  {station.moljal}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <div>Партнер</div>
            <Select
              showSearch
              placeholder={
                form.station_id
                  ? "Выберите партнера"
                  : "Сначала выберите станцию"
              }
              style={{ width: "100%" }}
              value={form.partner_id}
              onChange={(value) => setForm({ ...form, partner_id: value })}
              onSearch={setSearchPartner}
              filterOption={false}
              disabled={!form.station_id}
            >
              {filteredPartners.map((partner) => (
                <Option key={partner.id} value={partner.id}>
                  {partner.partner_name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <div>Дата</div>
            <DatePicker
              style={{ width: "100%" }}
              value={dayjs(form.date)}
              onChange={(date) =>
                setForm({ ...form, date: date.format("YYYY-MM-DD") })
              }
            />
          </div>

          <div>
            <div>Номер квитанции</div>
            <Input
              value={form.paymentNumber}
              onChange={(e) =>
                setForm({ ...form, paymentNumber: e.target.value })
              }
            />
          </div>

          <div>
            <div>Сумма</div>
            <Input
              type="number"
              value={form.paymentSum}
              onChange={(e) => setForm({ ...form, paymentSum: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Модальное окно подтверждения для booker */}
      {user?.type === "booker" && (
        <Modal
          title="Подтверждение оплаты"
          visible={isConfirmationModalVisible}
          onCancel={() =>
            !confirmLoading && setIsConfirmationModalVisible(false)
          }
          footer={[
            <Button
              key="back"
              onClick={() =>
                !confirmLoading && setIsConfirmationModalVisible(false)
              }
              disabled={confirmLoading}
            >
              Отмена
            </Button>,
            <Button
              key="save"
              onClick={() => handleConfirmation("0")}
              disabled={confirmLoading}
            >
              Сохранить
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => handleConfirmation("1")}
              loading={confirmLoading}
              disabled={confirmLoading}
            >
              {confirmLoading ? "Обработка..." : "Утвердить"}
            </Button>,
          ]}
        >
          <p>Выберите действие для этой оплаты:</p>
          <p>
            <strong>Сохранить</strong> - создаст оплату в статусе "Создан"
          </p>
          <p>
            <strong>Утвердить</strong> - создаст оплату в статусе "Утвержден" и
            выполнит перерасчет балансов
          </p>
        </Modal>
      )}
    </>
  );
};

export default PaymentReport;
