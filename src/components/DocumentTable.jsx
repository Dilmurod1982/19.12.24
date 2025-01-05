function DocumentTable({ documents, counts }) {
  return (
    <div>
      <h2 className="text-lg font-bold">Документы</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Название</th>
            <th>Срок действия</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.expiration}</td>
              <td>{/* Статус документа */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-around">
        <span>Активные: {counts.active}</span>
        <span>Истекают через 5 дней: {counts.expiringSoon5}</span>
        <span>Истекают через 15 дней: {counts.expiringSoon15}</span>
        <span>Просроченные: {counts.expired}</span>
      </div>
    </div>
  );
}
