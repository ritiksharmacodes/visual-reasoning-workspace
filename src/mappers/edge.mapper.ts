import type { Edge } from "@xyflow/react";
import { fetch_workspace_data } from "@/actions";

export type DbEdge =
  Awaited<
    ReturnType<typeof fetch_workspace_data>
  >["edges"][number];

export function mapDbEdgeToReactFlowEdge(dbEdge: DbEdge): Edge {
  return {
    id: dbEdge.id,
    source: dbEdge.source_node_id,
    target: dbEdge.target_node_id,
  };
}