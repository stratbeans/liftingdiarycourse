import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function getWorkoutsForDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db
    .select({
      workoutId: workouts.id,
      workoutExerciseId: workoutExercises.id,
      orderIndex: workoutExercises.orderIndex,
      exerciseName: exercises.name,
      setId: sets.id,
      setNumber: sets.setNumber,
      weightKg: sets.weightKg,
      reps: sets.reps,
    })
    .from(workouts)
    .innerJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .innerJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.performedAt, startOfDay),
        lt(workouts.performedAt, endOfDay)
      )
    )
    .orderBy(workoutExercises.orderIndex, sets.setNumber);
}
