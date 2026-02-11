import { useState } from "react";
import { createSortie } from "../services/mouvementService";

export default function FormSortie() {
  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createSortie({
      produit_id: Number(produitId),
      quantite: Number(quantite),
    });

    setProduitId("");
    setQuantite("");
    alert("Sortie de stock enregistrée");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sortie de stock</h2>

      <input
        type="number"
        placeholder="ID Produit"
        value={produitId}
        onChange={(e) => setProduitId(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Quantité"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        required
      />

      <button type="submit">Valider la sortie</button>
    </form>
  );
}
