import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import {
  savingsGoals,
  savingsContributions,
  billPayments,
} from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddBill({ billid, user, refreshData }) {
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Bill Payment
   */
  const addNewBillPayment = async () => {
    setLoading(true);
    try {
      const result = await db.insert(billPayments).values({
        notes: notes,
        amount: parseFloat(amount),
        billId: billid,
        paymentDate: new Date(paymentDate),
      });

      setAmount("");
      setNotes("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      if (result) {
        refreshData();
        toast("New Bill Payment Added!");
      }
    } catch (error) {
      console.error("Error adding bill payment:", error);
      toast.error("Failed to add bill payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Bill</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Bill Description</h2>
        <Input
          placeholder="e.g. Monthly Savings"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Bill Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(notes && amount) || loading}
        onClick={() => addNewBillPayment()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Bill"}
      </Button>
    </div>
  );
}

export default AddBill;
