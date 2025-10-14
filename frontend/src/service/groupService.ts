import axios from "axios";

export async function createGroup(title: string) {
  try {
    const { data } = await axios.post("http://localhost:8080/api/groups", {
      title,
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar um grupo", error);
    throw error;
  }
}
