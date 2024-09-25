// app/savings-goals/page.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from "../../../utils/dbConfig"; // Assume you've set up your Drizzle instance
import { savingsGoals, savingsContributions } from "../../../utils/schema";
import { eq } from "drizzle-orm";
import GoalList from "./_components/GoalList";

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    startDate: "",
    targetDate: "",
    category: "",
    description: "",
    status: "active",
  });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [newContribution, setNewContribution] = useState({
    amount: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const fetchedGoals = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, 1)); // Replace 1 with actual user ID
    setGoals(fetchedGoals);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    await db.insert(savingsGoals).values({
      ...newGoal,
      userId: 1, // Replace 1 with actual user ID
      targetAmount: parseFloat(newGoal.targetAmount),
      startDate: new Date(newGoal.startDate),
      targetDate: new Date(newGoal.targetDate),
    });
    fetchGoals();
    setNewGoal({
      name: "",
      targetAmount: "",
      startDate: "",
      targetDate: "",
      category: "",
      description: "",
      status: "active",
    });
  };

  const handleGoalSelect = async (goal) => {
    setSelectedGoal(goal);
    const fetchedContributions = await db
      .select()
      .from(savingsContributions)
      .where(eq(savingsContributions.savingsGoalId, goal.id))
      .orderBy(savingsContributions.date);
    setContributions(fetchedContributions);
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGoal) return;

    const contributionAmount = parseFloat(newContribution.amount);

    await db.transaction(async (tx) => {
      await tx.insert(savingsContributions).values({
        ...newContribution,
        savingsGoalId: selectedGoal.id,
        amount: contributionAmount,
        date: new Date(newContribution.date),
      });

      await tx
        .update(savingsGoals)
        .set({ currentAmount: selectedGoal.currentAmount + contributionAmount })
        .where(eq(savingsGoals.id, selectedGoal.id));
    });

    handleGoalSelect(selectedGoal);
    setNewContribution({
      amount: "",
      date: "",
      notes: "",
    });
    fetchGoals();
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">Savings Goals</h2>
      <GoalList />
    </div>
    // <div>
    //   <h1>Savings Goals</h1>

    //   {/* Form to create a new savings goal */}
    //   <form onSubmit={handleGoalSubmit}>
    //     <input
    //       type="text"
    //       value={newGoal.name}
    //       onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
    //       placeholder="Goal Name"
    //       required
    //     />
    //     <input
    //       type="number"
    //       value={newGoal.targetAmount}
    //       onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
    //       placeholder="Target Amount"
    //       required
    //     />
    //     <input
    //       type="date"
    //       value={newGoal.startDate}
    //       onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
    //       required
    //     />
    //     <input
    //       type="date"
    //       value={newGoal.targetDate}
    //       onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
    //       required
    //     />
    //     <input
    //       type="text"
    //       value={newGoal.category}
    //       onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
    //       placeholder="Category"
    //     />
    //     <textarea
    //       value={newGoal.description}
    //       onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
    //       placeholder="Description"
    //     ></textarea>
    //     <button type="submit">Create Savings Goal</button>
    //   </form>

    //   {/* List of savings goals */}
    //   <ul>
    //     {goals.map((goal) => (
    //       <li key={goal.id} onClick={() => handleGoalSelect(goal)}>
    //         {goal.name}: ₹{goal.currentAmount} / ₹{goal.targetAmount}
    //         (Due: {new Date(goal.targetDate).toLocaleDateString()})
    //       </li>
    //     ))}
    //   </ul>

    //   {/* Selected goal details and contribution form */}
    //   {selectedGoal && (
    //     <div>
    //       <h2>Selected Goal: {selectedGoal.name}</h2>
    //       <p>
    //         Progress: ₹{selectedGoal.currentAmount} / ₹{selectedGoal.targetAmount}
    //       </p>
    //       <p>Category: {selectedGoal.category}</p>
    //       <p>Description: {selectedGoal.description}</p>

    //       <h3>Add Contribution</h3>
    //       <form onSubmit={handleContributionSubmit}>
    //         <input
    //           type="number"
    //           value={newContribution.amount}
    //           onChange={(e) => setNewContribution({ ...newContribution, amount: e.target.value })}
    //           placeholder="Contribution Amount"
    //           required
    //         />
    //         <input
    //           type="date"
    //           value={newContribution.date}
    //           onChange={(e) => setNewContribution({ ...newContribution, date: e.target.value })}
    //           required
    //         />
    //         <textarea
    //           value={newContribution.notes}
    //           onChange={(e) => setNewContribution({ ...newContribution, notes: e.target.value })}
    //           placeholder="Notes"
    //         ></textarea>
    //         <button type="submit">Add Contribution</button>
    //       </form>

    //       <h3>Contribution History</h3>
    //       <ul>
    //         {contributions.map((contribution) => (
    //           <li key={contribution.id}>
    //             ₹{contribution.amount} on {new Date(contribution.date).toLocaleDateString()}
    //             {contribution.notes && ` - Note: ${contribution.notes}`}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>
  );
};

export default SavingsGoalsPage;
