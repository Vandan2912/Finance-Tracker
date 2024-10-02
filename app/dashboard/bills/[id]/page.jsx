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
import { billPayments, bills } from "@/utils/schema";

function BillScreen({ params }) {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  const [billInfo, setBillInfo] = useState();
  const [paymentsList, setPaymentsList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getBillInfo();
  }, [user]);

  /**
   * Get Bill Information
   */
  const getBillInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(bills),
        totalPaid: sql`sum(${billPayments.amount})`.mapWith(Number),
        totalPayments: sql`count(${billPayments.id})`.mapWith(Number),
      })
      .from(bills)
      .leftJoin(billPayments, eq(bills.id, billPayments.billId))
      .where(eq(bills.userId, user?.id)) // Assuming you're using userId instead of email
      .where(eq(bills.id, params.id))
      .groupBy(bills.id);

    setBillInfo(result[0]);
    getPaymentsList();
  };

  /**
   * Get Latest Payments
   */
  const getPaymentsList = async () => {
    const result = await db
      .select()
      .from(billPayments)
      .where(eq(billPayments.billId, params.id))
      .orderBy(desc(billPayments.paymentDate));

    setPaymentsList(result);
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
          <EditBill goalInfo={billInfo} refreshData={() => getBillInfo()} />

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
                <AlertDialogAction onClick={() => deleteGoal()}>
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
        {billInfo ? (
          <BillItem bill={billInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddBill
          billid={params.id}
          user={user}
          refreshData={() => getBillInfo()}
        />
      </div>
      <div className="mt-4">
        <ContributionListTable
          contributionsList={paymentsList}
          refreshData={() => getBillInfo()}
        />
      </div>
    </div>
  );
}

export default BillScreen;
