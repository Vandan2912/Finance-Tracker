import React from "react";

function DashboardHeader() {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div></div>
      <div>
        {/* <UserButton afterSignOutUrl="/" /> */}
        UserButton
      </div>
    </div>
  );
}

export default DashboardHeader;
