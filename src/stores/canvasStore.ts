import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";

type CanvasStore = {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;

  addNode: (node: Node) => void;
  updateNodeStatus: (node: Node, result: any) => void;
  removeNode: (nodeID: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],
  edges: [],
  isLoading: false,

  addNode: (node) => set((state) => ({
    nodes: [
      ...state.nodes,
      node
    ],
  })),

  updateNodeStatus: (node) => set((state) => {
    const nodes = state.nodes.map(n =>
      n.id === node.id
        ? { ...n, data: { ...n.data, status: "saved" } }
        : n
    );

    return { nodes };
  }),

  removeNode: (nodeID) => set((state) => {
    const nodes = state.nodes.filter((node) => node.id !== nodeID);
    return { nodes };
  }),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),
}));