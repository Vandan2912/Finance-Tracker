import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://Expense%20management_owner:p26ThwPRtfWn@ep-lingering-cell-a1r71n8j.ap-southeast-1.aws.neon.tech/Expense%20management?sslmode=require"
);
export const db = drizzle(sql, { schema });
