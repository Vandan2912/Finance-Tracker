import React from "react";
import BillsList from "./_components/BillsList";

const Page = () => {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Bills</h2>
      <BillsList />
    </div>
  );
};

export default Page;
