"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { savingsGoals } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditGoal({ goalInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(goalInfo?.icon);
  const [openEmojiPicker, setOpenEmojiIcon] = useState(false);

  const [name, setName] = useState();
  const [targetAmount, setTargetAmount] = useState();
  const [targetDate, setTargetDate] = useState();
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    if (goalInfo) {
      setEmojiIcon(goalInfo?.icon);
      setTargetAmount(goalInfo.targetAmount);
      setName(goalInfo.name);
      setTargetDate(goalInfo.targetDate);
    }
  }, [goalInfo]);

  const onUpdateGoal = async () => {
    try {
      const result = await db
        .update(savingsGoals)
        .set({
          name: name,
          targetAmount: targetAmount,
          targetDate: targetDate,
          icon: emojiIcon,
        })
        .where(eq(savingsGoals.id, goalInfo.id))
        .returning();

      if (result) {
        refreshData();
        toast("Goal Updated!");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal. Please try again.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex space-x-2 gap-2 rounded-full">
            <PenBox className="w-4" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiIcon(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiIcon(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Goal Name</h2>
                  <Input
                    placeholder="e.g. New Car"
                    defaultValue={goalInfo?.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Target Amount</h2>
                  <Input
                    type="number"
                    defaultValue={goalInfo?.targetAmount}
                    placeholder="e.g. 20000"
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Target Date</h2>
                  <Input
                    type="date"
                    defaultValue={goalInfo?.targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && targetAmount && targetDate)}
                onClick={() => onUpdateGoal()}
                className="mt-5 w-full rounded-full"
              >
                Update Goal
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditGoal;
