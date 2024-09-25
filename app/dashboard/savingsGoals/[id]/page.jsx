"use client";
import { db } from "@/utils/dbConfig";
import { savingsGoals, savingsContributions } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import GoalItem from "../_components/GoalItem";
import AddContribution from "../_components/AddContribution";
import ContributionListTable from "../_components/ContributionListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pen, PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditGoal from "../_components/EditGoal";

function GoalScreen({ params }) {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  const [goalInfo, setGoalInfo] = useState();
  const [contributionsList, setContributionsList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getGoalInfo();
  }, [user]);

  /**
   * Get Goal Information
   */
  const getGoalInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(savingsGoals),
        totalContributed: sql`sum(${savingsContributions.amount})`.mapWith(Number),
        totalContributions: sql`count(${savingsContributions.id})`.mapWith(Number),
      })
      .from(savingsGoals)
      .leftJoin(savingsContributions, eq(savingsGoals.id, savingsContributions.savingsGoalId))
      .where(eq(savingsGoals.createdBy, user?.email))
      .where(eq(savingsGoals.id, params.id))
      .groupBy(savingsGoals.id);

    setGoalInfo(result[0]);
    getContributionsList();
  };

  /**
   * Get Latest savingsContributions
   */
  const getContributionsList = async () => {
    const result = await db
      .select()
      .from(savingsContributions)
      .where(eq(savingsContributions.savingsGoalId, parseInt(params.id)))
      .orderBy(desc(savingsContributions.id));
    setContributionsList(result);
    console.log(result);
  };

  /**
   * Used to Delete goal
   */
  const deleteGoal = async () => {
    const deleteContributionsResult = await db
      .delete(savingsContributions)
      .where(eq(savingsContributions.savingsGoalId, parseInt(params.id)))
      .returning();

    if (deleteContributionsResult) {
      const result = await db
        .delete(savingsGoals)
        .where(eq(savingsGoals.id, parseInt(params.id)))
        .returning();
    }
    toast("Goal Deleted!");
    route.replace("/dashboard/goals");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Goal
        </span>
        <div className="flex gap-2 items-center">
          <EditGoal goalInfo={goalInfo} refreshData={() => getGoalInfo()} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current goal along with contributions
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteGoal()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {goalInfo ? (
          <GoalItem goal={goalInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddContribution goalId={params.id} user={user} refreshData={() => getGoalInfo()} />
      </div>
      <div className="mt-4">
        <ContributionListTable contributionsList={contributionsList} refreshData={() => getGoalInfo()} />
      </div>
    </div>
  );
}

export default GoalScreen;
