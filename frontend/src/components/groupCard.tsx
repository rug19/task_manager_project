import { memo } from "react";
import { useGroupCard } from "../hooks/useGroupCard";
import ActivityCard from "./activityCard";
import type { Activity } from "./activityCard";

type GroupsCard = {
  title?: string;
  activities?: Activity[];
  onAddActivity?: (activity: Activity) => void;
  onUpdateActivity?: (id: string, newValue: string) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onCreate?: (title: string) => void;
};

const GroupCard = memo(function GroupCard({
  title,
  onCreate,
  activities = [],
  onAddActivity,
  onUpdateActivity,
  onUpdateTitle,
}: GroupsCard) {
  const {
    input,
    editing,
    newTitle,
    setInput,
    setNewTitle,
    handleCreate,
    handleUpdateTitle,
    startEditing,
    cancelEditing,
    handleKeyDown,
  } = useGroupCard(title);

  // Modo criação de grupo
  if (onCreate && !title) {
    return (
      <div className="bg-[#320df1] h-12 flex justify-center text-[18px] font-bold w-64">
        <input
          type="text"
          placeholder="Nome do Grupo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, () => handleCreate(onCreate))}
          className="border-none text-white ml-4 focus:border-none hover:border-none focus:outline-none pl-6 bg-transparent"
          autoFocus
          maxLength={50}
        />
      </div>
    );
  }

  // Grupo existente
  return (
    <div className="bg-[#efedee] border border-[#b3b2b2] w-64">
      <h2
        className="bg-[#320df1] text-white h-12 flex items-center text-[18px] font-bold pl-5 cursor-pointer "
        onClick={startEditing}
        onDoubleClick={cancelEditing}
        title="Clique para editar o nome do grupo"
      >
        {editing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, () => handleUpdateTitle(onUpdateTitle))
            }
            onBlur={() => handleUpdateTitle(onUpdateTitle)}
            className="border-none text-white w-full focus:outline-none bg-transparent"
            autoFocus
            maxLength={50}
            aria-label="Editar nome do grupo"
          />
        ) : (
          <span className="truncate">{newTitle}</span>
        )}
      </h2>

      <div className="p-3">
        <ActivityCard
          activities={activities}
          onAddActivity={onAddActivity}
          onUpdateActivity={onUpdateActivity}
        />
      </div>
    </div>
  );
});

export default GroupCard;
