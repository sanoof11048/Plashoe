import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag, Star, ArrowLeft, Clock, Package2, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import axiosAuth from "../api/axiosAuth";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosAuth.get(`/Product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {o
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-80 w-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-3xl font-bold text-gray-400">Product Not Found</div>
        <p className="mt-4 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Determine the category name based on categoryId
  const category = product.categoryId === 1 ? "Men" : "Women";
  
  // Generate random rating for demo purposes (in a real app, this would come from your API)
  const rating = 4 + Math.random();
  const reviewCount = Math.floor(Math.random() * 1000) + 50;

  return (
    <>
    <div className="bg-stone-300">
        <Navbar/>
        </div>
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to products</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
           

            {/* Main Product Image */}
            <div className="lg:col-span-2 relative">
              <div className="bg-gray-50 flex items-center justify-center h-96 md:h-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-full object-contain p-6"
                />

                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                    ${category === "Men" ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}
                  `}>
                    <Tag className="w-4 h-4 mr-1" />
                    {category}
                  </span>
                </div>
              </div>

              
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2 p-6 md:p-8 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    New Arrival
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>

                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        fill={i < Math.floor(rating) ? "currentColor" : "none"}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">({reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-4 mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                    <span className="ml-2 text-lg text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</span>
                    <span className="ml-2 text-sm font-medium text-green-600">20% Off</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
                </div>

                {/* Description */}
                <div className="prose prose-sm text-gray-500 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p>{product.description || "No description available for this product."}</p>
                </div>

                {/* Details Grid */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Brand</span>
                      <span className="text-gray-900">Premium {category}wear</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Material</span>
                      <span className="text-gray-900">100% Cotton</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Style</span>
                      <span className="text-gray-900">Casual</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Collection</span>
                      <span className="text-gray-900">Spring 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
                  <Clock className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-xs font-medium text-gray-900">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
                  <Package2 className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-xs font-medium text-gray-900">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-xs font-medium text-gray-900">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </div>
    </>
  );
};

// =======
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Tag, Star, ArrowLeft, Clock, Package2, ShieldCheck } from "lucide-react";
// import Navbar from "./Navbar";
// import axiosAuth from "../api/axiosAuth";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axiosAuth.get(`/Product/${id}`);
//         setProduct(res.data);
//       } catch (err) {
//         console.error("Failed to load product", err);
//       } finally {o
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-pulse">
//           <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
//           <div className="h-80 w-80 bg-gray-200 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="text-3xl font-bold text-gray-400">Product Not Found</div>
//         <p className="mt-4 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
//       </div>
//     );
//   }

//   // Determine the category name based on categoryId
//   const category = product.categoryId === 1 ? "Men" : "Women";
  
//   // Generate random rating for demo purposes (in a real app, this would come from your API)
//   const rating = 4 + Math.random();
//   const reviewCount = Math.floor(Math.random() * 1000) + 50;

//   return (
//     <>
//     <div className="bg-stone-300">
//         <Navbar/>
//         </div>
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             <span>Back to products</span>
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
           

//             {/* Main Product Image */}
//             <div className="lg:col-span-2 relative">
//               <div className="bg-gray-50 flex items-center justify-center h-96 md:h-full overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.productName}
//                   className="w-full h-full object-contain p-6"
//                 />

//                 {/* Category Badge */}
//                 <div className="absolute top-6 left-6">
//                   <span className={`
//                     inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
//                     ${category === "Men" ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}
//                   `}>
//                     <Tag className="w-4 h-4 mr-1" />
//                     {category}
//                   </span>
//                 </div>
//               </div>

              
//             </div>

//             {/* Product Info */}
//             <div className="lg:col-span-2 p-6 md:p-8 flex flex-col">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <span className={`
//                     inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                     ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                   `}>
//                     {product.inStock ? 'In Stock' : 'Out of Stock'}
//                   </span>
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                     New Arrival
//                   </span>
//                 </div>

//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>

//                 {/* Rating Stars */}
//                 <div className="flex items-center mb-4">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         fill={i < Math.floor(rating) ? "currentColor" : "none"}
//                         className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                   <span className="ml-2 text-sm text-gray-500">({reviewCount} reviews)</span>
//                 </div>

//                 {/* Price */}
//                 <div className="mt-4 mb-6">
//                   <div className="flex items-baseline">
//                     <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
//                     <span className="ml-2 text-lg text-gray-500 line-through">₹{Math.floor(product.price * 1.2)}</span>
//                     <span className="ml-2 text-sm font-medium text-green-600">20% Off</span>
//                   </div>
//                   <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
//                 </div>

//                 {/* Description */}
//                 <div className="prose prose-sm text-gray-500 mb-8">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
//                   <p>{product.description || "No description available for this product."}</p>
//                 </div>

//                 {/* Details Grid */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-500">Brand</span>
//                       <span className="text-gray-900">Premium {category}wear</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-500">Material</span>
//                       <span className="text-gray-900">100% Cotton</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-500">Style</span>
//                       <span className="text-gray-900">Casual</span>
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-500">Collection</span>
//                       <span className="text-gray-900">Spring 2025</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Services */}
//               <div className="mt-8 grid grid-cols-3 gap-2">
//                 <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
//                   <Clock className="h-6 w-6 text-indigo-600 mb-2" />
//                   <span className="text-xs font-medium text-gray-900">Fast Delivery</span>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
//                   <Package2 className="h-6 w-6 text-indigo-600 mb-2" />
//                   <span className="text-xs font-medium text-gray-900">Free Shipping</span>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
//                   <ShieldCheck className="h-6 w-6 text-indigo-600 mb-2" />
//                   <span className="text-xs font-medium text-gray-900">Secure Checkout</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

    
//       </div>
//     </div>
//     </>
//   );
// };

// >>>>>>> 8ba31eefe9bb0b3b77c489ebabe5fde817c4117c
export default ProductDetails;