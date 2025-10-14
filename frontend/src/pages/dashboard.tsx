import { useState } from "react";
import Header from "../components/header";
import GroupCard from "../components/groupCard";
import IconButton from "../components/button";
import type { Activity } from "../components/activityCard";
import { createGroup } from "../service/groupService";

type Group = {
  id: string;
  title: string;
  activities: Activity[];
};

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [creating, setCreating] = useState(false);

  async function addGroup(title: string) {
    try {
      const newGroup = await createGroup(title);
      setGroups([
        ...groups,
        { ...newGroup, activities: newGroup.activities ?? [] },
      ]);
      setCreating(false);
    } catch (er) {
      console.log("Erro ao criar grupo", er);
      alert("Erro ao criar grupo!");
    }
  }

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

  function updateGroupTitle(groupId: string, newTitle: string) {
    setGroups((groups) =>
      groups.map((group) =>
        group.id === groupId ? { ...group, title: newTitle } : group
      )
    );
  }

  return (
    <div>
      <Header />
      <div className="flex gap-10 p-8">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            title={group.title}
            activities={group.activities}
            onAddActivity={(activity) => addActivityToGroup(group.id, activity)}
            onUpdateActivity={(id, newValue) =>
              updateActivityInGroup(group.id, id, newValue)
            }
            onUpdateTitle={(newTitle) => updateGroupTitle(group.id, newTitle)}
          />
        ))}
        {creating ? (
          <GroupCard onCreate={addGroup} />
        ) : (
          <IconButton
            label="Novo Grupo +"
            onClick={() => setCreating(true)}
            className="bg-[#efedee] text-blue-700 font-semibold text-[18px] h-12 p-5 flex w-[18%] items-center border border-[#b3b2b2] "
            icon={false}
          />
        )}
      </div>
    </div>
  );
}
