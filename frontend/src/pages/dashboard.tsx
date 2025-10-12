import { useState } from "react";
import Header from "../components/header";
import GroupCard from "../components/groupCard";
import IconButton from "../components/button";


export default function Dashboard() {
  const [groups, setGroups] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  function addGroup(title: string) {
    setGroups([...groups, title]);
    setCreating(false);
  }

  return (
    <div>
      <Header />
      <div className="flex gap-10 p-8">
        {groups.map((title, idx) => (
          <GroupCard key={idx} title={title} />
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
