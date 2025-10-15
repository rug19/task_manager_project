import { useMemo } from "react";
import { useGroupStore } from "../store/useGroupStore";

/**
 * Hook que calcula quantas atividades estão atrasadas
 * @returns número de atividades com data de entrega vencida e não concluídas
 */
export function useDelayedCount() {
  // Pega os grupos do Zustand
  const groups = useGroupStore((state) => state.groups);

  // Calcula a contagem so recalcula quando groups mudar
  const delayedCount = useMemo(() => {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;

    // Percorre todos os grupos
      groups.forEach((group) => {
      group.activities?.forEach((activity) => {
        if (activity.deliveryDate) {
          const [year, month, day] = activity.deliveryDate.split('-').map(Number);
          const deliveryDate = new Date(year, month - 1, day); 
          deliveryDate.setHours(0, 0, 0, 0);
          if (!activity.completed && deliveryDate < today) {
            count++;
          }
        }
      });
    });

    return count;
  }, [groups]); // ← Só recalcula quando groups mudar!

  return delayedCount;
}