export default function TableMouvements({ mouvements }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Produit</th>
          <th>Type</th>
          <th>Quantité</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {mouvements.map((m) => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.produit_id}</td>
            <td>{m.type}</td>
            <td>{m.quantite}</td>
            <td>{new Date(m.date_mouvement).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
