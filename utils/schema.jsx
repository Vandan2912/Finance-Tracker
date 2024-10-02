import {
  pgTable,
  serial,
  numeric,
  integer,
  varchar,
  decimal,
  date,
  timestamp,
  text,
  pgEnum,
  boolean,
  foreignKey,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});

export const statusEnum = pgEnum("status", [
  "active",
  "completed",
  "cancelled",
]);

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default(
    "0"
  ),
  startDate: date("start_date").notNull(),
  targetDate: date("target_date").notNull(),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savingsContributions = pgTable("savings_contributions", {
  id: serial("id").primaryKey(),
  savingsGoalId: integer("savings_goal_id")
    .notNull()
    .references(() => savingsGoals.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  icon: varchar("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billPayments = pgTable(
  "bill_payments",
  {
    id: serial("id").primaryKey(),
    billId: integer("bill_id").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentDate: date("payment_date").notNull(),
    notes: varchar("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      billIdFk: foreignKey({
        columns: [table.billId],
        foreignColumns: [bills.id],
      }),
    };
  }
);

export const childrenAccounts = pgTable("children_accounts", {
  id: serial("id").primaryKey(),
  parentUserId: varchar("parent_user_id").notNull(),
  name: varchar("name").notNull(),
  icon: varchar("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const childrenExpenses = pgTable(
  "children_expenses",
  {
    id: serial("id").primaryKey(),
    childAccountId: integer("child_account_id").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description").notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      childAccountIdFk: foreignKey({
        columns: [table.childAccountId],
        foreignColumns: [childrenAccounts.id],
      }),
    };
  }
);
