import React, { useState, useEffect } from "react";
import { Table, Select, Button, DatePicker, Modal, Input, message } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  fetchDataWithTokenRefresh,
  getDocs,
  getPartners,
  getPayment,
  getStations,
  registerPayment,
} from "../request";
import { useAppStore } from "../lib/zustand";
import { BASE_URL } from "../my-utils";
import { useTokenValidation } from "../hooks/useTokenValidation";
import PaymentReportList from "../components/PaymentReportList";
import AddNewPayment from "../components/AddNewPayment";
import { Link } from "react-router-dom";

export default function PaymentReport() {
  const [sendingData, setSendingData] = useState(null);
  const partners = useAppStore((state) => state.partners);
  const setPartners = useAppStore((state) => state.setPartners);
  const stations = useAppStore((state) => state.stations) || { data: [] };
  const setStations = useAppStore((state) => state.setStations);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const [dailyReports, setDailyReports] = useState(null);
  const [partnerDailyReports, setPartnerDailyReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "dailyreports"),
      setDailyReports
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "partnersdailyreports"),
      setPartnerDailyReports
    );
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "partners"),
      setPartners
    );
  }, [
    user,
    setStations,
    setDailyReports,
    setPartnerDailyReports,
    setPartners,
    sendingData,
  ]);

  const getUserStations = () => {
    if (!stations || !user) return [];
    return stations.filter((station) =>
      station.operators?.includes(user.id.toString())
    );
  };
  const UserStations = getUserStations();

  const getUserPartnerDailyReport = () => {
    if (!partnerDailyReports || !UserStations) return [];
    const UserStationsIds = UserStations.map((station) => Number(station.id));
    return partnerDailyReports.filter((pdr) =>
      UserStationsIds.includes(Number(pdr.station_id))
    );
  };
  const UserPartnerDailyReport = getUserPartnerDailyReport();

  const getUserPayments = () => {
    if (!UserPartnerDailyReport || !user) return [];
    return UserPartnerDailyReport.filter((updr) => {
      // Проверяем, что payment существует и является массивом
      if (!updr.payment || !Array.isArray(updr.payment)) return false;

      return updr.payment.some(
        (payment) =>
          Number(payment.paymentSum) > 0 && Number(payment.approval) === 1
      );
    });
  };
  const UserPayments = getUserPayments();
  // console.log(UserPayments);

  return (
    <>
      <div>
        <div className="flex justify-between w-full px-4 pb-6">
          <h1 className="text-3xl font-bold">Тўловлар рўйхати</h1>
          {user.type === "booker" ? (
            <Button
              onClick={setAddItemModal}
              disabled={partnerDailyReports ? false : true}
              className={
                partnerDailyReports ? "cursor-pointer" : "cursor-not-allowed"
              }
            >
              Янги тўлов қўшиш
            </Button>
          ) : null}
        </div>
        <table className="table table-xs">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Тўлов санаси</th>
              <th className="text-center">Тўловчи номи</th>
              <th className="text-center">Тўлов рақами</th>
              <th className="text-center">Тўлов суммаси</th>
            </tr>
          </thead>
          <tbody>
            {UserPayments && partners ? (
              <PaymentReportList
                key={UserPayments.id}
                UserPayments={UserPayments}
                partners={partners}
              />
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <h1 className="my-5 btn-link text-2xl italic">
                    Тўловлар мавжуд эмас
                  </h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddNewPayment
        sendingData={sendingData}
        setSendingData={setSendingData}
      />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/docs">Орқага</Link>
        </Button>
      </div>
    </>
  );
}
