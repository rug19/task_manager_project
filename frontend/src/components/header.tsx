import { MdNotifications, MdSearch } from "react-icons/md";
import IconButton from "./button";

function test() {
  alert("funcionando");
}

export default function Header() {
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
            onClick={test}
          />
        </div>
      </div>
      <div>
        <IconButton icon={<MdNotifications size={30} />} onlyIcon={true} />
      </div>
    </header>
  );
}
