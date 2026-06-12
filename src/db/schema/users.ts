import * as p from "drizzle-orm/pg-core";

export const usersTable = p.pgTable("users", {
  id: p.uuid("id").primaryKey().defaultRandom(),
  email: p.text("email").unique().notNull(),
  createdAt: p.timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});