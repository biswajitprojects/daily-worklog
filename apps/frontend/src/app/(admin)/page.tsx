import type { Metadata } from "next";
import React from "react";
import { TasklogMetrics }  from "@/components/tasklog-app/TasklogMetrics";
import MonthlyTarget from "@/components/tasklog-app/MonthlyTarget";
import EmployeeTable from "@/components/tasklog-app/EmployeeTable";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | Cleonix - Next.js Dashboard Template",
  description: "This is Next.js Home for Cleonix Dashboard Template",
};

export default function Tasklog() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TasklogMetrics />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
      <div className="col-span-12">
        <EmployeeTable />
      </div>


    </div>
  );
}
