"use client";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  billPayments,
  bills,
  Budgets,
  Expenses,
  familyLinks,
  Incomes,
  savingsContributions,
  savingsGoals,
} from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import SavingsGoalsSummary from "./_components/SavingsGoalsSummary";
import BillsSummary from "./_components/BillsSummary";
import FamilyLinksSummary from "./_components/FamilyLinksSummary";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [savingsGoalsList, setSavingsGoalsList] = useState([]);
  const [billsList, setBillsList] = useState([]);
  const [familyLinksList, setFamilyLinksList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getBudgetList(),
        getIncomeList(),
        getAllExpenses(),
        getSavingsGoalsList(),
        getBillsList(),
        getFamilyLinksList(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.email))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
  };

  const getIncomeList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
          Number
        ),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user.email))
      .groupBy(Incomes.id);
    setIncomeList(result);
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.email))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const getSavingsGoalsList = async () => {
    const result = await db
      .select({
        ...getTableColumns(savingsGoals),
        totalContributed: sql`sum(${savingsContributions.amount})`.mapWith(
          Number
        ),
      })
      .from(savingsGoals)
      .leftJoin(
        savingsContributions,
        eq(savingsGoals.id, savingsContributions.savingsGoalId)
      )
      .where(eq(savingsGoals.userId, user.id))
      .groupBy(savingsGoals.id)
      .orderBy(desc(savingsGoals.id));
    setSavingsGoalsList(result);
  };

  const getBillsList = async () => {
    const result = await db
      .select({
        ...getTableColumns(bills),
        totalPaid: sql`sum(${billPayments.amount})`.mapWith(Number),
      })
      .from(bills)
      .leftJoin(billPayments, eq(bills.id, billPayments.billId))
      .where(eq(bills.userId, user.id))
      .groupBy(bills.id)
      .orderBy(desc(bills.id));
    setBillsList(result);
  };

  const getFamilyLinksList = async () => {
    const links = await db
      .select({
        id: familyLinks.id,
        email: user.email,
        relationshipType: familyLinks.relationshipType,
      })
      .from(familyLinks)
      .innerJoin(
        user,
        or(
          eq(user.id, familyLinks.linkedUserId),
          eq(user.id, familyLinks.userId)
        )
      )
      .where(
        and(
          or(
            eq(familyLinks.userId, user.id),
            eq(familyLinks.linkedUserId, user.id)
          ),
          eq(familyLinks.status, "accepted")
        )
      );
    setFamilyLinksList(links.filter((link) => link.email !== user.email));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, Hunny 👋</h2>
      <p className="text-gray-500">
        Here's what happenning with your money, Lets Manage your expense
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
          <SavingsGoalsSummary goals={savingsGoalsList} />
          <BillsSummary bills={billsList} />
          <FamilyLinksSummary links={familyLinksList} />
        </div>
        <div className="">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  className="h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
