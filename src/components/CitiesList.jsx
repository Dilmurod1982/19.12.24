import React from "react";
import { Button } from "./ui/button";

function CitiesList({ id, city_name, region_name, region_id }) {
  return (
    <tr>
      <th>{id}</th>
      <td>{city_name}</td>
      <td>
        {region_name}{" "}
        {region_id === 2
          ? "шахар"
          : region_id === 7
          ? "Республикаси"
          : "вилояти"}
      </td>
    </tr>
  );
}

export default CitiesList;
