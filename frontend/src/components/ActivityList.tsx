import { useState } from "react";
import { ActivityItem } from "./ActivityItem";
import type { Activity } from "../types/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useGroupStore } from "../store/useGroupStore";
import { ActivityModal } from "./activityModal";

interface ActivityListProps {
  groupId: string;
  activities: Activity[];
}

export function ActivityList({ groupId, activities }: ActivityListProps) {
  const [newActivity, setNewActivity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateValue, setDateValue] = useState("");

  const { createActivity } = useGroupStore();

  // Drop zone para aceitar cards de outros grupos
  const { setNodeRef } = useDroppable({
    id: groupId,
  });

  const handleAdd = async () => {
    if (!newActivity.trim()) return;
    await createActivity(groupId, newActivity, dateValue || undefined);
    setNewActivity("");
    setDateValue("");
    setShowDateInput(false);
    setIsModalOpen(false);
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
            groupId={groupId}
            key={activity.id}
            id={activity.id}
            description={activity.description}
            completed={activity.completed}
            deliveryDate={activity.deliveryDate}
          />
        ))}
      </SortableContext>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-2 text-start font-semibold text-[18px] text-[#320df1] cursor-pointer"
      >
        Novo Card +
      </button>

      {/* Modal para adicionar atividade */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        value={newActivity}
        setValue={setNewActivity}
        dateValue={dateValue}
        setDateValue={setDateValue}
        showDateInput={showDateInput}
        setShowDateInput={setShowDateInput}
        onSave={handleAdd}
        showDateButton={true}
      />
    </div>
  );
}
