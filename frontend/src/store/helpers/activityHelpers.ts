import type { Group, Activity } from "../../types/types";


//Funcoes para atualizar o estado local do frontend (no zustand) - Optimistic update
export function addActivityToGroup(
  groups: Group[],
  groupId: string,
  activity: Activity
): Group[] {
  return groups.map((g) =>
    g.id === groupId
      ? { ...g, activities: [...(g.activities || []), activity] }
      : g
  );
}

export function updateActivityInGroup(
  groups: Group[],
  groupId: string,
  updated: Activity
): Group[] {
  return groups.map((g) =>
    g.id === groupId
      ? {
          ...g,
          activities: g.activities.map((a) =>
            a.id === updated.id ? updated : a
          ),
        }
      : g
  );
}

export function deleteActivityInGroup(
  groups: Group[],
  groupId: string,
  activityId: string
): Group[] {
  return groups.map((g) =>
    g.id === groupId
      ? {
          ...g,
          activities: g.activities?.filter((a) => a.id !== activityId) || [],
        }
      : g
  );
}

export function toggleActivityInGroup(groups: Group[], groupId: string, activityId: string, completed: boolean): Group[] {
  return groups.map((g) =>
    g.id === groupId
      ? {
          ...g,
          activities: g.activities.map((a) =>
            a.id === activityId ? { ...a, completed } : a
          ),
        }
      : g
  );
}

export function moveActivityToGroupHelper(
  groups: Group[],
  sourceGroupId: string,
  targetGroupId: string,
  activity: Activity
): Group[] {
  return groups.map((g) => {
    if (g.id === sourceGroupId) {
      // Remove do grupo de origem
      return {
        ...g,
        activities: g.activities?.filter((a) => a.id !== activity.id) || [],
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
  });
}