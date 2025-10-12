import type { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
  onlyIcon?: boolean;
}

export default function IconButton({ icon, label, onClick, className = "", onlyIcon = false }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={` cursor-pointer ${className}`}
      aria-label={label}
    >
      {icon}
      {!onlyIcon && label}
    </button>
  );
}