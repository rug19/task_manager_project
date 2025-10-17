import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdAccessTime, MdClose } from "react-icons/md";
import { formatDate, isOverdue } from "../utils/dateHelpers";
import { useGroupStore } from "../store/useGroupStore";
import { ActivityModal } from "./activityModal";
import { DeleteModal } from "./deleteModal";

interface ActivityItemProps {
  id: string;
  description: string;
  completed?: boolean;
  deliveryDate?: string;
  groupId: string;
}

export function ActivityItem({
  id,
  description,
  completed = false,
  deliveryDate,
  groupId,
}: ActivityItemProps) {
  const [editValue, setEditValue] = useState(description);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateInput, setShowDateInput] = useState(!!deliveryDate);
  const [dateValue, setDateValue] = useState(deliveryDate || "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { updateActivity, deleteActivity, toggleActivity } = useGroupStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdate = async () => {
    if (!editValue.trim()) return;
    await updateActivity(groupId, id, editValue, dateValue || undefined);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(true);
    await deleteActivity(groupId, id);
  };

  const handleModal = (open: boolean) => {
    setEditValue(description);
    setDateValue(deliveryDate || "");
    setShowDateInput(!!deliveryDate);
    setIsModalOpen(open);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white space-y-2  p-2 border border-[#b3b2b2] group ${
          isDragging ? "shadow-lg z-50" : "hover:shadow-sm"
        } transition-all`}
      >
        <div
          className="flex items-start justify-start gap-1 "
          {...attributes}
          {...listeners}
        >
          <div className="flex flex-col   gap-1 flex-1">
            <div className="flex justify-between items-start">
              <span
                className={`flex-1 cursor-pointer mt-1 font-[500] ${
                  completed ? "" : ""
                }`}
                onClick={() => handleModal(true)}
              >
                {description}
              </span>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-500  rounded transition-colors"
                title="Deletar atividade"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Exibe data de entrega */}
            {deliveryDate && (
              <div
                className={`flex items-center gap-2 text-xs p-1  w-[60%] py-1 rounded ${
                  completed
                    ? "bg-[#12c270]"
                    : isOverdue(deliveryDate, completed)
                    ? "bg-[#f00e0e]"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => toggleActivity(groupId, id)}
                  className="cursor-pointer"
                  aria-label="Marcar atividade como concluída"
                />
                <MdAccessTime />
                <span className=" text-gray-700 font-[500]">
                  {formatDate(deliveryDate)}
                  {isOverdue()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir atividade"
        description={`Deseja realmente excluir?`}
      />

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => handleModal(false)}
        value={editValue}
        setValue={setEditValue}
        dateValue={dateValue}
        setDateValue={setDateValue}
        showDateInput={showDateInput}
        setShowDateInput={setShowDateInput}
        onSave={handleUpdate}
        showDateButton={true}
      />
    </>
  );
}
