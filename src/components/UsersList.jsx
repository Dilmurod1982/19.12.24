import React from "react";
import { Link } from "react-router-dom";

function UsersList({
  id,
  username,
  type,
  surname,
  lastname,
  startDate,
  endDate,
}) {
  return (
    <tr>
      <th>{id}</th>
      <td>{surname}</td>
      <td>{lastname}</td>
      <td>{username}</td>
      <td>{type}</td>
      <td>{startDate}</td>
      <td>{endDate}</td>
      <td>
        <Link to={`/userprofile/${id}`}>
          <button className="btn btn-neutral">Подробно</button>
        </Link>
      </td>
    </tr>
  );
}

export default UsersList;
