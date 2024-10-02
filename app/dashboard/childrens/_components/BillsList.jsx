// app/components/BillsList.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/utils/dbConfig";
import { bills, childrenAccounts } from "@/utils/schema";
import { eq } from "drizzle-orm";
import AddBillForm from "./AddBillForm";
import BillItem from "./BillItem";

export default function BillsList() {
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    if (user) {
      fetchChilds();
    }
  }, [user]);

  const fetchChilds = async () => {
    if (!user) return;
    const fetchedAccounts = await db
      .select()
      .from(childrenAccounts)
      .where(eq(childrenAccounts.parentUserId, user.id));
    setAccounts(fetchedAccounts);
  };

  const addBill = async (newAccount) => {
    if (!user) return;
    await db
      .insert(childrenAccounts)
      .values({ ...newAccount, parentUserId: user.id });
    fetchChilds();
  };

  const updateBill = async (id, updateData) => {
    await db.update(bills).set(updateData).where(eq(bills.id, id));
    fetchChilds();
  };

  const deleteBill = async (id) => {
    await db.delete(bills).where(eq(bills.id, id));
    fetchChilds();
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AddBillForm onAdd={addBill} />
        {accounts?.length > 0
          ? accounts.map((bill, index) => <BillItem child={bill} />)
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
