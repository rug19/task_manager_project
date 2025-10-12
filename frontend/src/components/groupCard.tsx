import { useState } from "react";
import IconButton from "./button";

export default function GroupCard({
  title,
  onCreate,
}: {
  title?: string;
  onCreate?: (title: string) => void;
}) {
  const [input, setInput] = useState("");

  function handleCreate() {
    if (input.trim() && onCreate) {
      onCreate(input);
      setInput("");
    }
  }

  if (onCreate && !title) {
    // Creating the card
    return (
      <div className="bg-[#320df1]  h-12 flex justify-center borde-none text-[18px] font-bold w-[18%]">
        <input
          type="text"
          placeholder="Nome do Grupo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="border-none   text-white ml-4 focus:border-none hover:border-none focus:outline-none pl-6"
          autoFocus
        />
      </div>
    );
  }

  // Card already created
  return (
    <div className="bg-[#efedee] border border-[#b3b2b2] w-[18%]">
      <h2 className="bg-[#320df1] text-white  h-12 flex justify-start items-center borde-none text-[18px] font-bold pl-5">
        {title}
      </h2>
      <div className="p-3">
        <IconButton
          label="Novo Card +"
          icon={false}
          className="font-semibold text-blue-700 text-[18px]"
        />
      </div>
    </div>
  );
}
