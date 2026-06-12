"use client"

import {
    ReactFlowInstance,
    Background,
    Controls,
    ReactFlow,
    applyNodeChanges,
    OnNodeDrag,
    addEdge,
    Connection,
    type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ConversationNode from "@/components/nodes/ConversationNode";
import { useCanvasStore } from "@/stores/canvasStore";
import type { Node } from "@xyflow/react";
import { useEffect, useCallback, useState } from "react";
import { insert_node, update_node_position, update_workspace_viewport } from "@/actions";
import toast, { Toaster } from 'react-hot-toast';
import { WorkspaceType } from "@/types";
import debounce from "lodash/debounce";


type WorkspaceCanvasProps = {
    fetchedNodes: Node[];
    workspaceData: WorkspaceType;
}

export default function WorkspaceCanvas({
    fetchedNodes,
    workspaceData
}: WorkspaceCanvasProps) {

    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    useEffect(() => {
        if (!reactFlowInstance) return;

        reactFlowInstance.setViewport({
            x: workspaceData.viewportX,
            y: workspaceData.viewportY,
            zoom: workspaceData.viewportZoom,
        });
    }, [reactFlowInstance, workspaceData]);

    const { nodes, setNodes, addNode, updateNodeStatus, removeNode, edges, setEdges } = useCanvasStore();

    useEffect(() => {
        setNodes(fetchedNodes);
    }, [fetchedNodes, setNodes]);

    const nodeTypes = {
        conversation: ConversationNode,
    };

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
  (connection: Connection) => {
    setEdges(
      addEdge(connection, edges)
    );
  },
  [edges, setEdges]
);

    return (
        <div className="h-screen w-screen">
            <Toaster />
            <button
                className="absolute top-4 left-4 z-50 rounded bg-black px-4 py-2 text-white"
                onClick={async () => {
                    const tempNode: Node = {
                        id: crypto.randomUUID(),
                        type: "conversation",
                        position: {
                            x: 200,
                            y: 200,
                        },
                        style: {
                            width: 300,
                            height: 250,
                        },
                        data: {
                            title: "Untitled Node",
                            summary: "summary will come here",
                            status: "saving",
                            workspace_id: workspaceData.id,
                        }
                    };

                    addNode(tempNode);
                    const result = await insert_node(tempNode);

                    if ("error" in result) {
                        removeNode(tempNode.id);
                        alert("Failed to create node");
                    } else {
                        updateNodeStatus(tempNode, result);
                    }
                }}
            >
                New Node
            </button>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                onNodeDragStop={handleNodeDragStop}
                onMoveEnd={handleMoveEnd}
                onInit={setReactFlowInstance}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}