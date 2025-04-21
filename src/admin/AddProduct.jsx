import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

const ProductFormModal = ({ isOpen, onClose, onSuccess, product = null }) => {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    stock: "",
    categoryId: 1,
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && product) {
      setFormData({ ...product});
      setImagePreview(product.image);
    } else {
      setFormData({
        productName: "",
        price: "",
        stock: "",
        categoryId: 1,
        description: "",
        image: "",
      });
      setImagePreview("");
    }
    setError("");
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "categoryId" ? Number(value) : value,
    }));

    if (name === "image") {
      setImagePreview(value);
    }
  };

  const validate = () => {
    if (!formData.productName || !formData.price || !formData.description ) {
      setError("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const url = isEdit
        ? `/Admin/editProduct/${product.productId}`
        : "/Admin/addProduct";
      const method = isEdit ? axiosAuth.put : axiosAuth.post;
  
      const formDataToSend = new FormData();
      formDataToSend.append("ProductName", formData.productName);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("Stock", formData.stock);
      formDataToSend.append("CategoryId", formData.categoryId);
  
      if (formData.ImageFile) {
        formDataToSend.append("ImageFile", formData.ImageFile);
      } else if (formData.image) {
        formDataToSend.append("Image", formData.image);
      }
      
  
      // Only send ProductId if editing
      if (isEdit && product.productId) {
        formDataToSend.append("ProductId", product.productId);
      }
  
      await method(url, formDataToSend,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res)=>{
        console.log(res.data)
        toast.success(res.data.message)
        console.log(formDataToSend)
      });
  
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white  max-w-xl mx-auto mt-20 rounded shadow"
      overlayClassName="absolute inset-0  bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-lg font-bold mb-4">{isEdit ? "Edit Product" : "Add Product"}</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value={1}>Male</option>
          <option value={2}>Female</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 object-contain border rounded"
            onError={() => setImagePreview("/api/placeholder/200/200")}
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
            setFormData((prev) => ({
              ...prev,
              ImageFile: file,
            }));
          }}

          className="w-full border p-2 rounded"
        />


        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
