import axios from "axios";
import type { Activity, Group } from "../types/types";

//Axios config
const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Endpoints: Group

export const groupApi = {
  // GET /groups - Lista todos os grupos com atividades
  getAll: async (): Promise<Group[]> => {
    const response = await api.get<Group[]>("/groups");
    return response.data;
  },

  // POST /groups - Cria novo grupo
  create: async (title: string): Promise<Group> => {
    const response = await api.post<Group>("/groups", { title });
    return response.data;
  },

  // PUT /groups/:id - Atualiza grupo
  update: async (id: string, title: string): Promise<Group> => {
    const response = await api.patch<Group>(`/groups/${id}/title`, { title });
    return response.data;
  },

  // DELETE /groups/:id - Deleta grupo
  delete: async (groupId: string): Promise<void> => {
    await api.delete(`/groups/${groupId}`);
  },
};

//Endpoints: Activivity

export const activityApi = {
  // GET /groups/:groupId/activities - Lista atividades de um grupo
  getAll: async (groupId: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/groups/${groupId}/activities`);
    return response.data;
  },

  // POST /groups/:groupId/activities - Cria atividade
  create: async (groupId: string, description: string, deliveryDate?: string): Promise<Activity> => {
    const payload = {
      description,
      completed: false,
      deliveryDate: deliveryDate || null,
      taskGroup: {
        id: groupId,
      },
    };

    const response = await api.post<Activity>("/activities", payload);

    return response.data;
  },

  // PUT /groups/:groupId/activities/:id - Atualiza descrição
  update: async (
    groupId: string,
    activityId: string,
    description: string,
    deliveryDate?: string,
    completed?: boolean
  ): Promise<Activity> => {
    const payload = {
      description,
      deliveryDate: deliveryDate || null,
      completed,
      taskGroup: {
        id: groupId,
      },
    };

    const response = await api.put<Activity>(
      `/activities/${activityId}`,
      payload
    );
    return response.data;
  },

  // DELETE /activities/:id - Deleta atividade
  delete: async (activityId: string): Promise<void> => {
    await api.delete(`/activities/${activityId}`);
  },

  //MOVE: /activities/:activityId/move/newGroupId - Move atividade para outro grupo
  move: async (activityId: string, newGroupId: string): Promise<Activity> => {
    const response = await api.put<Activity>(
      `/activities/${activityId}/move/${newGroupId}`
    );

    return response.data;
  },

  search: async (description: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>("/activities/search", {
      params: { description },
    });
    return response.data;
  },
};

export default {
  groups: groupApi,
  activities: activityApi,
};
