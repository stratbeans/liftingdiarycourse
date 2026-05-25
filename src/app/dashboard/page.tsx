import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsForDate } from "@/db/queries/workouts";
import { DatePicker } from "./_components/date-picker";

type ExerciseSummary = {
  workoutExerciseId: string;
  exerciseName: string;
  setCount: number;
};

function groupByExercise(
  rows: Awaited<ReturnType<typeof getWorkoutsForDate>>
): ExerciseSummary[] {
  const map = new Map<string, ExerciseSummary>();
  for (const row of rows) {
    if (!map.has(row.workoutExerciseId)) {
      map.set(row.workoutExerciseId, {
        workoutExerciseId: row.workoutExerciseId,
        exerciseName: row.exerciseName,
        setCount: 0,
      });
    }
    map.get(row.workoutExerciseId)!.setCount += 1;
  }
  return Array.from(map.values());
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const rows = await getWorkoutsForDate(userId, selectedDate);
  const exercises = groupByExercise(rows);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm text-muted-foreground">Showing workouts for</span>
        <DatePicker selected={selectedDate} />
      </div>

      <div className="space-y-3">
        {exercises.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          exercises.map((exercise) => (
            <div
              key={exercise.workoutExerciseId}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <p className="font-medium">{exercise.exerciseName}</p>
              <span className="text-sm text-muted-foreground">
                {exercise.setCount} {exercise.setCount === 1 ? "set" : "sets"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
