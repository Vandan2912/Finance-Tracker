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
    const fetchedGoals = await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, 1)); // Replace 1 with actual user ID
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
  );
};

export default SavingsGoalsPage;
