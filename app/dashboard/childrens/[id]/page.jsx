"use client";
import { db } from "@/utils/dbConfig";
// import { savingsGoals, savingsContributions } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BillItem from "../_components/BillItem";
import AddBill from "../_components/AddBill";
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
import EditBill from "../_components/EditBill";
import {
  billPayments,
  bills,
  childrenAccounts,
  childrenExpenses,
} from "@/utils/schema";

function BillScreen({ params }) {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  const [childAccountInfo, setChildAccountInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getChildAccountInfo();
  }, [user]);

  const getChildAccountInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(childrenAccounts),
        totalSpent: sql`sum(${childrenExpenses.amount})`.mapWith(Number),
        totalExpenses: sql`count(${childrenExpenses.id})`.mapWith(Number),
      })
      .from(childrenAccounts)
      .leftJoin(
        childrenExpenses,
        eq(childrenAccounts.id, childrenExpenses.childAccountId)
      )
      .where(eq(childrenAccounts.parentUserId, user?.id))
      .where(eq(childrenAccounts.id, params.id))
      .groupBy(childrenAccounts.id);

    setChildAccountInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(childrenExpenses)
      .where(eq(childrenExpenses.childAccountId, params.id))
      .orderBy(desc(childrenExpenses.date));

    setExpensesList(result);
  };

  const deleteChildAccount = async () => {
    const deleteExpensesResult = await db
      .delete(childrenExpenses)
      .where(eq(childrenExpenses.childAccountId, parseInt(params.id)))
      .returning();

    if (deleteExpensesResult) {
      const result = await db
        .delete(childrenAccounts)
        .where(eq(childrenAccounts.id, parseInt(params.id)))
        .returning();
    }
    toast("Child Account Deleted!");
    route.replace("/dashboard/children");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          Child
        </span>
        <div className="flex gap-2 items-center">
          <EditBill
            goalInfo={childAccountInfo}
            refreshData={() => getChildAccountInfo()}
          />

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
                  This action cannot be undone. This will permanently delete
                  your current goal along with contributions and remove your
                  data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteChildAccount()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {childAccountInfo ? (
          <BillItem child={childAccountInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddBill
          billid={params.id}
          user={user}
          refreshData={() => getChildAccountInfo()}
        />
      </div>
      <div className="mt-4">
        <ContributionListTable
          expensesList={expensesList}
          refreshData={() => getChildAccountInfo()}
        />
      </div>
    </div>
  );
}

export default BillScreen;
