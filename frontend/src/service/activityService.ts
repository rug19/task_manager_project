import axios from "axios";
import type { Activity } from "../components/activityCard";

export async function createActivity(
  groupId: string,
  description: string
): Promise<Activity> {
  try {
    const { data } = await axios.post(
      `http://localhost:8080/api/groups/${groupId}/activities`,
      {
        description,
      }
    );
    return data;
  } catch (error) {
    console.error("Erro ao criar atividade", error);
    throw error;
  }
}

export async function updateActivity(
  groupId: string,
  activityId: string,
  description: string
): Promise<Activity> {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/groups/${groupId}/activities/${activityId}`,
      {
        description,
      }
    );
    return data;
  } catch (error) {
    console.error("Erro ao atualizar atividade", error);
    throw error;
  }
}

export async function deleteActivity(
  groupId: string,
  activityId: string
): Promise<void> {
  try {
    await axios.delete(
      `http://localhost:8080/api/groups/${groupId}/activities/${activityId}`
    );
  } catch (error) {
    console.error("Erro ao excluir atividade", error);
    throw error;
  }
}

export async function getActivitiesByGroup(
  groupId: string
): Promise<Activity[]> {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/groups/${groupId}/activities`
    );
    return data;
  } catch (error) {
    console.error("Erro ao buscar atividades", error);
    throw error;
  }
}

export async function moveActivity(
  activityId: string,
  targetGroupId: string
): Promise<Activity> {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/activities/${activityId}/move`,
      {
        groupId: targetGroupId,
      }
    );
    return data;
  } catch (error) {
    console.error("Erro ao mover atividade", error);
    throw error;
  }
}
