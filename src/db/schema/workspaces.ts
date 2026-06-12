import * as p from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const workspacesTable = p.pgTable("workspaces", {
    id: p.uuid("id").primaryKey().defaultRandom(),
    user_id: p.uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    title: p.text("title").notNull(),
    viewportX: p.doublePrecision('viewport_x').default(0).notNull(),
    viewportY: p.doublePrecision('viewport_y').default(0).notNull(),
    viewportZoom: p.doublePrecision('viewport_zoom').default(1).notNull(),
    createdAt: p.timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: p.timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});