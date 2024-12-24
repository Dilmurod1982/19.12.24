import React from "react";

function UsersList({ id, username, type }) {
  return (
    <tr>
      <th>{id}</th>
      <td>{username}</td>
      <td>{type}</td>
    </tr>
  );
}

export default UsersList;
