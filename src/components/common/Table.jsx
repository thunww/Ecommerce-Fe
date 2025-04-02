import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

const Table = ({ columns, data, onUpdate, onDelete, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-100">
            {columns.map((col, index) => (
              <th key={index} className="border p-3 text-left bg-gray-900">{col.header}</th>
            ))}
            {(onUpdate || onDelete) && <th className="border p-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border p-3">
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
                {(onUpdate || onDelete) && (
                  <td className="border p-3 text-center">
                    {onUpdate && (
                      <button
                        onClick={() => onUpdate(row.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="border p-3 text-center text-gray-500">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          {/* Nút Previous (Icon) */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            <FaChevronLeft />
          </button>

          {/* Số trang */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {index + 1}
            </button>
          ))}

          {/* Nút Next (Icon) */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
