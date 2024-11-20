"use client";
import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState();

  useEffect(() => {
    // Check if window is available and get user data
    if (typeof window !== "undefined") {
      const userData = JSON.parse(window.localStorage.getItem("user") || "{}");
      setUser(userData);
    }
  }, []);

  // useEffect(() => {
  //   user && checkUserBudgets();
  // }, [user]);

  // const checkUserBudgets = async () => {
  //   const result = await db
  //     .select()
  //     .from(Budgets)
  //     .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
  //   console.log(result);
  //   if (result?.length == 0) {
  //     router.replace("/dashboard/budgets");
  //   }
  // };
  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <SideNav />
      </div>
      <div className="md:ml-64 ">
        {/* <DashboardHeader /> */}
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
