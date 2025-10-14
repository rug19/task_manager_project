import { useState, useEffect } from "react";
import { GroupCard } from "../components/GroupCard";
import Header from "../components/header";
import { groupApi } from "../services/api";
import type { Group } from "../types/types";

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 overflow-x-auto">
        <div
          className="flex gap-6 p-8  
 items-start"
        >
          {/* Grupos existentes */}
          {groups.map((group) => (
            <div className="flex-shrink-0">
              <GroupCard key={group.id} group={group} onUpdate={loadGroups} />
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
  );
}
