import React from "react";

function RegionsList({ id, region_name }) {
  return (
    <tr>
      <th>{id}</th>
      <td>
        {region_name}{" "}
        {id === 2 ? "шахар" : id === 7 ? "Республикаси" : "вилоят"}
      </td>
    </tr>
  );
}

export default RegionsList;
