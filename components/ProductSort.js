"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

import { SORT_OPTIONS } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProductSort({ value = "recent" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortOption =
    SORT_OPTIONS.find((option) => option.value === value) || SORT_OPTIONS[0];

  function handleSortChange(newSort) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (newSort === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-gray-600 outline-none transition-colors hover:bg-orange-50 hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <ArrowUpDown className="h-4 w-4 text-gray-400 transition-colors group-hover:text-orange-500" />

          <span className="hidden text-xs font-medium text-gray-400 sm:inline">
            Sort by
          </span>

          <span className="text-sm font-medium text-gray-800 transition-colors group-hover:text-orange-600">
            {currentSortOption.label}
          </span>

          <ChevronDown className="h-3.5 w-3.5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
      >
        {SORT_OPTIONS.map((option) => {
          const selectedOption = option.value === currentSortOption.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
                selectedOption
                  ? "bg-orange-50 font-medium text-orange-600 focus:bg-orange-50 focus:text-orange-600"
                  : "text-gray-600 focus:bg-gray-50 focus:text-gray-900"
              }`}
            >
              <span className="flex-1">{option.label}</span>

              {selectedOption && <Check className="h-4 w-4 text-orange-500" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
