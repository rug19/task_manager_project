import { useCallback, useState } from "react";
import type { Activity } from "../components/activityCard";

export function useActivityCard() {
  const [creatingActivityModal, setCreatingActivityModal] = useState(false); 
  const [activityInput, setActivityInput] = useState(""); 
  const [editingActivity, setEditingActivity] = useState<string | null>(null);

  const handleAddActivity = useCallback((onAddActivity?: (activity: Activity) => void) => {
    if (activityInput.trim() && onAddActivity) {
      onAddActivity({ id: crypto.randomUUID(), description: activityInput.trim() });
      setActivityInput("");
      setCreatingActivityModal(false);
    }
  }, [activityInput]);

  const handleEditActivity = useCallback((id: string, activities: Activity[]) => {
    const activity = activities.find((a) => a.id === id);
    
    if (activity) {
      setEditingActivity(id);
      setActivityInput(activity.description);
    }
  }, []);

  const handleUpdateActivity = useCallback((onUpdateActivity?: (id: string, newValue: string) => void) => {
    if (activityInput.trim() && editingActivity !== null && onUpdateActivity) {
      onUpdateActivity(editingActivity, activityInput.trim());
      setEditingActivity(null);
      setActivityInput("");
    }
  }, [activityInput, editingActivity]);

  return {
    // Estates
    creatingActivityModal,
    activityInput,
    editingActivity,
    
    // Setters
    setCreatingActivityModal,
    setActivityInput,
    setEditingActivity,
    
    // Handlers
    handleAddActivity,
    handleEditActivity,
    handleUpdateActivity,
  };
}