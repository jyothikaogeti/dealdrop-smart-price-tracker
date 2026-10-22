import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination({ page, totalPages, createPageUrl }) {
  return (
    <div className="flex justify-center items-center gap-3 mt-10">
      {page > 1 ? (
        <Link href={createPageUrl(page - 1)}>
          <Button
            variant="ghost"
            className="bg-orange-50 text-orange-500 rounded-full transition-colors gap-2 px-4 hover:bg-orange-500 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button
          variant="ghost"
          className="bg-gray-100 text-gray-400 rounded-full gap-2 px-4"
          disabled
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
      )}

      <span className="bg-orange-100 text-orange-600 text-sm font-medium rounded-full px-4 py-2">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={createPageUrl(page + 1)}>
          <Button
            variant="ghost"
            className="bg-orange-50 text-orange-500 rounded-full transition-colors gap-2 px-4 hover:bg-orange-500 hover:text-white"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="ghost"
          className="bg-gray-100 text-gray-400 rounded-full gap-2 px-4"
          disabled
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
