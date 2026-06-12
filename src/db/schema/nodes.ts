import * as p from "drizzle-orm/pg-core";
import { workspacesTable } from "./workspaces";

export const nodesTable = p.pgTable("nodes", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  workspace_id: p.uuid("workspace_id").notNull().references(()=>workspacesTable.id, {onDelete: "cascade"}),
  title: p.text("title").notNull(),
  summary: p.text("summary"),
  x: p.doublePrecision("x").notNull(),
  y: p.doublePrecision("y").notNull(),
  width: p.integer("width").notNull().default(450),
  height: p.integer("height").notNull().default(350),
  createdAt: p.timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: p.timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});