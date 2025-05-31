import React, { useState } from "react";
import { Link } from "react-router-dom";
import PartnerDetailsModal from "./PartnerDetailsModal";

function PartnersListt({ id, partner_name, direktor, bank, mfo, stir, tel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const partner = {
    id,
    partner_name,
    direktor,
    bank,
    mfo,
    stir,
    tel,
  };

  return (
    <>
      <tr>
        <th>{id}</th>
        <td>{partner_name}</td>
        <td>{direktor}</td>
        <td>+{tel}</td>
        <td>{bank}</td>
        <td>{mfo}</td>
        <td>{stir}</td>
        <td>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline"
          >
            Подробно
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <PartnerDetailsModal
          partner={partner}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default PartnersListt;
