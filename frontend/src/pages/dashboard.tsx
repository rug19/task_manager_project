import Header from "../components/header";
import GroupCard from "../components/groupCard";
import IconButton from "../components/button";
import { useDashboardState } from "../hooks/useDashboardState";

export default function Dashboard() {
  const {
    groups,
    creating,
    setCreating,
    addGroup,
    addActivityToGroup,
    updateActivityInGroup,
    updateGroupTitle,
  } = useDashboardState();

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
