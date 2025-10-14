import { useState } from "react";
import Modal from "./Modal";

interface ActivityItemProps {
  id: string;
  description: string;
  completed?: boolean;
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
  onUpdate,
  onDelete,
  onToggle,
}: ActivityItemProps) {
  const [editValue, setEditValue] = useState(description);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async () => {
    if (!editValue.trim()) return;

    try {
      await onUpdate(id, editValue.trim());
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setEditValue(description); // Reverte em caso de erro
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setEditValue(description);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setEditValue(description);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow group">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggle(id)}
              className="cursor-pointer"
              title="Marcar como concluída"
              aria-label="Marcar atividade como concluída"
            />
            <span
              className={`flex-1 cursor-pointer ${
                completed ? "line-through text-gray-400" : ""
              }`}
              onClick={handleOpenModal}
            >
              {description}
            </span>
          </div>
          
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
              autoFocus
            />
          </div>

          <div className="flex gap-2 justify-center">
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
