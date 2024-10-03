import React from "react";

function SavingsGoalsSummary({ goals }) {
  console.log("goals", goals);
  return (
    <div className="border rounded-2xl p-5 my-5">
      <h2 className="font-bold text-lg mb-3">Savings Goals</h2>
      {goals.map((goal) => (
        <div key={goal.id} className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span>{goal.name}</span>
            <span className="text-sm text-gray-500">
              ₹{goal.totalContributed?.toFixed(2) || "0"} / ${goal.targetAmount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(goal.totalContributed / goal.targetAmount) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavingsGoalsSummary;
