"use client"

import {
    ReactFlowInstance,
    Background,
    Controls,
    ReactFlow,
    applyNodeChanges,
    OnNodeDrag,
    Connection,
    type NodeChange,
    type Edge,
    applyEdgeChanges,
    EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ConversationNode from "@/components/nodes/ConversationNode";
import { useCanvasStore } from "@/stores/canvasStore";
import type { Node } from "@xyflow/react";
import { useEffect, useCallback, useState } from "react";
import {
    insert_node,
    update_node_position,
    update_workspace_viewport,
    insert_edge,
    delete_edge
} from "@/actions";
import toast, { Toaster } from 'react-hot-toast';
import { WorkspaceType } from "@/types";
import debounce from "lodash/debounce";
import { useFormState } from "react-dom";


type WorkspaceCanvasProps = {
    fetchedNodes: Node[];
    workspaceData: WorkspaceType;
    fetchedEdges: Edge[];
}

export default function WorkspaceCanvas({
    fetchedNodes,
    workspaceData,
    fetchedEdges,
}: WorkspaceCanvasProps) {
    
    const { nodes, setNodes, addNode, updateNodeStatus, removeNode, edges, addEdge, setEdges, removeEdge } = useCanvasStore();
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const nodeTypes = {
        conversation: ConversationNode,
    };

    useEffect(() => {
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
    }, [fetchedNodes, fetchedEdges, setNodes, setEdges]);


    const onNodesChange = (
        changes: NodeChange[]
    ) => {
        setNodes(applyNodeChanges(changes, nodes));
    };

    const notify = () => toast('Unable to update node');

    // Define the drag stop handler
    const handleNodeDragStop: OnNodeDrag = useCallback(async (event, node) => {
        const temp = {
            id: node.id,
            x: node.position.x ?? 200,
            y: node.position.y ?? 200,
        };
        const updatedNode = await update_node_position(temp);

        if ("error" in updatedNode) {
            notify();
        }
    }, []);

    const saveViewport = debounce(
        async (
            workspaceId: string,
            viewport: {
                x: number;
                y: number;
                zoom: number;
            }
        ) => {
            await update_workspace_viewport(
                workspaceId,
                viewport
            );
        },
        500
    );

    const handleMoveEnd = () => {
        if (!reactFlowInstance) return;
        const viewport = reactFlowInstance.getViewport();

        saveViewport(workspaceData.id, {
            x: viewport.x,
            y: viewport.y,
            zoom: viewport.zoom,
        });
    };

    const onConnect = useCallback(
        async (connection: Connection) => {
            const edgeId = crypto.randomUUID();

            const tempEdge = {
                id: edgeId,
                source: connection.source!,
                target: connection.target!,
            };

            // Optimistic UI
            addEdge(tempEdge);

            try {
                await insert_edge({
                    edgeID: edgeId,
                    workspaceId: workspaceData.id,
                    sourceNodeId: connection.source!,
                    targetNodeId: connection.target!,
                });

            } catch (error) {
                removeEdge(edgeId);
                alert("Failed to create edge");
            }
        },
        [edges, addEdge, removeEdge, workspaceData.id]
    );

    const onEdgesChange = useCallback(async (changes: EdgeChange[]) => {
        const deletedEdges = changes
            .filter((change) => change.type === "remove")
            .map((change) =>
                edges.find((edge) => edge.id === change.id)
            )
            .filter(Boolean);

        // optimistic UI
        setEdges(
            applyEdgeChanges(
                changes,
                edges
            )
        );

        for (const edge of deletedEdges) {
            try {
                await delete_edge(edge!.id);
            } catch {

                addEdge(edge!);
                alert(
                    "Failed to delete edge"
                );
            }
        }

    },
        [edges, setEdges, addEdge,]
    );

    

    // onClick={async () => {
    //                 const tempNode: Node = {
    //                     id: crypto.randomUUID(),
    //                     type: "conversation",
    //                     position: {
    //                         x: 200,
    //                         y: 200,
    //                     },
    //                     style: {
    //                         width: 300,
    //                         height: 250,
    //                     },
    //                     data: {
    //                         title: "Untitled Node",
    //                         summary: "summary will come here",
    //                         status: "saving",
    //                         workspace_id: workspaceData.id,
    //                     }
    //                 };

    //                 addNode(tempNode);
    //                 const result = await insert_node(tempNode);

    //                 if ("error" in result) {
    //                     removeNode(tempNode.id);
    //                     alert("Failed to create node");
    //                 } else {
    //                     updateNodeStatus(tempNode, result);
    //                 }
    //             }}

    return (
        <div className="h-screen w-screen">
            <Toaster />

            <ReactFlow
                defaultViewport={{
                    x: workspaceData.viewportX,
                    y: workspaceData.viewportY,
                    zoom: workspaceData.viewportZoom,
                }}
                onEdgesChange={onEdgesChange}
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                onNodeDragStop={handleNodeDragStop}
                onMoveEnd={handleMoveEnd}
                onInit={setReactFlowInstance}
                deleteKeyCode={["Backspace", "Delete"]}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}