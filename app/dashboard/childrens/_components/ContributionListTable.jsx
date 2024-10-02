import { db } from "@/utils/dbConfig";
import { childrenExpenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ChildExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(childrenExpenses)
        .where(eq(childrenExpenses.id, expense.id))
        .returning();

      if (result) {
        toast("Expense Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Description</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Category</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expense, index) => (
        <div
          key={expense.id}
          className="grid grid-cols-5 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
        >
          <h2>{expense.description}</h2>
          <h2>₹{expense.amount.toFixed(2)}</h2>
          <h2>{new Date(expense.date).toLocaleDateString()}</h2>
          <h2>{expense.category || "N/A"}</h2>
          <h2
            onClick={() => deleteExpense(expense)}
            className="text-red-500 cursor-pointer flex items-center"
          >
            <Trash className="w-4 h-4 mr-1" /> Delete
          </h2>
        </div>
      ))}
      {expensesList.length === 0 && (
        <div className="text-center py-4 bg-slate-50">
          No expenses recorded yet.
        </div>
      )}
    </div>
  );
}

export default ChildExpenseListTable;
