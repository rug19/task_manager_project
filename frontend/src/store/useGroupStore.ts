import { create } from "zustand";
import { groupApi, activityApi } from "../services/api";
import type { GroupStore } from "../types/groupStore.types";
import {
  addActivityToGroup,
  deleteActivityInGroup,
  moveActivityToGroupHelper,
  toggleActivityInGroup,
  updateActivityInGroup,
} from "./helpers/activityHelpers";

export const useGroupStore = create<GroupStore>((set, get) => ({
  // ========== ESTADO INICIAL ==========
  groups: [],
  isLoading: false,
  searchTerm: "",

  // ========== BUSCA (SIMPLES) ==========
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  // ========== BUSCAR GRUPOS ==========
  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const groups = await groupApi.getAll();
      set({ groups, isLoading: false });
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
      set({ isLoading: false });
    }
  },

  // ========== CRIAR GRUPO ==========
  createGroup: async (title: string) => {
    try {
      const newGroup = await groupApi.create(title);
      set((state) => ({
        groups: [...state.groups, newGroup],
      }));
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      throw error;
    }
  },

  // ========== ATUALIZAR GRUPO ==========
  updateGroup: async (groupId: string, title: string) => {
    try {
      const updated = await groupApi.update(groupId, title);
      set((state) => ({
        groups: state.groups.map((g) => (g.id === groupId ? updated : g)),
      }));
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      throw error;
    }
  },

  // ========== DELETAR GRUPO ==========
  deleteGroup: async (groupId: string) => {
    try {
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== groupId),
      }));
      await groupApi.delete(groupId);
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      throw error;
    }
  },

  // ========== CRIAR ATIVIDADE ==========
  createActivity: async (groupId: string, description: string, deliveryDate?: string) => {
    try {
      const newActivity = await activityApi.create(groupId, description, deliveryDate);

      const activityWithCompleted = {
        ...newActivity,
        completed: newActivity.completed ?? false,
      };
      set((state) => ({
        groups: addActivityToGroup(
          state.groups,
          groupId,
          activityWithCompleted
        ),
      }));
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      throw error;
    }
  },

  // ========== ATUALIZAR ATIVIDADE ==========
  updateActivity: async (
    groupId: string,
    activityId: string,
    description: string,
    deliveryDate?: string
  ) => {
    try {
      const updated = await activityApi.update(
        groupId,
        activityId,
        description,
        deliveryDate
      );
      set((state) => ({
        groups: updateActivityInGroup(state.groups, groupId, updated),
      }));
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
      throw error;
    }
  },

  // ========== DELETAR ATIVIDADE ==========
  deleteActivity: async (groupId: string, activityId: string) => {
    try {
      // 1. Remove da UI imediatamente
      set((state) => ({
        groups: deleteActivityInGroup(state.groups, groupId, activityId),
      }));
      await activityApi.delete(activityId);
    } catch (error) {
      console.error(" Erro ao deletar:", error);
    }
  },

  // ========== TOGGLE ATIVIDADE ==========
  toggleActivity: async (groupId: string, activityId: string) => {
    // 1. Busca atividade atual
    const group = get().groups.find((g) => g.id === groupId);
    const activity = group?.activities.find((a) => a.id === activityId);
    if (!activity) {
      console.error(" Atividade não encontrada:", activityId);
      return;
    }

    //  Garante que completed existe
    const currentCompleted = activity.completed ?? false;
    const newCompleted = !currentCompleted;

    set((state) => ({
      groups: toggleActivityInGroup(
        state.groups,
        groupId,
        activityId,
        newCompleted
      ),
    }));

    try {
      await activityApi.update(
        groupId,
        activityId,
        activity.description,
        activity.deliveryDate,
        !currentCompleted // ← Usa valor garantido
      );
    } catch (error) {
      console.error("Erro ao alternar atividade:", error);

      // 4. Reverte se falhar
      set((state) => ({
        groups: toggleActivityInGroup(
          state.groups,
          groupId,
          activityId,
          currentCompleted
        ),
      }));
    }
  },

  // ========== MOVER ATIVIDADE ENTRE GRUPOS ==========
  moveActivityToGroup: async (
    sourceGroupId: string,
    targetGroupId: string,
    activityId: string
  ) => {
    //Busca a atividade que será movida
    const sourceGroup = get().groups.find((g) => g.id === sourceGroupId);
    const activity = sourceGroup?.activities?.find((a) => a.id === activityId);

    if (!activity) {
      return;
    }

    //Atualiza estado IMEDIATAMENTE (Optimistic Update)
    set((state) => ({
      groups: moveActivityToGroupHelper(
        state.groups,
        sourceGroupId,
        targetGroupId,
        activity
      ),
    }));

    // Sincroniza com backend (background)
    try {
      await activityApi.move(activityId, targetGroupId);
    } catch (error) {
      console.error(" Erro ao mover atividade:", error);
      // Reverte buscando tudo do backend
      get().fetchGroups();
    }
  },
}));
