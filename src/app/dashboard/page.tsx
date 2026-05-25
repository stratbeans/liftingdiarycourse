"use client";

import { useState } from "react";
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

// Placeholder workout data — replace with real data fetching later
const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: "80kg",
  },
  {
    id: 2,
    name: "Squat",
    sets: 5,
    reps: 5,
    weight: "120kg",
  },
  {
    id: 3,
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: "140kg",
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm text-muted-foreground">Showing workouts for</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
            <CalendarIcon className="h-4 w-4" />
            {formatDate(selectedDate)}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setOpen(false);
                }
              }}

            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {MOCK_WORKOUTS.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          MOCK_WORKOUTS.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="font-medium">{workout.name}</p>
                <p className="text-sm text-muted-foreground">
                  {workout.sets} sets × {workout.reps} reps
                </p>
              </div>
              <span className="text-sm font-medium">{workout.weight}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
