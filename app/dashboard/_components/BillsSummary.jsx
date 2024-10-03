import React from "react";

function BillsSummary({ bills }) {
  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg mb-3">Bills</h2>
      {bills.map((bill) => (
        <div key={bill.id} className="mb-2 flex justify-between items-center">
          <span>{bill.name}</span>
          <span className="text-sm text-gray-500">
            Total Paid: ${bill.totalPaid?.toFixed(2) || "0"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default BillsSummary;
