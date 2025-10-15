import { useState } from "react";
import { ActivityItem } from "./ActivityItem";
import type { Activity } from "../types/types";
import Modal from "./modal";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ActivityListProps {
  groupId: string;
  activities: Activity[];
  onAdd: (description: string) => Promise<void>;
  onUpdate: (
    activityId: string,
    description: string,
    deliveryDate?: string
  ) => Promise<void>;
  onDelete: (activityId: string) => Promise<void>;
  onToggle: (activityId: string) => Promise<void>;
}

export function ActivityList({
  groupId,
  activities,
  onAdd,
  onUpdate,
  onDelete,
  onToggle,
}: ActivityListProps) {
  const [newActivity, setNewActivity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drop zone para aceitar cards de outros grupos
  const { setNodeRef } = useDroppable({
    id: groupId,
  });

  const handleAdd = async () => {
    if (!newActivity.trim()) return;

    try {
      await onAdd(newActivity.trim());
      setNewActivity("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleCloseModal = () => {
    setNewActivity("");
    setIsModalOpen(false);
  };

  return (
    <div ref={setNodeRef} className="space-y-2">
      <SortableContext
        items={activities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* Lista de atividades */}
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            id={activity.id}
            description={activity.description}
            completed={activity.completed}
            deliveryDate={activity.deliveryDate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </SortableContext>

      {/* Botão para abrir modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-2 text-start font-semibold text-[18px] text-[#320df1] cursor-pointer"
      >
        Novo Card +
      </button>

      {/* Modal para adicionar atividade */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-4 mt-4">
          <div>
            <textarea
              id="activity-description"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite a descrição da atividade..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
              rows={3}
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleAdd}
              disabled={!newActivity.trim()}
              className="px-4 py-2 bg-[#320df1] text-white rounded-lg  font-medium cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
