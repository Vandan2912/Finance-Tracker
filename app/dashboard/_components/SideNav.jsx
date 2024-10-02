"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  PiggyBankIcon,
  LogOutIcon,
  ReceiptIndianRupee,
  Baby,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Savings Goals",
      icon: PiggyBankIcon,
      path: "/dashboard/savingsGoals",
    },
    {
      id: 5,
      name: "Bills",
      icon: ReceiptIndianRupee,
      path: "/dashboard/bills",
    },
    {
      id: 5,
      name: "Childrens",
      icon: Baby,
      path: "/dashboard/childrens",
    },
  ];
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || {}));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm flex flex-col">
      {/* <Image src={'/logo.svg'}
        alt='logo'
        width={160}
        height={100}
        /> */}
      <div className="flex flex-row items-center">
        <Image src={"/chart-donut.svg"} alt="logo" width={40} height={25} />
        <span className="text-blue-800 font-bold text-xl">FinanSmart</span>
      </div>
      <div className="flex-1 h-full flex flex-col justify-between">
        <div className="mt-5">
          {menuList.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <h2
                className={`flex gap-2 items-center
                    text-gray-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-primary hover:bg-blue-100
                    ${path == menu.path && "text-primary bg-blue-100"}
                    `}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>

        <div className="flex w-full justify-between">
          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || "H"}
            </AvatarFallback>
          </Avatar>

          <Button
            onClick={() => {
              // Clear all cookies
              const allCookies = Cookies.get(); // Get all cookies
              for (const cookieName in allCookies) {
                Cookies.remove(cookieName); // Remove each cookie
              }
              localStorage.clear();
              router.push("/");
            }}
          >
            <LogOutIcon />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
