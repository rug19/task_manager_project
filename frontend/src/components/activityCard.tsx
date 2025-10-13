import { useState } from "react";
import Modal from "./modal";
import IconButton from "./button";

type ActivityCardProps = {
  activities: string[];
  onAddActivity: (activity: string) => void;
};

export default function ActivityCard({
  activities,
  onAddActivity,
}: ActivityCardProps) {
  const [creatingActivity, setCreatingActivity] = useState(false);
  const [activityInput, setActivityInput] = useState("");

  function handleAddActivity() {
    if (activityInput.trim()) {
      onAddActivity(activityInput);
      setActivityInput("");
      setCreatingActivity(false);
    }
  }
  return (
    <div>
      {activities.map((activity, idx) => (
        <div
          key={idx}
          className="bg-white border  p-2 mb-2 text-black font-semibold"
        >
          {activity}
        </div>
      ))}
      {creatingActivity ? (
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
      ) : (
        <IconButton
          onlyIcon={false}
          label="Novo Card +"
          className="font-semibold text-blue-700 text-[18px]"
          onClick={() => setCreatingActivity(true)}
        />
      )}
    </div>
  );
}
