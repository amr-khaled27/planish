import { Search, Menu, LogOut } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AppNavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onMenuClick?: () => void;
}

export default function AppNavbar({
  searchTerm,
  setSearchTerm,
  onMenuClick,
}: AppNavbarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const { logout } = useAuth();

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  return (
    <nav className="p-2 shadow-sm bg-[#111827]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden hover:bg-white/10 p-2 rounded-lg transition-colors mr-2"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
        <form
          onSubmit={handleSearchSubmit}
          className="flex justify-center flex-1 max-w-md"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search Your Tasks"
            className="w-full px-4 sm:px-8 py-2 rounded-l-full bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-accent/80 text-white px-3 sm:px-4 p-2 rounded-r-full hover:bg-accent/50 transition-colors flex justify-center items-center"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </form>
        <div className="flex items-center">
          <button
            onClick={logout}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors ml-2 flex items-center text-white"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
