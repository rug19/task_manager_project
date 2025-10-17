import { useState, useEffect } from "react";
import { useGroupStore } from "../store/useGroupStore";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { GroupCard } from "../components/groupCard";
import type { Activity } from "../types/types";
import Header from "../components/header";

export default function Dashboard() {
  const {
    groups,
    fetchGroups,
    createGroup,
    moveActivityToGroup,
    isLoading,
    searchTerm,
  } = useGroupStore();
  const [creating, setCreating] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredGroups = groups.map((group) => ({
    ...group,
    activities: group.activities?.filter((activity) =>
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) return;
    await createGroup(newGroupTitle);
    setNewGroupTitle("");
    setCreating(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activityId = event.active.id as string;
    const activity = groups
      .flatMap((g) => g.activities || [])
      .find((a) => a.id === activityId);
    setActiveActivity(activity || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveActivity(null);
    if (!over) return;

    const activityId = String(active.id);
    const targetId = String(over.id);

    const sourceGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === activityId)
    );
    let targetGroup = groups.find((g) =>
      g.activities?.some((a) => a.id === targetId)
    );
    if (!targetGroup) targetGroup = groups.find((g) => g.id === targetId);
    if (!sourceGroup || !targetGroup || sourceGroup.id === targetGroup.id)
      return;

    await moveActivityToGroup(sourceGroup.id, targetGroup.id, activityId);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 overflow-x-auto p-8 flex gap-6 items-start">
          {/* Grupos existentes */}
          {filteredGroups.map((group) => (
            <div key={group.id} className="flex-shrink-0">
              <GroupCard group={group} />
            </div>
          ))}

          {/* Criar novo grupo */}
          {creating ? (
            <div className="flex-shrink-0 w-64 bg-[#efedee]  border border-[#b3b2b2]">
              <input
                type="text"
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateGroup();
                  if (e.key === "Escape") setCreating(false);
                }}
                onBlur={() => setCreating(false)}
                placeholder="Nome do Grupo"
                className="w-full bg-[#320df1] h-12 text-white text-[20px] p-3 font-semibold border-0 focus:outline-none "
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex-shrink-0 h-12 w-64 text-[#320df1] bg-[#efedee] border border-[#b3b2b2] font-semibold text-[18px] cursor-pointer text-start pl-4"
            >
              Novo Grupo +
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeActivity && (
          <div className="bg-white p-3  shadow-2xl opacity-90 cursor-grabbing flex items-center gap-2">
            <span>{activeActivity.description}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
