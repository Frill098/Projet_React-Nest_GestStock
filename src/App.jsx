import { useState } from 'react'
import './App.css'

function App() {
  const[formData, setFormData] = useState({
    nom:"",
    prenom:"",
    age:"", 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,//mise à jour dynamique
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données envoyées:", formData);
    };
    return(
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
        /> <br />
        <input
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Prénom"
        /> <br />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Âge"
        /> <br />
        <button type="submit">Soumettre</button>
      </form>
    )
  };



export default App 