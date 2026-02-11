import { useState } from "react";
import { createEntree } from "../services/mouvementService";

export default function FormEntree() {
  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEntree({
      produit_id: Number(produitId),
      quantite: Number(quantite),
    });

    setProduitId("");
    setQuantite("");
    alert("Entrée de stock enregistrée");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Entrée de stock</h2>

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

      <button type="submit">Valider l’entrée</button>
    </form>
  );
}
