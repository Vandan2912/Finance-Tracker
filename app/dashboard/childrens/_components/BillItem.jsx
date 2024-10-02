// app/components/BillItem.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/utils/dbConfig";
import { billPayments, childrenExpenses } from "@/utils/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import Link from "next/link";

export default function BillItem({ child }) {
  //   const [isEditing, setIsEditing] = useState(false);
  //   const [editData, setEditData] = useState(bill);
  const [expenses, setExpenses] = useState([]);
  //   const [newPayment, setNewPayment] = useState({
  //     amount: "",
  //     paymentDate: new Date().toISOString().split("T")[0],
  //     notes: "",
  //   });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const fetchedExpenses = await db
      .select()
      .from(childrenExpenses)
      .where(eq(childrenExpenses.childAccountId, child.id))
      .orderBy(desc(childrenExpenses.date));
    setExpenses(fetchedExpenses);
  };

  console.log(expenses);
  //   const handleUpdate = () => {
  //     onUpdate(bill.id, editData);
  //     setIsEditing(false);
  //   };

  //   const addPayment = async () => {
  //     await db.insert(billPayments).values({
  //       ...newPayment,
  //       billId: bill.id,
  //       amount: parseFloat(newPayment.amount),
  //     });
  //     setNewPayment({
  //       amount: "",
  //       paymentDate: new Date().toISOString().split("T")[0],
  //       notes: "",
  //     });
  //     fetchPayments();
  //   };

  //   const isPaidThisMonth = () => {
  //     const currentMonth = new Date().getMonth();
  //     const currentYear = new Date().getFullYear();
  //     return payments.some((payment) => {
  //       const paymentDate = new Date(payment.paymentDate);
  //       return (
  //         paymentDate.getMonth() === currentMonth &&
  //         paymentDate.getFullYear() === currentYear
  //       );
  //     });
  //   };

  //   if (isEditing) {
  //     return (
  //       <div>
  //         <input
  //           value={editData.name}
  //           onChange={(e) => setEditData({ ...editData, name: e.target.value })}
  //         />
  //         <input
  //           value={editData.icon}
  //           onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
  //         />
  //         <button onClick={handleUpdate}>Save</button>
  //         <button onClick={() => setIsEditing(false)}>Cancel</button>
  //       </div>
  //     );
  //   }

  console.log(child);
  return (
    <Link href={"/dashboard/childrens/" + child?.id}>
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
              {child?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{child?.name}</h2>
              {/* <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2> */}
            </div>
          </div>
          {/* <h2 className="font-bold text-primary text-lg"> ₹{budget.amount}</h2> */}
        </div>

        {/* <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              ₹{budget.totalSpend ? budget.totalSpend : 0} Spend
            </h2>
            <h2 className="text-xs text-slate-400">
              ₹{budget.amount - budget.totalSpend} Remaining
            </h2>
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
        </div> */}
      </div>
    </Link>
  );
}
