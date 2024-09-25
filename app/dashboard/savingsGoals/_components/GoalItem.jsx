import Link from "next/link";
import React from "react";

function GoalItem({ goal }) {
  const calculateProgressPerc = () => {
    const perc = (goal.totalContributed / goal.targetAmount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  const daysRemaining = () => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Link href={"/dashboard/savingsGoals/" + goal?.id}>
      <div
        className="p-5 border rounded-2xl
    hover:shadow-md cursor-pointer h-[170px]"
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2
              className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
            >
              {goal?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{goal.name}</h2>
              <h2 className="text-sm text-gray-500">{goal.totalContributions} Contributions</h2>
            </div>
          </div>
          <h2 className="font-bold text-primary text-lg"> ₹{goal.targetAmount}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">₹{goal.totalContributed ? goal.totalContributed : 0} Saved</h2>
            <h2 className="text-xs text-slate-400">₹{goal.targetAmount - goal.totalContributed} Remaining</h2>
          </div>
          <div
            className="w-full
              bg-slate-300 h-2 rounded-full"
          >
            <div
              className="
              bg-primary h-2 rounded-full"
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="mt-2 text-xs text-right text-slate-400">{daysRemaining()} days remaining</div>
      </div>
    </Link>
  );
}

export default GoalItem;
