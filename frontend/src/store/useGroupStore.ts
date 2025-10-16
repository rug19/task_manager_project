import { create } from "zustand";
import { groupApi, activityApi } from "../services/api";
import type { Group } from "../types/types";

interface GroupStore {
  // ========== ESTADO ==========
  groups: Group[];
  isLoading: boolean;
  searchTerm: string;

  // ========== AÇÕES DE GRUPO ==========
  fetchGroups: () => Promise<void>;
  createGroup: (title: string) => Promise<void>;
  updateGroup: (id: string, title: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;

  // ========== AÇÕES DE ATIVIDADE ==========
  createActivity: (groupId: string, description: string) => Promise<void>;
  updateActivity: (
    groupId: string,
    activityId: string,
    description: string,
    deliveryDate?: string
  ) => Promise<void>;
  deleteActivity: (groupId: string, activityId: string) => Promise<void>;
  toggleActivity: (groupId: string, activityId: string) => Promise<void>;

  //========== DRAG AND DROP ============

  moveActivityToGroup: (
    sourceGroupId: string,
    targetGroupId: string,
    activityId: string
  ) => Promise<void>;

  setSearchTerm: (term: string) => void; // ✅ ADICIONAR
}

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
  updateGroup: async (id: string, title: string) => {
    try {
      const updated = await groupApi.update(id, title);
      set((state) => ({
        groups: state.groups.map((g) => (g.id === id ? updated : g)),
      }));
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      throw error;
    }
  },

  // ========== DELETAR GRUPO ==========
  deleteGroup: async (id: string) => {
    try {
      await groupApi.delete(id);
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
      }));
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      throw error;
    }
  },

  // ========== CRIAR ATIVIDADE ==========
  createActivity: async (groupId: string, description: string) => {
    try {
      const newActivity = await activityApi.create(groupId, description);

      const activityWithCompleted = {
        ...newActivity,
        completed: newActivity.completed ?? false, // ← Padrão: false
      };
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                activities: [...(g.activities || []), activityWithCompleted],
              }
            : g
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
        groups: state.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                activities: g.activities.map((a) =>
                  a.id === activityId ? updated : a
                ),
              }
            : g
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
      throw error;
    }
  },

  // ========== DELETAR ATIVIDADE ==========
  deleteActivity: async (groupId: string, activityId: string) => {
    try {
      await activityApi.delete(groupId, activityId);
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                activities: g.activities.filter((a) => a.id !== activityId),
              }
            : g
        ),
      }));
    } catch (error) {
      console.error("Erro ao deletar atividade:", error);
      throw error;
    }
  },

  // ========== TOGGLE ATIVIDADE (OTIMISTA) ==========
  toggleActivity: async (groupId: string, activityId: string) => {
    // 1. Busca atividade atual
    const group = get().groups.find((g) => g.id === groupId);
    const activity = group?.activities.find((a) => a.id === activityId);
    if (!activity) {
      console.error("❌ Atividade não encontrada:", activityId);
      return;
    }

    // ✅ Garante que completed existe
    const currentCompleted = activity.completed ?? false;

    // 2. ✅ ATUALIZA ESTADO IMEDIATAMENTE (UI muda na hora!)
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              activities: g.activities.map((a) =>
                a.id === activityId
                  ? { ...a, completed: !currentCompleted } // ← Usa valor garantido
                  : a
              ),
            }
          : g
      ),
    }));

    // 3. Sincroniza com backend (background)
    try {
      await activityApi.update(
        groupId,
        activityId,
        activity.description,
        activity.deliveryDate,
        !currentCompleted // ← Usa valor garantido
      );
      console.log("Atividade sincronizada com backend");
    } catch (error) {
      console.error("Erro ao alternar atividade:", error);

      // 4. Reverte se falhar
      set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                activities: g.activities.map((a) =>
                  a.id === activityId
                    ? { ...a, completed: currentCompleted } // ← Reverte para valor original
                    : a
                ),
              }
            : g
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
      groups: state.groups.map((g) => {
        if (g.id === sourceGroupId) {
          // Remove do grupo de origem
          return {
            ...g,
            activities: g.activities?.filter((a) => a.id !== activityId) || [],
          };
        }
        if (g.id === targetGroupId) {
          // Adiciona ao grupo de destino
          return {
            ...g,
            activities: [...(g.activities || []), activity],
          };
        }
        return g;
      }),
    }));

    // Sincroniza com backend (background)
    try {
      await activityApi.move(activityId, targetGroupId);
      console.log("Atividade movida com sucesso");
    } catch (error) {
      console.error(" Erro ao mover atividade:", error);
      // Reverte buscando tudo do backend
      get().fetchGroups();
    }
  },
}));
