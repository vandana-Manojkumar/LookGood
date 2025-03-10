// import { Card, CardContent, CardFooter } from "../ui/card";
// import { Button } from "../ui/button";
// import { brandOptionsMap, categoryOptionsMap } from "@/config";
// import { Badge } from "../ui/badge";

// function ShoppingProductTile({
//   product,
//   handleGetProductDetails,
//   handleAddtoCart,
// }) {
//   return (
//     <Card className="w-full max-w-sm mx-auto">
//       <div onClick={() => handleGetProductDetails(product?._id)}>
//         <div className="relative">
//           <img
//             src={product?.image}
//             alt={product?.title}
//             className="w-full h-[300px] object-cover rounded-t-lg"
//           />
//           {product?.totalStock === 0 ? (
//             <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
//               Out Of Stock
//             </Badge>
//           ) : product?.totalStock < 10 ? (
//             <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
//               {`Only ${product?.totalStock} items left`}
//             </Badge>
//           ) : product?.salePrice > 0 ? (
//             <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
//               Sale
//             </Badge>
//           ) : null}
//         </div>
//         <CardContent className="p-4">
//           <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-[16px] text-muted-foreground">
//               {categoryOptionsMap[product?.category]}
//             </span>
//             <span className="text-[16px] text-muted-foreground">
//               {brandOptionsMap[product?.brand]}
//             </span>
//           </div>
//           <div className="flex justify-between items-center mb-2">
//             <span
//               className={`${
//                 product?.salePrice > 0 ? "line-through" : ""
//               } text-lg font-semibold text-primary`}
//             >
//               ${product?.price}
//             </span>
//             {product?.salePrice > 0 ? (
//               <span className="text-lg font-semibold text-primary">
//                 ${product?.salePrice}
//               </span>
//             ) : null}
//           </div>
//         </CardContent>
//       </div>
//       <CardFooter>
//         {product?.totalStock === 0 ? (
//           <Button className="w-full opacity-60 cursor-not-allowed">
//             Out Of Stock
//           </Button>
//         ) : (
//           <Button
//             onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
//             className="w-full"
//           >
//             Add to cart
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// export default ShoppingProductTile;






import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Eye, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Track cart count to prevent over-adding
  const [cartCount, setCartCount] = useState(0);

  // Function to handle adding to cart with enhanced stock validation
  const handleAddToCartWithValidation = () => {
    if (!product || product.totalStock === 0) {
      toast({
        title: "Error",
        description: "This product is out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we're trying to add more than what's available
    if (cartCount >= product.totalStock) {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${product.totalStock} items available. You already have ${cartCount} in your cart.`,
        variant: "destructive",
      });
      return;
    }
    
    // Animation effect
    setIsAddingToCart(true);
    
    // Increment our local cart count
    const newCartCount = cartCount + 1;
    setCartCount(newCartCount);
    
    // Call the parent function with quantity 1
    handleAddtoCart(product?._id, 1);
    
    // Reset animation after delay
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  return (
    <Card 
      className="w-full max-w-sm mx-auto relative group transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Product status badges */}
        {product?.totalStock === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 w-full py-3 text-center transform rotate-6 shadow-lg">
              <span className="text-white font-bold text-lg uppercase tracking-wider animate-pulse">Out Of Stock</span>
            </div>
          </div>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 animate-pulse shadow-md">
            {`Only ${product?.totalStock} items left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 shadow-md">
            Sale
          </Badge>
        ) : null}
        
        {/* Quick action buttons overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white text-black hover:bg-white/90 transition-transform hover:scale-110 shadow-lg"
              onClick={() => handleGetProductDetails(product?._id)}
            >
              <Eye className="h-5 w-5" />
            </Button>
            
            {product?.totalStock > 0 && cartCount < product.totalStock && (
              <Button 
                variant="secondary" 
                size="icon" 
                className={`rounded-full ${isAddingToCart ? 'bg-green-500 text-white' : 'bg-white text-black'} hover:bg-white/90 transition-all duration-300 hover:scale-110 ${isAddingToCart ? 'animate-bounce' : ''} shadow-lg`}
                onClick={handleAddToCartWithValidation}
              >
                {isAddingToCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              </Button>
            )}
          </div>
          
          {/* Stock status indication - visible on hover */}
          {product?.totalStock > 0 && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <Badge className="bg-white/90 text-black font-medium">
                {cartCount > 0 ? 
                  `${cartCount} in cart (${product.totalStock - cartCount} left)` : 
                  `${product.totalStock} in stock`}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 transition-all duration-300 group-hover:bg-gray-50">
        <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">{product?.title}</h2>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-[16px] text-muted-foreground">
            {categoryOptionsMap[product?.category]}
          </span>
          <span className="text-[16px] text-muted-foreground">
            {brandOptionsMap[product?.brand]}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through text-gray-500" : ""
            } text-lg font-semibold text-primary transition-colors duration-300`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 ? (
            <span className="text-lg font-semibold text-red-600 animate-pulse">
              ${product?.salePrice}
            </span>
          ) : null}
        </div>
        
        {/* Simple stock indicator without progress bars */}
        {product?.totalStock > 0 ? (
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-medium ${
              product.totalStock < 5 ? 'text-orange-600' : 
              product.totalStock < 20 ? 'text-blue-600' : 'text-green-600'
            }`}>
              {product.totalStock < 10 ? 
                `Only ${product.totalStock} items left in stock!` : 
                `${product.totalStock} in stock`}
            </span>
          </div>
        ) : (
          <div className="mt-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
              Out of stock
            </Badge>
          </div>
        )}
        
        {/* Product rating */}
        {product?.rating && (
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product?.reviewCount || 0} reviews)
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 bg-gray-50 transition-all duration-300 group-hover:bg-gray-100">
        {product?.totalStock === 0 ? (
          <Button className="w-full bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-60">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Out Of Stock
            </span>
          </Button>
        ) : cartCount >= product.totalStock ? (
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Max Stock Added
            </span>
          </Button>
        ) : (
          <Button
            onClick={handleAddToCartWithValidation}
            className={`w-full transition-all duration-300 relative overflow-hidden group-hover:shadow-lg ${
              isAddingToCart ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-blue-700'
            }`}
          >
            <span className={`relative z-10 flex items-center justify-center gap-2 ${
              isAddingToCart ? 'animate-pulse' : ''
            }`}>
              {isAddingToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart {cartCount > 0 ? `(${cartCount})` : ''}
                </>
              )}
            </span>
            <span className={`absolute inset-0 ${
              isAddingToCart ? 'bg-green-700' : 'bg-blue-800'
            } transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}></span>
          </Button>
        )}
      </CardFooter>
      
      {/* Quick view label - appears on hover */}
      <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <Badge 
          className="bg-black hover:bg-black/80 cursor-pointer transition-transform hover:scale-105 shadow-md" 
          onClick={() => handleGetProductDetails(product?._id)}
        >
          Quick View
        </Badge>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;