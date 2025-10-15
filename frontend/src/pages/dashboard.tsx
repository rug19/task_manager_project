import { useState, useEffect } from "react";
import Header from "../components/header";
import type { Activity } from "../types/types";
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
import { useGroupStore } from "../store/useGroupStore";

export default function Dashboard() {
  const { groups, isLoading, fetchGroups, moveActivityToGroup } = useGroupStore();
  const createGroup = useGroupStore((state) => state.createGroup);
  const [creating, setCreating] = useState(false);
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
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (title: string) => {
    try {
      await createGroup(title);
      setCreating(false);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  //  Quando começa a arrastar
   const handleDragStart = (event: DragStartEvent) => {
    const activityId = event.active.id as string;
    const activity = groups
      .flatMap((g) => g.activities || [])
      .find((a) => a.id === activityId);

    setActiveActivity(activity || null);
  };

  //  Quando termina de arrastar
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveActivity(null);

    if (!over) return;

    const activityId = active.id as string;
    const targetId = over.id as string;

    // Encontra grupo de origem
    const sourceGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === activityId)
    );
    if (!sourceGroup) return;

    // Encontra grupo de destino
    let targetGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === targetId)
    );
    if (!targetGroup) {
      targetGroup = groups.find((g) => g.id === targetId);
    }
    if (!targetGroup) return;

    //Reordenar no mesmo grupo (só UI, não persiste)
    if (sourceGroup.id === targetGroup.id) {
      const activities = sourceGroup.activities || [];
      const oldIndex = activities.findIndex((a) => a.id === activityId);
      const newIndex = activities.findIndex((a) => a.id === targetId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(activities, oldIndex, newIndex);
        
        // Atualiza estado local (não chama backend)
        useGroupStore.setState((state) => ({
          groups: state.groups.map((g) =>
            g.id === sourceGroup.id ? { ...g, activities: reordered } : g
          ),
        }));
      }
      return;
    }

    //Mover para outro grupo 
    await moveActivityToGroup(sourceGroup.id, targetGroup.id, activityId);
  };

  // Quando cancela o drag
  const handleDragCancel = () => {
    setActiveActivity(null);
  };

  if (isLoading) {
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
                <GroupCard group={group} />
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
