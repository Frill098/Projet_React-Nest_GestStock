import axios from "axios";

const API_URL = "http://localhost:3000/mouvements";

export const getMouvements = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createEntree = async (data) => {
  const res = await axios.post(API_URL, {
    ...data,
    type: "ENTREE",
  });
  return res.data;
};

export const createSortie = async (data) => {
  const res = await axios.post(API_URL, {
    ...data,
    type: "SORTIE",
  });
  return res.data;
};
