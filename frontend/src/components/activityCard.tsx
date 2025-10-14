import { memo } from "react"; // ← Import do memo

import Modal from "./modal";
import IconButton from "./button";
import { useActivityCard } from "../hooks/useActivityCard";

export type Activity = {
  id: string;
  description: string;
};

type ActivityCardProps = {
  activities: Activity[];
  onAddActivity?: (activity: Activity) => void;
  onUpdateActivity?: (id: string, newValue: string) => void;
};

const ActivityCard = memo(function ActivityCard({
  activities,
  onAddActivity,
  onUpdateActivity,
}: ActivityCardProps) {
  const {
    creatingActivityModal,
    activityInput,
    editingActivity,
    setCreatingActivityModal,
    setActivityInput,
    setEditingActivity,
    handleAddActivity,
    handleEditActivity,
    handleUpdateActivity,
  } = useActivityCard();

  return (
    <div>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white border  p-2 mb-2 text-black font-semibold cursor-pointer"
          onClick={() => handleEditActivity(activity.id, activities)}
        >
          {activity.description}
        </div>
      ))}
      {/* Modal to create an activity */}
      <Modal
        isOpen={creatingActivityModal}
        onClose={() => setCreatingActivityModal(false)}
      >
        <textarea
          placeholder="Descrição da atividade"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-4 mt-4  focus:outline-none"
          rows={3}
        />
        <div className="flex justify-center gap-2">
          <IconButton
            label="Salvar"
            className="bg-blue-600 text-white px-4 py-2 rounded  "
            onClick={() => handleAddActivity(onAddActivity)}
          />
        </div>
      </Modal>
      {/* Modal to update an activity */}
      <Modal
        isOpen={editingActivity !== null}
        onClose={() => setEditingActivity(null)}
      >
        <textarea
          placeholder="Editar descrição da atividade"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-4 mt-4 focus:outline-none"
          rows={3}
        />
        <div className="flex justify-center gap-2">
          <IconButton
            label="Salvar"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleUpdateActivity(onUpdateActivity)}
          />
        </div>
      </Modal>

      <IconButton
        onlyIcon={false}
        label="Novo Card +"
        className="font-semibold text-blue-700 text-[18px]"
        onClick={() => setCreatingActivityModal(true)}
      />
    </div>
  );
});

export default ActivityCard;
