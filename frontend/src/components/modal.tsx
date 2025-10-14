import type { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import IconButton from "./button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80 relative">
        <IconButton
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
          onlyIcon={true}
          icon={<MdClose size={20} />}
        />
        {children}
      </div>
    </div>
  );
}