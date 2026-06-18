"use server"

import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import type { Node } from "@xyflow/react";
import { nodesTable } from "@/db/schema/nodes";
import { workspacesTable } from "@/db/schema/workspaces";
import { edgesTable } from "./db/schema/edges";


export async function fetch_workspace_data(workspace_uuid: string) {
  const [workspace, nodes, edges] =
    await Promise.all([
      db
        .select()
        .from(workspacesTable)
        .where(
          eq(workspacesTable.id, workspace_uuid)
        ),

      db
        .select()
        .from(nodesTable)
        .where(
          eq(
            nodesTable.workspace_id,
            workspace_uuid
          )
        ),

      db
        .select()
        .from(edgesTable)
        .where(
          eq(
            edgesTable.workspace_id,
            workspace_uuid
          )
        ),
    ]);

  return {
    workspace: workspace[0],
    nodes,
    edges,
  };
}

export async function insert_node(node: Node) {
  try {
    const insertedNode = await db.insert(nodesTable).values({
      id: node.id as string,
      title: String(node.data?.title ?? ""),
      workspace_id: String(node.data?.workspace_id ?? ""),
      x: Number(node.position?.x ?? 0),
      y: Number(node.position?.y ?? 0),
      height: node.height ? Number(node.height) : undefined,
      width: node.width ? Number(node.width) : undefined,
      summary: node.data?.summary ? String(node.data.summary) : null,

      // id: node.id,
      // title: node.data.title,
      // workspace_id: node.data.workspace_id,
      // x: node.position.x,
      // y: node.position.y,
      // height: node.height,
      // width: node.width,
      // summary: node.data.summary,
    }).returning();

    return insertedNode[0];
  } catch (error) {
    return { "error": error };
  }
}

export async function update_node_position(node_data: any) {
  try {
    const updatedNode = await db.update(nodesTable).set({ x: node_data.x, y: node_data.y }).where(eq(nodesTable.id, node_data.id)).returning();
    return updatedNode[0];
  } catch (error) {
    return { "error": error };
  }
}

export async function update_node_dimensions(node_data: any) {
  try {
    const updatedNode = await db.update(nodesTable).set({
      height: node_data.height,
      width: node_data.width,
      x: node_data.x,
      y: node_data.y,
    }).where(eq(nodesTable.id, node_data.id)).returning();
    return updatedNode[0];
  } catch (error) {
    return { "error": error };
  }
}

export async function update_workspace_viewport(
  workspaceId: string,
  viewport: {
    x: number;
    y: number;
    zoom: number;
  }
) {
  await db
    .update(workspacesTable)
    .set({
      viewportX: viewport.x,
      viewportY: viewport.y,
      viewportZoom: viewport.zoom,
    })
    .where(eq(workspacesTable.id, workspaceId));

  return {
    success: true,
  };
}

export async function insert_edge({
  edgeID,
  workspaceId,
  sourceNodeId,
  targetNodeId,
}: {
  edgeID: string;
  workspaceId: string;
  sourceNodeId: string;
  targetNodeId: string;
}) {
  const insertedEdge = await db.insert(edgesTable).values({
    id: edgeID,
    workspace_id: workspaceId,
    source_node_id: sourceNodeId,
    target_node_id: targetNodeId,
  }).returning();

  return insertedEdge[0];
}

export async function delete_edge(edgeId: string) {
  await db
    .delete(edgesTable)
    .where(
      eq(edgesTable.id, edgeId)
    );

  return {
    success: true,
  };
}