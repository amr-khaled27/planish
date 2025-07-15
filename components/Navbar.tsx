import { ListChecks } from "lucide-react";
import SignInButton from "./SignInButton";

export default function Navbar() {
  return (
    <div className="w-full p-4 bg-white/10 backdrop-blur-sm fixed top-0 left-0 shadow-sm z-50 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <ListChecks className="inline-block mr-2 text-3xl text-accent" />
          <span className="text-accent">Planish</span>
        </h1>
      </div>

      <div>
        <SignInButton />
      </div>
    </div>
  );
}
