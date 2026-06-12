import type { Node } from "@xyflow/react";
import { fetch_nodes_of_workspace } from "@/actions";
import { db } from "@/db";

type DbNode = Awaited<ReturnType<typeof fetch_nodes_of_workspace>>[number];

export function mapDbNodeToReactFlowNode(
  dbNode: DbNode
): Node {
  return {
    id: dbNode.id,

    type: "conversation",

    position: {
      x: dbNode.x,
      y: dbNode.y,
    },

    width: dbNode.width,
    height: dbNode.height,

    style: {
      width: dbNode.width,
      height: dbNode.height,
    },

    data: {
      title: dbNode.title,
      summary: dbNode.summary,
      status: "saved",
      workspace_id: dbNode.workspace_id,
    },
  };
}