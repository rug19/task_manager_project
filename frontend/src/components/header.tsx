import { MdNotifications, MdSearch } from "react-icons/md";
import IconButton from "./button";
import { useDelayedCount } from "../hooks/useDelayedCount";

export default function Header() {
  const delayedCount = useDelayedCount();
  return (
    <header className="bg-[#5f55c6] h-12 flex justify-between items-center p-2 w-[100%">
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Localizar Atividade"
            className="border-none rounded text-white p-1 bg-[#b8b4e6] font-semibold font-sans pl-3 focus:border-none focus:outline-none focus:text-white"
          />
          <IconButton
            icon={<MdSearch size={25} />}
            onlyIcon={true}
            className="absolute left-44 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>

      <div className="relative flex flex-col items-center ">
        <IconButton icon={<MdNotifications size={30} />} onlyIcon={true} />
        {delayedCount > 0 && (
          <div className="bg-white top-8 absolute w-37 mr-27 p-2 border border-[#b3b2b2] rounded shadow-lg">
            <p className="text-xs font-semibold text-gray-800">
              Existe(m) {delayedCount} atividade{delayedCount > 1 ? '(s)' : ''} com atraso na entrega
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
