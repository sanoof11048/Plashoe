import React, { useState, useEffect } from "react";
import axios from "axios";
import SideDash from "./SideDash";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useUser } from "../components/userContext";
import { useNavigate } from "react-router";
import ProductModal from "./ProductModal";
import NotFoundPage from "../components/404/404";
import ProductFormModal from "./AddProduct";
import axiosAuth from "../api/axiosAuth";
import ProductViewModal from "./ProductModal";

function EditProducts() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3); // default per page
  const [totalPages, setTotalPages] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    try {
      let response;
      
      if (searchTerm.trim() !== "") {
        // Search by term
        response = await axiosAuth.get(`/Product/search/${searchTerm}`);
        setIsSearching(true);
        setProducts(response.data);
        setTotalPages(1); // Search results typically don't have pagination
        setTotalProducts(response.data.length);
      } else if (category !== "All") {
        // Filter by category
        response = await axiosAuth.get(`/Product/category/${category}`);
        setIsSearching(true);
        setProducts(response.data);
        setTotalPages(1); // Category results typically don't have pagination
        setTotalProducts(response.data.length);
      } else {
        // Default pagination
        setIsSearching(false);
        response = await axiosAuth.get(
          `/Product/Pagination?page=${currentPage}&pageSize=${productsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const all = await axiosAuth.get("/Product/get-all");
        setProducts(response.data);
        setTotalProducts(all.data.length);
        setTotalPages(Math.ceil(all.data.length/productsPerPage));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage, category, searchTerm]);

  const toFilter = (categoryName) => {
    setCategory(categoryName);
    setSearchTerm(""); // Reset search when filtering
    setCurrentPage(1);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handleViewProduct = (productId) => {
    setSelectedProductId(productId);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openAddModal = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    console.log(product)
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuth
          .delete(`/Admin/product-delete/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "The product has been deleted.", "success");
            fetchProducts();
          })
          .catch((err) =>
            Swal.fire("Error", "Error deleting product", "error")
          );
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user || user.id !== 1) {
    return <NotFoundPage />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex min-h-screen">
        <div className="w-1/5 bg-gray-600 text-white p-4">
          <SideDash />
        </div>

        <div className="flex-1 p-6 bg-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-center w-full">
                Product List
              </h2>
              <button
                onClick={openAddModal}
                className="ml-auto bg-indigo-500 text-white hover:text-gray-400 px-4 py-2 rounded-lg hover:bg-indigo-600 whitespace-nowrap"
              >
                Add Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Search
                </button>
                {isSearching && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Reset
                  </button>
                )}
              </form>
            </div>

            <div className="bg-stone-400 shadow-md p-3 w-auto flex justify-between items-center">
              <div>
                <button
                  className={`bg-transparent hover:bg-white/10 backdrop-blur-sm focus:outline-none p-2 ${category === "All" ? "bg-white/30" : ""
                    }`}
                  onClick={() => toFilter("All")}
                >
                  All
                </button>
                <button
                  className={`bg-transparent hover:bg-white/10 backdrop-blur-sm focus:outline-none p-2 ${category === "Men" ? "bg-white/30" : ""
                    }`}
                  onClick={() => toFilter("Men")}
                >
                  Men
                </button>
                <button
                  className={`bg-transparent hover:bg-white/10 backdrop-blur-sm focus:outline-none p-2 ${category === "Women" ? "bg-white/30" : ""
                    }`}
                  onClick={() => toFilter("Women")}
                >
                  Women
                </button>
              </div>

              <div className="ml-auto">
                <label className="text-sm me-1">Products/Page: </label>
                <select
                  className="mt-1 ring-0 focus:outline-none rounded-lg p-1"
                  value={productsPerPage}
                  onChange={(e) => {
                    setProductsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  disabled={isSearching}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>

            {/* Results info */}
            {isSearching && (
              <div className="mt-2 mb-2 text-gray-600">
                Showing {products.length} results
                {searchTerm ? ` for "${searchTerm}"` : category !== "All" ? ` in ${category}` : ""}
              </div>
            )}

            <table className="table-auto w-full border-collapse border bg-[#fafafa] border-gray-300">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="py-2 px-4">Image</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.productId}>
                      <td className="py-2 px-4 w-8 h-8">
                        <img src={product.image} alt={product.productName} />
                      </td>
                      <td className="py-2 px-4">{product.productName}</td>
                      <td className="py-2 px-4">${product.price}</td>
                      <td className="py-5 px-8 flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewProduct(product.productId)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!isSearching && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-lg">{`${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        product={editProduct}
      />

      <ProductViewModal 
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        productId={selectedProductId}
      />
    </motion.div>
  );
}

export default EditProducts;