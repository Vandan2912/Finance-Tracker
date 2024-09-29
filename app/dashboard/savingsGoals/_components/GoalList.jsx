"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  Budgets,
  Expenses,
  savingsContributions,
  savingsGoals,
} from "@/utils/schema";
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
    const fetchedGoals = await db
      .select({
        ...getTableColumns(savingsGoals),
        totalContributed: sql`sum(${savingsContributions.amount})`.mapWith(
          Number
        ),
        totalContributions: sql`count(${savingsContributions.id})`.mapWith(
          Number
        ),
      })
      .from(savingsGoals)
      .leftJoin(
        savingsContributions,
        eq(savingsGoals.id, savingsContributions.savingsGoalId)
      )
      .where(eq(savingsGoals.userId, user?.id))
      .groupBy(savingsGoals.id);
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
