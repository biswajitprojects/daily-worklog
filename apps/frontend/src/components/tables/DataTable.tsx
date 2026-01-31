"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  salary: string;
  office: string;
  status: string;
}

const tableData: Employee[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    email: "demoemail@gmail.com",
    position: "Sales Assistant",
    salary: "$89,500",
    office: "Edinburgh",
    status: "Hired",
  },
  {
    id: 2,
    name: "Kaiya George",
    email: "demoemail@gmail.com",
    position: "Chief Executive Officer",
    salary: "$105,000",
    office: "London",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Zain Geidt",
    email: "demoemail@gmail.com",
    position: "Junior Technical Author",
    salary: "$120,000",
    office: "San Francisco",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Abram Schleifer",
    email: "demoemail@gmail.com",
    position: "Software Engineer",
    salary: "$95,000",
    office: "New York",
    status: "Hired",
  },
  {
    id: 5,
    name: "Carla George",
    email: "demoemail@gmail.com",
    position: "Integration Specialist",
    salary: "$80,000",
    office: "Chicago",
    status: "Pending",
  },
  {
    id: 6,
    name: "Adam Brown",
    email: "demoemail@gmail.com",
    position: "Senior Developer",
    salary: "$110,000",
    office: "Boston",
    status: "Hired",
  },
  {
    id: 7,
    name: "Sarah Lee",
    email: "demoemail@gmail.com",
    position: "UX Designer",
    salary: "$92,000",
    office: "Seattle",
    status: "Pending",
  },
];

export default function DataTableTsx() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return tableData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filtered.length / entries);
  const paginatedData = filtered.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const badgeColor = (status: string) => {
    if (status === "Hired") return "success";
    if (status === "In Progress") return "warning";
    return "error";
  };

  return (
    <>
    <div className="rounded-xl border border-gray-200 p-6 bg-white dark:bg-white/[0.05]">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 dark:text-white/90">Show</span>
          <select
            className="border border-gray-300 px-3 py-1 rounded-lg dark:text-white/90"
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-gray-600 dark:text-white/90">entries</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              placeholder="Search..."
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
            Download
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
            
       </div>
      </div>
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"></TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Position</TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Salary</TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Office</TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody  className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-5 py-4 sm:px-1 text-start">
                <input type="checkbox" />
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">{item.name}</p>
                  <p className="text-gray-500 text-sm dark:text-white/90">{item.email}</p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.position}</TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.salary}</TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.office}</TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Badge size="sm" color={badgeColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex gap-3 text-gray-600">
                  <FiTrash2 className="cursor-pointer dark:text-white/90" />
                  <FiEdit2 className="cursor-pointer dark:text-white/90" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-600 text-sm dark:text-white/90">
          Showing {(currentPage - 1) * entries + 1} to
          {" "}
          {Math.min(currentPage * entries, filtered.length)} of {filtered.length}
          {" "}
          entries
        </span>

        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 border rounded-lg dark:text-white/90"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 border rounded-lg dark:text-white/90 ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-4 py-2 border rounded-lg dark:text-white/90"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
