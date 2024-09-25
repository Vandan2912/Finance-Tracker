"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, savingsGoals } from "@/utils/schema";
import { toast } from "sonner";

function CreateGoal({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("🚗");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [user, setUser] = useState({});
  const [startDate, setStartDate] = useState();
  const [targetDate, setTargetDate] = useState();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  const onCreateBudget = async () => {
    if (user.id) {
      const result = await db.insert(savingsGoals).values({
        name,
        icon: emojiIcon,
        status: "active",
        userId: user.id,
        targetAmount: parseFloat(amount),
        startDate: new Date(startDate),
        targetDate: new Date(targetDate),
      });

      if (result) {
        refreshData();
        toast("New Goal Created!");
        setEmojiIcon("🚗");
        setOpenEmojiPicker(false);
        setName();
        setAmount();
        setStartDate();
        setTargetDate();
      }
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Goal</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Goal Name</h2>
                  <Input placeholder="e.g. Dream Car" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Goal Amount</h2>
                  <Input type="number" placeholder="e.g. ₹2500000" onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Start Date</h2>
                  <Input type="date" placeholder="Start Date" onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Target Date</h2>
                  <Input type="date" placeholder="Target Date" onChange={(e) => setTargetDate(e.target.value)} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onCreateBudget()}
                className="mt-5 w-full rounded-full"
              >
                Create Goal
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateGoal;
