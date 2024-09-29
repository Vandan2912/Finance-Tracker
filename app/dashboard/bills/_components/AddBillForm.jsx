// app/components/AddBillForm.jsx
"use client";
import { useState } from "react";

export default function AddBillForm({ onAdd }) {
  const [billData, setBillData] = useState({
    name: "",
    amount: "",
    dueDay: "",
    category: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(billData);
    setBillData({ name: "", amount: "", dueDay: "", category: "", notes: "" });
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <input
    //     type="text"
    //     placeholder="Bill Name"
    //     value={billData.name}
    //     onChange={(e) => setBillData({ ...billData, name: e.target.value })}
    //     required
    //   />
    //   <input
    //     type="number"
    //     placeholder="Amount"
    //     value={billData.amount}
    //     onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
    //     required
    //   />
    //   <input
    //     type="number"
    //     placeholder="Due Day (1-31)"
    //     value={billData.dueDay}
    //     onChange={(e) => setBillData({ ...billData, dueDay: e.target.value })}
    //     min="1"
    //     max="31"
    //     required
    //   />
    //   <input
    //     type="text"
    //     placeholder="Category"
    //     value={billData.category}
    //     onChange={(e) => setBillData({ ...billData, category: e.target.value })}
    //   />
    //   <textarea
    //     placeholder="Notes"
    //     value={billData.notes}
    //     onChange={(e) => setBillData({ ...billData, notes: e.target.value })}
    //   />
    //   <button type="submit">Add Bill</button>
    // </form>
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
          items-center flex flex-col border-2 border-dashed
          cursor-pointer hover:shadow-md h-[170px] justify-center"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
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
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 5000₹"
                    onChange={(e) => setAmount(e.target.value)}
                  />
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
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
