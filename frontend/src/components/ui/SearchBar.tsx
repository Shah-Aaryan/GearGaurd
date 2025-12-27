import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex items-center w-full max-w-md rounded-full bg-white shadow border border-gray-200">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-12 rounded-full border-none bg-transparent focus:ring-0 text-base"
        value={value}
        onChange={onChange}
        style={{ boxShadow: "none" }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
        tabIndex={-1}
        type="button"
      >
        <Filter className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
}
