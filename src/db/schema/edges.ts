import * as p from "drizzle-orm/pg-core";
import { workspacesTable } from "./workspaces";
import { nodesTable } from "./nodes";

export const edgesTable = p.pgTable("edges", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  workspace_id: p.uuid("workspace_id").notNull().references(()=>workspacesTable.id, {onDelete: "cascade"}),
  source_node_id: p.uuid("source_node_id").notNull().references(()=>nodesTable.id, {onDelete: "cascade"}),
  target_node_id: p.uuid("target_node_id").notNull().references(()=>nodesTable.id, {onDelete: "cascade"}),
  createdAt: p.timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});