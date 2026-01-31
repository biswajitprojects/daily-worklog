"use client";
import { useState } from "react";
import { Modal } from "../ui/modal";

// Define the TypeScript interface for the table rows
interface TaskLog {
  id: number; // Unique identifier for each task log
  date: string; // Date of the task
  project: string; // Project name
  task: string; // Task name
  hours: number; // Hours logged
  status: string; // Status of the task
  billingStatus: string; // Billing status (Yes/No)
}

// Define the table data using the interface
const tableData: TaskLog[] = [
  {
    id: 1,
    date: "11/16/2025",
    project: "Project X",
    task: "Design Mockups",
    hours: 4,
    status: "Submitted",
    billingStatus: "Yes",
  },
  {
    id: 2,
    date: "11/16/2025",
    project: "Project X",
    task: "API Integration",
    hours: 3,
    status: "Submitted",
    billingStatus: "No",
  },
];

export default function EmployeeTable() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskLog | null>(null);
  const [editFormData, setEditFormData] = useState({
    project: "",
    task: "",
    hours: 0,
    reason: "",
  });



  const handleRequestEdit = (task: TaskLog) => {
    setSelectedTask(task);
    setEditFormData({
      project: task.project,
      task: task.task,
      hours: task.hours,
      reason: "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Edit request submitted:", {
      originalTask: selectedTask,
      editedData: editFormData,
    });
    // Add your edit request submission logic here
    setIsEditModalOpen(false);
    setSelectedTask(null);
    setEditFormData({ project: "", task: "", hours: 0, reason: "" });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mt-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Task Logs
          </h3>
        </div>

        <div className="flex items-center gap-3">
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
                Date
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Project
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Task
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Hours
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Status
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Billing Status
              </th>
              <th className="py-3 px-4 text-start font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((taskLog) => (
              <tr key={taskLog.id}>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {taskLog.date}
                </td>
                <td className="py-3 px-4 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {taskLog.project}
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {taskLog.task}
                </td>
                <td className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {taskLog.hours}h
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-theme-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {taskLog.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-theme-xs font-medium ${
                    taskLog.billingStatus.toLowerCase() === 'yes' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {taskLog.billingStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleRequestEdit(taskLog)}
                    className="px-3 py-1.5 text-theme-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Request Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    

      {/* Edit Task Request Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-2xl mx-4 hidden md:block p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Request Task Edit
            </h2>
            {selectedTask && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Editing: {selectedTask.project} - {selectedTask.task} ({selectedTask.date})
              </p>
            )}
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-5">
            {/* Project Name */}
            <div>
              <label htmlFor="editProject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="editProject"
                value={editFormData.project}
                onChange={(e) => setEditFormData({ ...editFormData, project: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Task Name */}
            <div>
              <label htmlFor="editTask" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Name
              </label>
              <input
                type="text"
                id="editTask"
                value={editFormData.task}
                onChange={(e) => setEditFormData({ ...editFormData, task: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Hours */}
            <div>
              <label htmlFor="editHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours
              </label>
              <input
                type="number"
                id="editHours"
                value={editFormData.hours}
                onChange={(e) => setEditFormData({ ...editFormData, hours: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                min="0"
                step="0.5"
                required
              />
            </div>

            {/* Reason for Edit */}
            <div>
              <label htmlFor="editReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Edit Request
              </label>
              <textarea
                id="editReason"
                value={editFormData.reason}
                onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows={4}
                placeholder="Explain why you need to edit this task log..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
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
