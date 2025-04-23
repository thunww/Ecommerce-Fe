import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/categorySlice";
import Swal from "sweetalert2";
import { FaSearch, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Table from "../../components/common/Table";

const ManageCategory = () => {
  const dispatch = useDispatch();
  const {
    categories = [],
    loading,
    error,
  } = useSelector((state) => state.categories);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const filteredCategories =
    categories?.filter((category) =>
      category.category_name?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const handleDeleteCategory = (category_id) => {
    Swal.fire({
      title: "Delete Category",
      text: "Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory(category_id))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "Category has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire("Error!", error || "Delete failed.", "error");
          });
      }
    });
  };

  const handleEditCategory = (category) => {
    Swal.fire({
      title: "Edit Category",
      input: "text",
      inputValue: category.category_name,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Category name cannot be empty");
        }
        return value;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateCategory({
            categoryId: category.category_id,
            categoryData: {
              category_name: result.value,
            },
          })
        )
          .unwrap()
          .then(() => {
            Swal.fire("Updated!", "Category has been updated.", "success");
          })
          .catch((error) => {
            Swal.fire("Error!", error || "Update failed.", "error");
          });
      }
    });
  };

  const handleAddCategory = () => {
    Swal.fire({
      title: '<i class="fas fa-folder-plus"></i> New Category',
      html: `
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="fas fa-tag"></i>
          </span>
          <input 
            id="category-name" 
            class="swal2-input" 
            placeholder="Category name"
          >
        </div>
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-info-circle"></i>
          </span>
          <input 
            id="category-description" 
            class="swal2-input" 
            placeholder="Description"
          >
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-plus"></i> Add',
      cancelButtonText: '<i class="fas fa-times"></i> Cancel',
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
      preConfirm: () => {
        const name = document.getElementById("category-name").value;
        const description = document.getElementById(
          "category-description"
        ).value;

        if (!name) {
          Swal.showValidationMessage(
            '<i class="fas fa-exclamation-circle"></i> Category name is required'
          );
        }

        return {
          category_name: name,
          description,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(createCategory(result.value))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: '<i class="fas fa-check-circle"></i> Success!',
              text: "Category created successfully.",
              confirmButtonText: '<i class="fas fa-thumbs-up"></i> Great!',
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: '<i class="fas fa-exclamation-triangle"></i> Error!',
              text: error || "Creation failed.",
              confirmButtonText: '<i class="fas fa-redo"></i> Try Again',
            });
          });
      }
    });
  };
  const columns = [
    { header: "ID", field: "category_id" },
    {
      header: "Image",
      field: "image",
      render: (image) => (
        <img
          src={image}
          alt="Category"
          className="w-16 h-16 object-cover rounded-md mx-auto"
        />
      ),
    },
    { header: "Category Name", field: "category_name" },
    { header: "Description", field: "description" },
    {
      header: "Actions",
      field: "actions",
      render: (_, category) => (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg shadow-md"
            onClick={() => handleEditCategory(category)}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md"
            onClick={() => handleDeleteCategory(category.category_id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Category Management
            </h2>
            <p className="text-purple-100 mt-1">
              Manage your product categories
            </p>
          </div>
          <button
            className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-2"
            onClick={handleAddCategory}
          >
            <FaPlus />
            Add Category
          </button>
        </div>

        <div className="p-6">
          {/* Search bar */}
          <div className="flex items-center bg-gray-100 p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
            />
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredCategories} />
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
