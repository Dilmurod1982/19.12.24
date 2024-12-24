import React from "react";
import { Button } from "./ui/button";

function StationsList({
  id,
  moljal,
  ltd_name,
  station_number,
  viloyat,
  tuman,
  kocha,
  uy,
  boshqaruvchi,
  aloqa_tel,
  b_mexanik,
  b_mexanik_tel,
  gaz_taminot,
}) {
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
        {viloyat} вилояти, {tuman}, {kocha} кўчаси, {uy} уй
      </td>
      <td>
        {b_mexanik} {b_mexanik_tel}
      </td>
      <td>{gaz_taminot}</td>
      <td>
        <Button>Батафсил</Button>
      </td>
    </tr>
  );
}

export default StationsList;
