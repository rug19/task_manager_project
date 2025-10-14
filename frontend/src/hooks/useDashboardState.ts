import { useState, useEffect } from "react";
import type { Activity } from "../components/activityCard";
import { createGroup, getGroups } from "../service/groupService";

export type Group = {
  id: string;
  title: string;
  activities: Activity[];
};

export function useDashboardState() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [creating, setCreating] = useState(false);

  //Groups Functions

  useEffect(() => {
    async function fetchGroups() {
      const data = await getGroups();
      setGroups(data);
    }
    fetchGroups();
  }, []);

  async function addGroup(title: string) {
    const newGroup = await createGroup(title);
    setGroups([
      ...groups,
      { ...newGroup, activities: newGroup.activities ?? [] },
    ]);
    setCreating(false);
  }

  function updateGroupTitle(groupId: string, newTitle: string) {
    setGroups((groups) =>
      groups.map((group) =>
        group.id === groupId ? { ...group, title: newTitle } : group
      )
    );
  }

  //Activity functions

  function addActivityToGroup(groupId: string, activity: Activity) {
    setGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? { ...group, activities: [...group.activities, activity] }
          : group
      )
    );
  }

  function updateActivityInGroup(
    groupId: string,
    activityId: string,
    newValue: string
  ) {
    setGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              activities: group.activities.map((act) =>
                act.id === activityId ? { ...act, description: newValue } : act
              ),
            }
          : group
      )
    );
  }

  return {
    groups,
    creating,
    setCreating,
    addGroup,
    addActivityToGroup,
    updateActivityInGroup,
    updateGroupTitle,
  };
}
