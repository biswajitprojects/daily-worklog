"use client";
import { useState } from "react";
import Image from "next/image";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Modal } from "../ui/modal";

// Define the TypeScript interface for the table rows
interface Employee {
  id: number; // Unique identifier for each employee
  name: string; // Employee name
  date: string; // Date of the request
  originalHours: number; // Original hours logged
  proposedHours: number; // Proposed hours for edit
  reason: string; // Reason for edit request
  image: string; // URL or path to the employee image
}

// Define the table data using the interface
const tableData: Employee[] = [
  {
    id: 1,
    name: "John Anderson",
    date: "2025-12-01",
    originalHours: 8,
    proposedHours: 6,
    reason: "Meeting ran shorter than expected",
    image: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    date: "2025-12-01",
    originalHours: 7,
    proposedHours: 9,
    reason: "Additional design revisions requested",
    image: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    name: "Michael Chen",
    date: "2025-11-30",
    originalHours: 6,
    proposedHours: 8,
    reason: "Debugging took longer than anticipated",
    image: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    date: "2025-11-29",
    originalHours: 5,
    proposedHours: 7,
    reason: "Campaign planning extended into evening",
    image: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    name: "David Thompson",
    date: "2025-11-28",
    originalHours: 8,
    proposedHours: 4,
    reason: "Client meeting canceled",
    image: "/images/user/user-05.jpg",
  },
];

export default function EmployeeTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    role: "Employee",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
    setIsModalOpen(false);
    setFormData({ firstName: "", lastName: "", userId: "", role: "Employee" });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Task Edit Requests
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-600 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
           <AiOutlineUserAdd /> Create Employee
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
          
          
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Employee
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Date
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Originals Hours
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Proposed Hours
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Reason
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((employee) => (
              <tr key={employee.id}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[30px] w-[30px] overflow-hidden rounded-full">
                      <Image
                        width={30}
                        height={30}
                        src={employee.image}
                        className="h-[30px] w-[30px] object-cover"
                        alt={employee.name}
                      />
                    </div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {employee.name}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.date}
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.originalHours}h
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.proposedHours}h
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.reason}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-theme-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                      Accept
                    </button>
                    <button className="px-3 py-1.5 text-theme-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl mx-4 p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create New Employee Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
           </div>
            {/* User ID */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User ID (Unique Login Identifier)
              </label>
              <input
                type="text"
                id="userId"
                placeholder="e.g., jdoe123"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder:text-gray-400"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
