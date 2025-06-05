import React, { useState, useEffect } from "react";
import { Table, Select, Button, DatePicker, Modal, Input, message } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  getPartners,
  getPayment,
  getStations,
  registerPayment,
} from "../request";
import { useAppStore } from "../lib/zustand";

const { Option } = Select;

const PaymentReport = () => {
  const payment = useAppStore((state) => state.payment);
  const setPayment = useAppStore((state) => state.setPayment);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const partners = useAppStore((state) => state.partners);
  const setPartners = useAppStore((state) => state.setPartners);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const user = useAppStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterYear, setFilterYear] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterStation, setFilterStation] = useState(null);
  const [filterPartner, setFilterPartner] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [payment, filterYear, filterMonth, filterStation, filterPartner]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = user?.access_token;

      const [paymentsData, partnersData, stationsData] = await Promise.all([
        getPayment(token),
        getPartners(token),
        getStations(token), // Убедитесь, что этот запрос возвращает массив
      ]);

      setPayment(paymentsData);
      setPartners(partnersData);
      setStations(stationsData); // Проверьте, что stationsData - это массив
    } catch (error) {
      message.error("Ошибка при загрузке данных");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payment]; // Используем payment из хранилища

    if (filterYear) {
      filtered = filtered.filter(
        (p) => new Date(p.date).getFullYear() === filterYear
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(
        (p) => new Date(p.date).getMonth() + 1 === filterMonth
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
        "ID оплаты": p.id,
        Партнер:
          partners.find((partner) => partner.id == p.partner_id)
            ?.partner_name || "Неизвестно",
        "Дата оплаты": p.date,
        "Номер квитанции": p.paymentNumber,
        Сумма: p.paymentSum,
        Статус: getStatusText(p.approval),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Оплаты");
    XLSX.writeFile(wb, "Отчет_по_оплатам.xlsx");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Создан";
      case "1":
        return "Утвержден";
      case "2":
        return "Отклонен";
      default:
        return "Неизвестно";
    }
  };

  const columns = [
    {
      title: "ID оплаты",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Партнер",
      key: "partner",
      render: (_, record) =>
        partners.find((p) => p.id == record.partner_id)?.partner_name ||
        "Неизвестно",
    },
    {
      title: "Дата оплаты",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Номер квитанции",
      dataIndex: "paymentNumber",
      key: "paymentNumber",
    },
    {
      title: "Сумма",
      dataIndex: "paymentSum",
      key: "paymentSum",
    },
    {
      title: "Статус",
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
      const paymentData = {
        ...values,
        approval: approvalStatus,
        user_id: user?.id,
      };

      await registerPayment(user?.access_token, paymentData);
      message.success("Оплата успешно добавлена");
      setIsModalVisible(false);
      setIsConfirmationModalVisible(false);
      fetchData(); // Обновляем данные после сохранения
    } catch (error) {
      message.error("Ошибка при добавлении оплаты");
      console.error(error);
    }
  };

  return (
    <div>
      <div
        style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <Select
          placeholder="Год"
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
          placeholder="Месяц"
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
          placeholder="Станция"
          style={{ width: 200 }}
          onChange={setFilterStation}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {Array.isArray(stations) &&
            stations.map((station) => (
              <Option key={station.id} value={station.id}>
                {station.moljal}
              </Option>
            ))}
        </Select>

        <Select
          placeholder="Партнер"
          style={{ width: 200 }}
          onChange={setFilterPartner}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {partners.map((partner) => (
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
        stations={stations} // Добавляем эту строку
        user={user} // Также убедимся, что передаем user
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
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

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

  const handleConfirmation = (approvalStatus) => {
    onSave({ ...form, approval: approvalStatus }, approvalStatus);
  };

  // Добавляем проверку на массив
  const filteredPartners = Array.isArray(partners)
    ? partners.filter((partner) =>
        partner.partner_name.toLowerCase().includes(searchPartner.toLowerCase())
      )
    : [];

  // Добавляем проверку на массив
  const filteredStations = Array.isArray(stations?.data)
    ? stations.data.filter((station) =>
        station.moljal?.toLowerCase().includes(searchStation.toLowerCase())
      )
    : [];

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
            <div>Партнер</div>
            <Select
              showSearch
              placeholder="Выберите партнера"
              style={{ width: "100%" }}
              value={form.partner_id}
              onChange={(value) => setForm({ ...form, partner_id: value })}
              onSearch={setSearchPartner}
              filterOption={false}
            >
              {filteredPartners.map((partner) => (
                <Option key={partner.id} value={partner.id}>
                  {partner.partner_name}
                </Option>
              ))}
            </Select>
          </div>

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
          onCancel={() => setIsConfirmationModalVisible(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setIsConfirmationModalVisible(false)}
            >
              Отмена
            </Button>,
            <Button key="save" onClick={() => handleConfirmation("0")}>
              Сохранить
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => handleConfirmation("1")}
            >
              Утвердить
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
