import React from "react";
import { Button } from "./ui/button";
import { useAppStore } from "../lib/zustand";

function StationsList({
  id,
  moljal,
  ltd_name,
  station_number,
  region_name,
  city_name,
  kocha,
  uy,
  boshqaruvchi,
  aloqa_tel,
  b_mexanik,
  b_mexanik_tel,
  gasLtd_name,
}) {
  const user = useAppStore((state) => state.user);
  return (
    <tr>
      <th>{id}</th>
      <td>{moljal}</td>
      <td>
        {ltd_name} АГТКШ № {station_number}
      </td>
      <td>
        {boshqaruvchi} {aloqa_tel}
      </td>
      <td>
        {region_name} вилояти, {city_name}, {kocha} кўчаси, {uy} уй
      </td>
      <td>
        {b_mexanik} {b_mexanik_tel}
      </td>
      <td>{gasLtd_name} газ</td>
      <td>{user.type === "admin" ? <Button>Батафсил</Button> : ""}</td>
    </tr>
  );
}

export default StationsList;
