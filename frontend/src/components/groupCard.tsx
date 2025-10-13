import { useState } from "react";
import ActivityCard from "./activityCard";

type GroupsCard = {
  title?: string;
  onCreate?: (title: string) => void;
};

export default function GroupCard({ title, onCreate }: GroupsCard) {
  const [input, setInput] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title || "");

  function handleCreate() {
    if (input.trim() && onCreate) {
      onCreate(input);
      setInput("");
    }
  }

  function handleUpdateTitleGroup() {
    if (newTitle.trim()) {
      setEditing(false);
    }
  }

  function handleAddActivity(activity: string) {
    setActivities([...activities, activity]);
  }

  //Function to update a specific activity in array activity
  function handleUpdateActivity(idx: number, newValue: string) {
    setActivities((acts) => acts.map((act, i) => (i === idx ? newValue : act)));
  }

  if (onCreate && !title) {
    // Creating the card
    return (
      <div className="bg-[#320df1] h-12 flex justify-center text-[18px] font-bold w-64">
        <input
          type="text"
          placeholder="Nome do Grupo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="border-none text-white ml-4 focus:border-none hover:border-none focus:outline-none pl-6"
          autoFocus
        />
      </div>
    );
  }

  // Card already created
  return (
    <div className="bg-[#efedee] border border-[#b3b2b2] w-64">
      <h2
        className="bg-[#320df1] text-white h-12 flex items-center text-[18px] font-bold pl-5 "
        onClick={() => setEditing(true)}
      >
        {/* Logic to update the title */}
        {editing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitleGroup()}
            className="border-none text-white w-full focus:outline-none"
            autoFocus
            aria-label="Editar nome do grupo"
          />
        ) : (
          newTitle
        )}
      </h2>
      <div className="p-3">
        <ActivityCard
          activities={activities}
          onAddActivity={handleAddActivity}
          onUpdateActivity={handleUpdateActivity}
        />
      </div>
    </div>
  );
}
