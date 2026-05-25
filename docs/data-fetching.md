# Data Fetching

## Rules

1. **Server Components only** — fetch data exclusively in async Server Components. Never use route handlers (`app/api/`) or client components (`"use client"`) for data fetching.
2. **No raw SQL** — all database queries go through a Drizzle helper function. Never write raw SQL strings.
3. **User-scoped queries always** — every query must filter by the authenticated user's ID. Never fetch data without a `userId` constraint.

## Auth

Get the current user at the top of any Server Component that fetches data. Throw (or redirect) if unauthenticated — never pass `userId` as a prop from a client component.

```ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getSomeData(session.user.id);
  // ...
}
```

## Query Helpers

All queries live in `src/lib/db/queries/`. Each helper accepts `userId` as its first argument and enforces it in the `where` clause — this is the single enforcement point for data isolation.

```ts
// src/lib/db/queries/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(userId: string, workoutId: string) {
  const rows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.id, workoutId)));
  return rows[0] ?? null;
}
```

**Rules for query helpers:**

- Always include `eq(table.userId, userId)` in every `where` clause.
- When fetching a single record by ID, combine both conditions with `and()` — never look up by ID alone.
- Return `null` (not throw) when a record isn't found; let the caller decide how to handle it.
- Never accept `userId` from client input (form data, URL params) — always derive it from the server-side session.

## File Structure

```
src/
  app/
    workouts/
      page.tsx          ← async Server Component, calls query helper
  lib/
    db/
      index.ts          ← Drizzle client
      schema.ts         ← table definitions
      queries/
        workouts.ts     ← query helpers for workouts
        exercises.ts    ← query helpers for exercises
```

## What Not To Do

```ts
// BAD: route handler for data fetching
// app/api/workouts/route.ts
export async function GET() { ... }

// BAD: fetching in a client component
"use client";
useEffect(() => { fetch("/api/workouts") }, []);

// BAD: raw SQL
await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);

// BAD: no userId filter
export async function getAllWorkouts() {
  return db.select().from(workouts); // exposes all users' data
}

// BAD: userId from URL params without session check
export async function getWorkout(userId: string, workoutId: string) {
  // if userId comes from params, a user can pass anyone's ID
}
```
