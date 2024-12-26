import React from "react";

function LtdList({ id, ltd_name, direktor, bank, mfo, stir, tel }) {
  return (
    <tr>
      <th>{id}</th>
      <td>{ltd_name}</td>
      <td>{direktor}</td>
      <td>+{tel}</td>
      <td>{bank}</td>
      <td>{mfo}</td>
      <td>{stir}</td>
    </tr>
  );
}

export default LtdList;
