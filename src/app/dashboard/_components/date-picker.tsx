"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"));
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
      ? "st"
      : day % 10 === 2
      ? "nd"
      : day % 10 === 3
      ? "rd"
      : "th";
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

export function DatePicker({ selected }: { selected: Date }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
        <CalendarIcon className="h-4 w-4" />
        {formatDate(selected)}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
