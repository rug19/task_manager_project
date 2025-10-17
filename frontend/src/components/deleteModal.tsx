import Modal from "./modal";
import { MdDeleteForever } from "react-icons/md";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Excluir",
  description = "Tem certeza que deseja excluir?",
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 p-2">
        <MdDeleteForever size={48} className="text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  );
}
