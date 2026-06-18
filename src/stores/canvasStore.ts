import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";

type CanvasStore = {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;

  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeID: string) => void;
  updateNodeStatus: (node: Node, result: any) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeID: string) => void;
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

  addEdge: (edge) => set((state) => ({
    edges: [
      ...state.edges,
      edge
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

  removeEdge: (edgeId: string) => set((state) => ({
    edges: state.edges.filter(
      (edge) => edge.id !== edgeId
    ),
  })),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),
}));