import { useState } from "react";
import Modal from "./modal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdAccessTime, MdClose, MdDragIndicator } from "react-icons/md";
import { formatDate, isOverdue } from "../utils/dateHelpers";

interface ActivityItemProps {
  id: string;
  description: string;
  completed?: boolean;
  deliveryDate?: string;
  onUpdate: (
    id: string,
    description: string,
    deliveryDate?: string
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
}

export function ActivityItem({
  id,
  description,
  completed = false,
  deliveryDate,
  onUpdate,
  onDelete,
  onToggle,
}: ActivityItemProps) {
  const [editValue, setEditValue] = useState(description);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateInput, setShowDateInput] = useState(!!deliveryDate);
  const [dateValue, setDateValue] = useState(deliveryDate || "");

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

    try {
      await onUpdate(id, editValue.trim(), dateValue || undefined);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setEditValue(description);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar a atividade "${description}"?`
      )
    ) {
      try {
        await onDelete(id);
      } catch (error) {
        console.log(error);
        alert("Erro ao deletar atividade. Tente novamente.");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleModal(false);
    }
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
        className={`bg-white space-y-2  p-2 rounded border border-gray-200 group ${
          isDragging ? "shadow-lg z-50" : "hover:shadow-sm"
        } transition-all`}
      >
        <div className="flex items-center justify-start gap-1 ">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 text-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <MdDragIndicator size={20} />
          </div>
          <div className="flex flex-col   gap-2 flex-1">
            <div className="flex justify-between items-start">
              <span
                className={`flex-1 cursor-pointer ${
                  completed ? "line-through text-gray-400" : ""
                }`}
                onClick={() => handleModal(true)}
              >
                {description}
              </span>
              <button
                onClick={handleDelete}
                className="text-red-500  p-1 rounded transition-colors"
                title="Deletar atividade"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Exibe data de entrega */}
            {deliveryDate && (
              <div
                className={`flex items-center gap-2 text-xs p-1  w-[60%] py-1 rounded ${
                  completed ? "bg-green-100" : isOverdue(deliveryDate, completed) ? "bg-red-100" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => onToggle(id)}
                  className="cursor-pointer"
                  aria-label="Marcar atividade como concluída"
                />
                <MdAccessTime />
                <span>
                  {formatDate(deliveryDate)}
                  {isOverdue()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => handleModal(false)}>
        <div className="space-y-4 mt-2">
          <div>
            <label
              htmlFor="edit-activity-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Editar Atividade
            </label>
            <textarea
              id="edit-activity-description"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite a descrição da atividade..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none  resize-none"
              rows={3}
              autoFocus
            />
          </div>
          {showDateInput && (
            <div>
              <label
                htmlFor="delivery-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data de Entrega
              </label>
              <input
                type="date"
                id="delivery-date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          )}

          <div className="flex gap-7 justify-center">
            <button
              onClick={() => setShowDateInput(!showDateInput)}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white  cursor-pointer"
            >
              Data de Entrega
            </button>
            <button
              onClick={handleUpdate}
              disabled={!editValue.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors bg-[#320df1] text-white  cursor-pointer ${editValue.trim()}`}
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
