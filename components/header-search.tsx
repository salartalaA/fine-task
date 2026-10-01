"use client";

import { Search } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export default function HeaderSearch() {
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  return (
    <div className="relative mx-2">
      <Input
        className="border-input bg-input text-xs"
        onChange={handleSearch}
        placeholder="جستجو ..."
        type="text"
        value={searchVal}
      />

      <span className="absolute top-1.5 left-1 rounded-full bg-input p-1 text-foreground">
        <Search size={16} />
      </span>
    </div>
  );
}
