import { useState, useEffect } from "react";
import Header from "../components/header";
import { activityApi, groupApi } from "../services/api";
import type { Activity, Group } from "../types/types";
import { GroupCard } from "../components/groupCard";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  // Sensor para drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Carregar grupos na inicialização
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await groupApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (title: string) => {
    try {
      const newGroup = await groupApi.create(title);
      setGroups((prev) => [...prev, newGroup]);
      setCreating(false);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  //  Quando começa a arrastar
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activityId = active.id as string;

    // Encontra a atividade que está sendo arrastada
    const activity = groups
      .flatMap((g) => g.activities || [])
      .find((a) => a.id === activityId);

    setActiveActivity(activity || null);
  };

  //  Quando termina de arrastar
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveActivity(null); // Limpa o overlay

    if (!over) return;

    const activityId = active.id as string;
    const targetId = over.id as string;

    const sourceGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === activityId)
    );

    if (!sourceGroup) return;

    let targetGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === targetId)
    );

    if (!targetGroup) {
      targetGroup = groups.find((g) => g.id === targetId);
    }

    if (!targetGroup) return;

    // CASO 1: Reordenação no mesmo grupo
    if (sourceGroup.id === targetGroup.id) {
      const activities = sourceGroup.activities || [];
      const oldIndex = activities.findIndex((a) => a.id === activityId);
      const newIndex = activities.findIndex((a) => a.id === targetId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(activities, oldIndex, newIndex);

        setGroups((prev) =>
          prev.map((g) =>
            g.id === sourceGroup.id ? { ...g, activities: reordered } : g
          )
        );
      }
      return;
    }

    // CASO 2: Mover para outro grupo
    const activity = sourceGroup.activities?.find((a) => a.id === activityId);
    if (!activity) return;

    // Atualiza estado local IMEDIATAMENTE
    setGroups((prev) =>
      prev.map((g) => {
        // Remove do grupo de origem
        if (g.id === sourceGroup.id) {
          return {
            ...g,
            activities: g.activities?.filter((a) => a.id !== activityId) || [],
          };
        }
        // Adiciona no grupo de destino
        if (g.id === targetGroup.id) {
          return {
            ...g,
            activities: [...(g.activities || []), activity],
          };
        }
        return g;
      })
    );

    // Chama API em background
    activityApi
      .update(targetGroup.id, activityId, activity.description)
      .catch((error) => {
        console.error("Erro ao mover atividade:", error);
        loadGroups();
      });
  };

  // Quando cancela o drag
  const handleDragCancel = () => {
    setActiveActivity(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 overflow-x-auto">
          <div
            className="flex gap-6 p-8  
 items-start"
          >
            {/* Grupos existentes */}
            {groups.map((group) => (
              <div key={group.id} className="flex-shrink-0">
                <GroupCard group={group} onUpdate={loadGroups} />
              </div>
            ))}

            {/* Botão/Input para criar grupo */}
            {creating ? (
              <div className="flex-shrink-0">
                <GroupCard
                  onCreate={handleCreateGroup}
                  onCancel={() => setCreating(false)}
                />
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setCreating(true)}
                  className=" flex-shrink-0 h-12 w-64 text-[#320df1]   bg-[#efedee] border border-[#b3b2b2]  font-semibold text-[18px] cursor-pointer text-start pl-4 mr-8"
                >
                  Novo Grupo +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeActivity ? (
          <div className="bg-white p-3 rounded-lg shadow-2xl opacity-90 cursor-grabbing">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg">⋮⋮</span>
              <span className="flex-1">{activeActivity.description}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
