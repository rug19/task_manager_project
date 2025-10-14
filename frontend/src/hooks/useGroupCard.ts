import { useState, useCallback, useEffect } from "react";

export function useGroupCard(title?: string, onCancel?: () => void) {
  // ← Opcional agora
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title || "");

  // Sincroniza quando title prop muda
  useEffect(() => {
    if (title) {
      setNewTitle(title);
    }
  }, [title]);

  // Função para criar grupo
  const handleCreate = useCallback(
    async (onCreate?: (title: string) => void | Promise<void>) => {
      if (!input.trim() || !onCreate) return;

      try {
        await onCreate(input.trim());

        setInput("");
      } catch (error) {
        console.error("Erro ao criar grupo:", error);
      }
    },
    [input]
  );

  // Função para atualizar título
  const handleUpdateTitle = useCallback(
    (onUpdateTitle?: (newTitle: string) => void) => {
      if (newTitle.trim() && onUpdateTitle) {
        onUpdateTitle(newTitle.trim());
        setEditing(false);
      }
    },
    [newTitle]
  );

  // Iniciar edição
  const startEditing = useCallback(() => {
    setEditing(true);
  }, []);

  // Cancelar edição
  const cancelEditing = useCallback(() => {
    setEditing(false);
    setNewTitle(title || "");
  }, [title]);

  // Lidar com teclas
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (editing) {
        cancelEditing(); // ✅ Para modo edição
      } else {
        setInput("");
        if (onCancel) onCancel(); 
      }
    }
  }, [editing, cancelEditing, onCancel]);
  return {
    // States
    input,
    editing,
    newTitle,

    // Setters
    setInput,
    setNewTitle,
    setEditing, 

    // Handlers
    handleCreate,
    handleUpdateTitle,
    startEditing, 
    cancelEditing, 
    handleKeyDown, 
  };
}
