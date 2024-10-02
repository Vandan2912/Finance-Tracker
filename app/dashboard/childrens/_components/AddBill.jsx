import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { childrenExpenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function AddChildExpense({ childAccountId, refreshData }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Child Expense
   */
  const addNewChildExpense = async () => {
    setLoading(true);
    try {
      const result = await db.insert(childrenExpenses).values({
        description: description,
        amount: parseFloat(amount),
        childAccountId: childAccountId,
        date: new Date(expenseDate),
        category: category,
      });

      setAmount("");
      setDescription("");
      setCategory("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      if (result) {
        refreshData();
        toast("New Child Expense Added!");
      }
    } catch (error) {
      console.error("Error adding child expense:", error);
      toast.error("Failed to add child expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Child Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Description</h2>
        <Input
          placeholder="e.g. School Supplies"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Date</h2>
        <Input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Category (Optional)</h2>
        <Input
          placeholder="e.g. Education"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <Button
        disabled={!(description && amount && expenseDate) || loading}
        onClick={() => addNewChildExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddChildExpense;
