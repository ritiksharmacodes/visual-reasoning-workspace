import * as p from "drizzle-orm/pg-core";
import { nodesTable } from "./nodes";

// Define the custom PostgreSQL enum for the role check constraint
export const roleEnum = p.pgEnum('role', ['user', 'assistant']);

export const messagesTable = p.pgTable("messages", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  node_id: p.uuid("node_id").notNull().references(() => nodesTable.id, {onDelete: "cascade",}),
  role: roleEnum('role').notNull(),
  content: p.text("content").notNull(),
  created_at: p.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});