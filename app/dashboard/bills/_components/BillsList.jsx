// app/components/BillsList.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/utils/dbConfig";
import { bills } from "@/utils/schema";
import { eq } from "drizzle-orm";
import AddBillForm from "./AddBillForm";
import BillItem from "./BillItem";

export default function BillsList() {
  const [billsList, setBillsList] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Check if window is available and get user data
    if (typeof window !== "undefined") {
      const userData = JSON.parse(window.localStorage.getItem("user") || "{}");
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    if (!user) return;
    const fetchedBills = await db.select().from(bills).where(eq(bills.userId, user.id));
    setBillsList(fetchedBills);
  };

  const addBill = async (newBill) => {
    if (!user) return;
    await db.insert(bills).values({ ...newBill, userId: user.id });
    fetchBills();
  };

  const updateBill = async (id, updateData) => {
    await db.update(bills).set(updateData).where(eq(bills.id, id));
    fetchBills();
  };

  return (
    // <div>
    //   <h2>Bills</h2>
    //   <AddBillForm onAdd={addBill} />
    //   {billsList.map((bill) => (
    //     <BillItem
    //       key={bill.id}
    //       bill={bill}
    //       onUpdate={updateBill}
    //       onDelete={deleteBill}
    //     />
    //   ))}
    // </div>
    <div className="mt-7">
      <div
        className="grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AddBillForm onAdd={addBill} />
        {billsList?.length > 0
          ? billsList.map((bill, index) => <BillItem bill={bill} />)
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
      h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}
