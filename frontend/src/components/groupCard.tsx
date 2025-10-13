import { useState } from "react";
import ActivityCard from "./activityCard";

type GroupsCard = {
  title?: string;
  onCreate?: (title: string) => void;
};

export default function GroupCard({ title, onCreate }: GroupsCard) {
  const [input, setInput] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  function handleCreate() {
    if (input.trim() && onCreate) {
      onCreate(input);
      setInput("");
    }
  }

  function handleAddActivity(activity: string) {
    setActivities([...activities, activity]);
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
      <h2 className="bg-[#320df1] text-white h-12 flex items-center text-[18px] font-bold pl-5">
        {title}
      </h2>
      <div className="p-3">
        <ActivityCard
          activities={activities}
          onAddActivity={handleAddActivity}
        />
      </div>
    </div>
  );
}
