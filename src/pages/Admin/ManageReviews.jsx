import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../../redux/reviewsSilce";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaStar,
  FaCheck,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";

import Table from "../../components/common/Table";

const ManageReviews = () => {
  const dispatch = useDispatch();
  const {
    reviews = [],
    loading,
    error,
  } = useSelector((state) => state.reviews);
  const [search, setSearch] = useState("");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const filteredReviews =
    reviews?.filter((review) => {
      const matchesSearch = review.comment
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesIsVerified =
        isVerifiedFilter === "all" ||
        review.is_verified === (isVerifiedFilter === "verified");
      return matchesSearch && matchesIsVerified;
    }) ?? [];

  // Verification options for dropdown
  const verificationOptions = [
    {
      value: "all",
      label: "All Reviews",
      color: "gray",
      count: reviews.length,
    },
    {
      value: "verified",
      label: "Verified",
      color: "green",
      count: reviews.filter((r) => r.is_verified).length,
    },
    {
      value: "unverified",
      label: "Unverified",
      color: "yellow",
      count: reviews.filter((r) => !r.is_verified).length,
    },
  ];

  const getVerificationBadgeColor = (is_verified) => {
    return is_verified
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getCurrentVerificationLabel = () => {
    const current = verificationOptions.find(
      (option) => option.value === isVerifiedFilter
    );
    return current ? current.label : "All Reviews";
  };

  if (loading) {
    return <p className="text-blue-500 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const handleUpdateReviewVerification = (review_id) => {
    if (!review_id) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid review ID.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    Swal.fire({
      title: "Update Verification Status",
      html: `
        <div class="mb-3">
          <p class="text-gray-700 mb-2">Select verification status for this review:</p>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center">
              <input type="radio" name="is_verified" value="verified" class="form-radio h-5 w-5 text-green-600" checked>
              <span class="ml-2 text-gray-700">Verified</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="is_verified" value="unverified" class="form-radio h-5 w-5 text-yellow-600">
              <span class="ml-2 text-gray-700">Unverified</span>
            </label>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return {
          is_verified:
            document.querySelector('input[name="is_verified"]:checked')
              .value === "verified",
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedVerification = result.value.is_verified;

        dispatch(
          updateReviewStatus({
            reviewId: review_id,
            statusData: { is_verified: selectedVerification },
          })
        )
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Update Successful!",
              text: `Verification status set to ${
                selectedVerification ? "Verified" : "Unverified"
              }.`,
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Update Failed!",
              text: error || "Unable to update verification status.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const handleDeleteReview = (review_id) => {
    Swal.fire({
      title: "Delete Review",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "10px",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(review_id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The review has been deleted successfully.",
              confirmButtonColor: "#3085d6",
              timer: 2000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Deletion Failed!",
              text: error || "Unable to delete the review.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const columns = [
    { header: "ID", field: "review_id" },
    {
      header: "Rating",
      field: "rating",
      render: (_, review) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < review.rating ? "text-yellow-400" : "text-gray-300"
              }
            />
          ))}
        </div>
      ),
    },
    { header: "Comment", field: "comment" },
    {
      header: "Product",
      field: "product_id",
      render: (_, review) => review.product?.product_name || "Unknown",
    },
    {
      header: "User",
      field: "user_id",
      render: (_, review) => review.user?.username || "Unknown",
    },
    {
      header: "Verification",
      field: "is_verified",
      render: (_, review) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getVerificationBadgeColor(
            review.is_verified
          )}`}
        >
          {review.is_verified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      header: "Actions",
      field: "actions",
      render: (_, review) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Update verification status"
            onClick={() => handleUpdateReviewVerification(review?.review_id)}
          >
            <FaCheck />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="Delete review"
            onClick={() => handleDeleteReview(review?.review_id)}
          >
            <FaTrash />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
            title="View details"
            onClick={() =>
              Swal.fire(
                "Review Details",
                `Details: ${review.comment || "No comment"}`,
                "info"
              )
            }
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <h2 className="text-2xl font-bold text-white">Manage Reviews</h2>
          <p className="text-green-100 mt-1">Manage all customer reviews</p>
        </div>

        <div className="p-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search bar */}
            <div className="flex-1 flex items-center bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Search by comment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
              />
            </div>

            {/* Verification Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-white border-2 border-gray-200 hover:border-blue-300 px-4 py-4 rounded-xl shadow-sm min-w-[200px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="flex items-center">
                  <FaFilter className="text-gray-500 mr-2" />
                  <span className="text-gray-800 font-medium">
                    {getCurrentVerificationLabel()}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {verificationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setIsVerifiedFilter(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                        isVerifiedFilter === option.value
                          ? "bg-blue-50 border-r-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${
                            option.color === "green"
                              ? "bg-green-500"
                              : option.color === "yellow"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                        ></span>
                        <span className="font-medium text-gray-800">
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          option.color === "green"
                            ? "bg-green-100 text-green-800"
                            : option.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {option.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center mb-2">
                <FaStar className="text-blue-500 text-xl mr-2" />
                <p className="text-blue-500 font-medium">Total Reviews</p>
              </div>
              <p className="text-2xl font-bold">{reviews.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
              <div className="flex items-center mb-2">
                <FaCheck className="text-green-500 text-xl mr-2" />
                <p className="text-green-500 font-medium">Verified Reviews</p>
              </div>
              <p className="text-2xl font-bold">
                {reviews.filter((r) => r.is_verified).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
              <div className="flex items-center mb-2">
                <FaStar className="text-yellow-500 text-xl mr-2" />
                <p className="text-yellow-500 font-medium">
                  Unverified Reviews
                </p>
              </div>
              <p className="text-2xl font-bold">
                {reviews.filter((r) => !r.is_verified).length}
              </p>
            </div>
          </div>

          {/* Active Filter Display */}
          {isVerifiedFilter !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getVerificationBadgeColor(
                  isVerifiedFilter === "verified"
                )}`}
              >
                {getCurrentVerificationLabel()}
              </span>
              <button
                onClick={() => setIsVerifiedFilter("all")}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
          </div>

          {/* Table Component */}
          <Table columns={columns} data={filteredReviews} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
