import { AssignmentsClient } from "@/components/assignments/AssignmentsClient";
import { getAssignments } from "@/lib/api";

export const metadata = {
  title: "Device Assignments | Admin",
  description: "Manage device assignment records",
};

/**
 * Server Component — fetches initial data server-side.
 * Mutations are handled via Server Actions (lib/actions.ts),
 * which call revalidatePath() to re-trigger this fetch.
 */
export default async function AssignmentsPage() {
  let assignments = await getAssignments().catch(() => [] as Awaited<ReturnType<typeof getAssignments>>);
  // Normalize: API might return array directly or wrapped object
  // TODO: remove normalization once actual response shape is confirmed
  if (!Array.isArray(assignments)) {
    assignments = (assignments as { items?: typeof assignments }).items ?? [];
  }

  return <AssignmentsClient initialAssignments={assignments} />;
}

// deploy test