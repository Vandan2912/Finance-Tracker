import React from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function BarChartDashboard({ budgetList }) {
  // Process data to calculate remaining amount
  const processedData = budgetList.map((item) => ({
    ...item,
    remainingAmount: Number(item.amount) - Number(item.totalSpend),
    totalSpend: Number(item.totalSpend),
  }));

  // Calculate the maximum value among all `amount` and `totalSpend`
  const maxYValue = Math.max(...processedData.map((item) => item.amount));

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <BarChart
          data={processedData}
          margin={{
            top: 7,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis domain={[0, maxYValue]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" fill="#4845d2" name="Spent" />
          <Bar dataKey="amount" fill="#C3C2FF" name="Total Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
