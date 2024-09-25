import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Icon from "../../public/chart-donut.svg";

function Header() {
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={Icon.src} alt="logo" width={40} height={25} />
        <span className="text-blue-800  font-bold text-xl">FinanSmart</span>
      </div>

      <div className="flex gap-3  items-center">
        <Link href={"/auth"}>
          <Button className="rounded-full">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
