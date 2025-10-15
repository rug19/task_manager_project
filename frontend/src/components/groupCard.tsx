import { useState } from "react";
import { ActivityList } from "./ActivityList";
import { groupApi, activityApi } from "../services/api";
import type { Group } from "../types/types";

interface GroupCardProps {
  group?: Group;
  onCreate?: (title: string) => Promise<void>;
  onCancel?: () => void;
  onUpdate?: () => void;
}

export function GroupCard({
  group,
  onCreate,
  onCancel,
  onUpdate,
}: GroupCardProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(group?.title ?? "");
  const [groupInput, setGroupInput] = useState("");

  // ========== HANDLERS DE GRUPO ==========

  const handleCreateGroup = async () => {
    if (!groupInput.trim() || !onCreate) return;

    try {
      await onCreate(groupInput.trim());
      setGroupInput("");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const handleUpdateTitle = async () => {
    if (!title.trim() || !group) return;

    try {
      await groupApi.update(group.id, title.trim());
      setEditingTitle(false);
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      setTitle(group.title);
    }
  };

  const handleGroupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (group) {
        handleUpdateTitle();
      } else {
        handleCreateGroup();
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (editingTitle) {
        setTitle(group?.title ?? "");
        setEditingTitle(false);
      } else {
        setGroupInput("");
        onCancel?.();
      }
    }
  };

  // ========== HANDLERS DE ATIVIDADES ==========

  const handleAddActivity = async (description: string) => {
    if (!group) return;
    await activityApi.create(group.id, description);
    onUpdate?.();
  };

  const handleUpdateActivity = async (
    activityId: string,
    description: string
  ) => {
    if (!group) return;

    try {
      await activityApi.update(group.id, activityId, description);
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!group || !confirm("Deseja realmente excluir esta atividade?")) return;

    await activityApi.delete(group.id, activityId);
    onUpdate?.();
  };

  const handleToggleActivity = async (activityId: string) => {
    if (!group) return;

    await activityApi.toggle(group.id, activityId);
    onUpdate?.();
  };

 

  // Modo criação de grupo
  if (!group) {
    return (
      <div className="bg-[#320df1] h-12 flex justify-center text-[18px] font-bold w-64">
        <input
          type="text"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
          onKeyDown={handleGroupKeyDown}
          onBlur={onCancel}
          placeholder="Nome do Grupo"
          className="border-none text-white ml-4 focus:outline-none pl-6 bg-transparent placeholder-blue-200"
          autoFocus
          maxLength={50}
        />
      </div>
    );
  }

  // Grupo existente
  return (
    <div className="bg-[#efedee] border border-[#b3b2b2] w-64">
      {/* Header do Grupo */}
      <div
        className="bg-[#320df1] text-white h-12 flex items-center text-[18px] font-bold pl-5 cursor-pointer"
        onClick={() => !editingTitle && setEditingTitle(true)}
        title="Clique para editar o nome do grupo"
      >
        {editingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleGroupKeyDown}
            onBlur={handleUpdateTitle}
            className="border-none text-white w-full focus:outline-none bg-transparent"
            autoFocus
            maxLength={50}
            aria-label="Editar nome do grupo"
          />
        ) : (
          <span className="truncate">{title}</span>
        )}
      </div>

      {/* Lista de Atividades */}
      <div className="p-3">
        <ActivityList
          groupId={group.id}
          activities={group.activities || []}
          onAdd={handleAddActivity}
          onUpdate={handleUpdateActivity}
          onDelete={handleDeleteActivity}
          onToggle={handleToggleActivity}
        />
      </div>
    </div>
  );
}
