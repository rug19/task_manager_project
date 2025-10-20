import { useState } from "react";
import { ActivityList } from "./ActivityList";
import { useGroupStore } from "../store/useGroupStore";

import { MdDelete } from "react-icons/md";
import type { Group } from "../types/types";
import { DeleteModal } from "./deleteModal";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const updateGroup = useGroupStore((state) => state.updateGroup);
  const deleteGroup = useGroupStore((state) => state.deleteGroup);

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(group?.title ?? "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!group) return null;

  const handleUpdateTitle = async () => {
    if (!title.trim()) return;
    setEditingTitle(false);
    await updateGroup(group.id, title);
  };

  const handleDeleteGroup = async () => {
    setIsDeleteModalOpen(true);
    await deleteGroup(group.id);
  };

  // Grupo existente
  return (
    <div className="bg-[#efedee] border border-[#b3b2b2] w-64">
      {/* Header do Grupo */}
      <div className="bg-[#320df1] text-white h-12 flex items-center justify-between px-4 cursor-pointer text-[20px] font-semibold">
        {editingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle();
              if (e.key === "Escape") setEditingTitle(false);
            }}
            className="bg-transparent text-white w-full focus:outline-none "
            autoFocus
            title="text"
          />
        ) : (
          <span onClick={() => setEditingTitle(true)} className="truncate">
            {group.title}
          </span>
        )}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-red-500"
          title="text"
        >
          <MdDelete size={20} />
        </button>
      </div>

      {/* Lista de Atividades */}
      <div className="p-3">
        <ActivityList groupId={group.id} activities={group.activities || []} />
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteGroup}
        title="Excluir Grupo"
        description={`Deseja realmente excluir?`}
      />
    </div>
  );
}
