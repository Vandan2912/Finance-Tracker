// app/components/BillItem.jsx
"use client";
import { useState } from "react";

export default function BillItem({ bill, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(bill);

  const handleUpdate = () => {
    onUpdate(bill.id, editData);
    setIsEditing(false);
  };

  const markAsPaid = () => {
    onUpdate(bill.id, {
      isPaid: true,
      paidDate: new Date().toISOString().split("T")[0],
    });
  };

  const isPaidThisMonth = () => {
    if (!bill.paidDate) return false;
    const paidDate = new Date(bill.paidDate);
    const today = new Date();
    return (
      paidDate.getMonth() === today.getMonth() &&
      paidDate.getFullYear() === today.getFullYear()
    );
  };

  if (isEditing) {
    return (
      <div>
        <input
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
        <input
          type="number"
          value={editData.amount}
          onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
        />
        <input
          type="number"
          value={editData.dueDay}
          onChange={(e) => setEditData({ ...editData, dueDay: e.target.value })}
          min="1"
          max="31"
        />
        <button onClick={handleUpdate}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <h3>{bill.name}</h3>
      <p>Amount: ${bill.amount}</p>
      <p>Due: Every {bill.dueDay}th of the month</p>
      <p>Status: {isPaidThisMonth() ? "Paid" : "Unpaid"}</p>
      {!isPaidThisMonth() && <button onClick={markAsPaid}>Mark as Paid</button>}
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(bill.id)}>Delete</button>
    </div>
  );
}
