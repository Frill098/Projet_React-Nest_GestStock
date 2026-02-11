import { useEffect, useState } from "react";
import { getMouvements } from "../services/mouvementService";
import TableMouvements from "../components/TableMouvements";

export default function Mouvements() {
  const [mouvements, setMouvements] = useState([]);

  useEffect(() => {
    getMouvements().then(setMouvements);
  }, []);

  return (
    <div>
      <h1>Historique des mouvements</h1>
      <TableMouvements mouvements={mouvements} />
    </div>
  );
}
