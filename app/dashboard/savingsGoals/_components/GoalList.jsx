"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, savingsGoals } from "@/utils/schema";
import CreateGoal from "./CreateGoal";
import GoalItem from "./GoalItem";

function GoalList() {
  const [goalList, setGoalList] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    // const result = await db
    //   .select({
    //     ...getTableColumns(Budgets),
    //     totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
    //     totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    //   })
    //   .from(Budgets)
    //   .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    //   .where(eq(Budgets.createdBy, user?.email))
    //   .groupBy(Budgets.id)
    //   .orderBy(desc(Budgets.id));
    // setGoalList(result);

    const fetchedGoals = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, user?.id));
    setGoalList(fetchedGoals);
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateGoal refreshData={() => getBudgetList()} />
        {goalList?.length > 0
          ? goalList.map((goal, index) => <GoalItem goal={goal} key={index} />)
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default GoalList;
