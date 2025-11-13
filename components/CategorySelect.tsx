"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const categories = [
    { id: "physical", label: "Physical" },
    { id: "mental", label: "Mental" },
    { id: "career", label: "Career" },
    { id: "spiritual", label: "Spiritual" },
    { id: "learning", label: "Learning" },
    { id: "creative", label: "Creative" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
        <SelectGroup>
          <SelectLabel className="text-zinc-400">Categories</SelectLabel>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
