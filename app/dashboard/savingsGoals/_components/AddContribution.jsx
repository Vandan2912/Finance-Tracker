import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { savingsGoals, savingsContributions } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddContribution({ goalId, user, refreshData }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Contribution
   */
  const addNewContribution = async () => {
    setLoading(true);
    try {
      const result = await db.insert(savingsContributions).values({
        notes: description,
        amount: parseFloat(amount),
        savingsGoalId: goalId,
        date: new Date(),
      });

      setAmount("");
      setDescription("");
      if (result) {
        refreshData();
        toast("New Contribution Added!");
      }
    } catch (error) {
      console.error("Error adding contribution:", error);
      toast.error("Failed to add contribution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Contribution</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Contribution Description</h2>
        <Input
          placeholder="e.g. Monthly Savings"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Contribution Amount</h2>
        <Input type="number" placeholder="e.g. 1000" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <Button
        disabled={!(description && amount) || loading}
        onClick={() => addNewContribution()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Contribution"}
      </Button>
    </div>
  );
}

export default AddContribution;
