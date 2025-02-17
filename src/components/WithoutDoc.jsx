import React from "react";
import { useAppStore } from "../lib/zustand/index";

function WithoutDoc({ id, moljal, ltd_name, station_number, textDoc }) {
  return (
    <tr className="text-center">
      <th>{id}</th>
      <td>{moljal}</td>
      <td className="text-center">
        {ltd_name} АГТКШ № {station_number}
      </td>
      <td className="text-center">{textDoc} киритилмаган</td>
    </tr>
  );
}

export default WithoutDoc;
