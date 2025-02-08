import React from "react";

function KolonkaMarkaList({ id, type_name }) {
  return (
    <tr>
      <th>{id}</th>
      <td>{type_name} </td>
    </tr>
  );
}

export default KolonkaMarkaList;
