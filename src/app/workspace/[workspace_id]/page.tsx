import { fetch_workspace_data } from "@/actions";
import WorkspaceCanvas from "./WorkspaceCanvas";
import { mapDbNodeToReactFlowNode } from "@/mappers/node.mapper";
import { mapDbEdgeToReactFlowEdge } from "@/mappers/edge.mapper";

export default async function Page({
  params,
}: {
  params: Promise<{ workspace_id: string }>
}) {
  const { workspace_id } = await params;
  const {nodes, workspace, edges} = await fetch_workspace_data(workspace_id);
  const reactFlowNodes = nodes.map(mapDbNodeToReactFlowNode);
  const reactFlowEdges = edges.map(mapDbEdgeToReactFlowEdge);

  return (
    <WorkspaceCanvas workspaceData={workspace} fetchedNodes={reactFlowNodes} fetchedEdges={reactFlowEdges} />
  );
}