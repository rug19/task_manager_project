import Modal from "./modal";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  setValue: (v: string) => void;
  dateValue?: string;
  setDateValue?: (v: string) => void;
  showDateInput?: boolean;
  setShowDateInput?: (v: boolean) => void;
  onSave: () => void;
  loading?: boolean;
  label?: string;
  showDateButton?: boolean;
}

export function ActivityModal({
  isOpen,
  onClose,
  value,
  setValue,
  dateValue,
  setDateValue,
  showDateInput,
  setShowDateInput,
  onSave,
  loading,
  showDateButton = false,
}: ActivityModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 mt-2">
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Digite a descrição da atividade..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
            rows={3}
            autoFocus
          />
        </div>
        {showDateInput && setDateValue && dateValue !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Entrega
            </label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
              title="text"
            />
          </div>
        )}
        <div className="flex gap-7 justify-center">
          {showDateButton && setShowDateInput && (
            <button
              onClick={() => setShowDateInput(!showDateInput)}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white cursor-pointer"
              type="button"
            >
              Data de Entrega
            </button>
          )}
          <button
            onClick={onSave}
            disabled={!value.trim() || loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors bg-[#320df1] text-white cursor-pointer`}
            type="button"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}