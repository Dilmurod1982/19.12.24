import React, { useState } from "react";
import { Modal, Select, DatePicker, Input, Button, message, Form } from "antd";
import dayjs from "dayjs";
import { useAppStore } from "../lib/zustand";
import { registerPayment } from "../request";

const { Option } = Select;

export default function AddNewPayment({ sendingData, setSendingData }) {
  const [form] = Form.useForm();
  const addItemModal = useAppStore((state) => state.addItemModal);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const stations = useAppStore((state) => state.stations);
  const partners = useAppStore((state) => state.partners);
  const user = useAppStore((state) => state.user);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false); // Добавляем отдельное состояние для подтверждения

  const getUserStations = () => {
    if (!stations || !user) return [];
    return stations.filter((station) =>
      station.operators?.includes(user.id.toString())
    );
  };
  const UserStations = getUserStations();

  const getStationPartners = () => {
    if (!selectedStation || !partners) return [];

    const station = stations.find((s) => s.id === selectedStation);
    if (!station?.partners) return [];

    return partners.filter((partner) =>
      station.partners.includes(partner.id.toString())
    );
  };
  const stationPartners = getStationPartners();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const selectedStationData = UserStations.find(
        (s) => s.id === values.station_id
      );
      const selectedPartnerData = stationPartners.find(
        (p) => p.id === values.partner_id
      );

      const paymentData = {
        ...values,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
        stationName: selectedStationData.moljal,
        partnerName: selectedPartnerData.partner_name,
        approval: 1, // Здесь должно быть approval, а не appval
        user_id: user.id,
      };

      setPaymentData(paymentData);
      setConfirmModalVisible(true);
    } catch (error) {
      message.error("Пожалуйста, заполните все обязательные поля!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setConfirmLoading(true);
      const response = await registerPayment(user.access_token, paymentData);
      if (response) {
        message.success("Платеж успешно сохранен!");
        form.resetFields();
        setConfirmModalVisible(false);
        setAddItemModal(false);
        setSendingData(Date.now());
      }
    } catch (error) {
      message.error("Ошибка при сохранении платежа!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const formatPaymentSum = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setFieldsValue({ paymentSum: value ? parseInt(value, 10) : "" });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedStation(null);
    setAddItemModal(false);
  };

  return (
    <>
      <Modal
        title="Новый платеж"
        open={addItemModal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Сохранить
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="station_id"
            label="Станция"
            rules={[
              { required: true, message: "Пожалуйста, выберите станцию!" },
            ]}
          >
            <Select
              placeholder="Выберите станцию"
              onChange={(value) => setSelectedStation(value)}
            >
              {UserStations.map((station) => (
                <Option key={station.id} value={station.id}>
                  {station.moljal}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="partner_id"
            label="Партнер"
            rules={[
              { required: true, message: "Пожалуйста, выберите партнера!" },
            ]}
          >
            <Select
              placeholder={
                selectedStation
                  ? "Выберите партнера"
                  : "Сначала выберите станцию"
              }
              disabled={!selectedStation}
            >
              {stationPartners.map((partner) => (
                <Option key={partner.id} value={partner.id}>
                  {partner.partner_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentDate"
            label="Дата платежа"
            rules={[{ required: true, message: "Пожалуйста, выберите дату!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD.MM.YYYY"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="paymentNumber"
            label="Номер платежа"
            rules={[
              { required: true, message: "Пожалуйста, введите номер платежа!" },
            ]}
          >
            <Input placeholder="Введите номер платежа" />
          </Form.Item>

          <Form.Item
            name="paymentSum"
            label="Сумма платежа"
            rules={[{ required: true, message: "Пожалуйста, введите сумму!" }]}
          >
            <Input placeholder="Введите сумму" onChange={formatPaymentSum} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Подтверждение платежа"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmModalVisible(false)}>
            Отмена
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleConfirmPayment}
          >
            Подтвердить
          </Button>,
        ]}
      >
        {paymentData && (
          <div>
            <p>
              <strong>Станция:</strong> {paymentData.stationName}
            </p>
            <p>
              <strong>Партнер:</strong> {paymentData.partnerName}
            </p>
            <p>
              <strong>Дата платежа:</strong> {paymentData.paymentDate}
            </p>
            <p>
              <strong>Номер платежа:</strong> {paymentData.paymentNumber}
            </p>
            <p>
              <strong>Сумма платежа:</strong> {paymentData.paymentSum}
              сум
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
