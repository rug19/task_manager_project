import { useState } from "react";
import Modal from "./modal";
import IconButton from "./button";

export type Activity = {
  id: string;
  description: string;
};

type ActivityCardProps = {
  activities: Activity[];
  onAddActivity?: (activity: Activity) => void;
  onUpdateActivity?: (id: string, newValue: string) => void;
};

export default function ActivityCard({
  activities,
  onAddActivity,
  onUpdateActivity,
}: ActivityCardProps) {
  const [creatingActivity, setCreatingActivity] = useState(false);
  const [activityInput, setActivityInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleAddActivity() {
    if (activityInput.trim() && onAddActivity) {
      onAddActivity({ id: crypto.randomUUID(), description: activityInput });
      setActivityInput("");
      setCreatingActivity(false);
    }
  }

  function handleEditActivity(id: string) {
    const activity = activities.find((a) => a.id === id);
    
    if (activity) {
      setEditingId(id);
      setActivityInput(activity.description);
    }
  }

  function handleUpdateActivity() {
    if (activityInput.trim() && editingId !== null && onUpdateActivity) {
      onUpdateActivity(editingId, activityInput);
      setEditingId(null);
      setActivityInput("");
    }
  }

  return (
    <div>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white border  p-2 mb-2 text-black font-semibold cursor-pointer"
          onClick={() => handleEditActivity(activity.id)}
        >
          {activity.description}
        </div>
      ))}
      {/* Modal to create an activity */}
      <Modal
        isOpen={creatingActivity}
        onClose={() => setCreatingActivity(false)}
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
            onClick={handleAddActivity}
          />
        </div>
      </Modal>
      {/* Modal to update an activity */}
      <Modal isOpen={editingId !== null} onClose={() => setEditingId(null)}>
        <textarea
          placeholder="Editar descrição da atividade"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-4 mt-4 focus:outline-none"
          rows={3}
        />
        <div className="flex justify-center gap-2">
          <IconButton
            label="Salvar edição"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpdateActivity}
          />
        </div>
      </Modal>

      <IconButton
        onlyIcon={false}
        label="Novo Card +"
        className="font-semibold text-blue-700 text-[18px]"
        onClick={() => setCreatingActivity(true)}
      />
    </div>
  );
}
