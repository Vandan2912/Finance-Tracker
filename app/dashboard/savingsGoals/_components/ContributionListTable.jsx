import { db } from "@/utils/dbConfig";
import { savingsContributions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ContributionListTable({ contributionsList, refreshData }) {
  const deleteContribution = async (contribution) => {
    try {
      const result = await db
        .delete(savingsContributions)
        .where(eq(savingsContributions.id, contribution.id))
        .returning();

      if (result) {
        toast("Contribution Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting contribution:", error);
      toast.error("Failed to delete contribution. Please try again.");
    }
  };

  console.log("contributionsList", contributionsList);

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Contributions</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Description</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {contributionsList.map((contribution, index) => (
        <div key={contribution.id} className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2">
          <h2>{contribution.notes}</h2>
          <h2>${contribution.amount}</h2>
          <h2>{contribution.date}</h2>
          <h2
            onClick={() => deleteContribution(contribution)}
            className="text-red-500 cursor-pointer flex items-center"
          >
            <Trash className="w-4 h-4 mr-1" /> Delete
          </h2>
        </div>
      ))}
      {contributionsList.length === 0 && <div className="text-center py-4 bg-slate-50">No contributions yet.</div>}
    </div>
  );
}

export default ContributionListTable;
