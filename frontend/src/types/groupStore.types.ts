import type { Group } from "./types";


export interface GroupStore {
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

  setSearchTerm: (term: string) => void;
}