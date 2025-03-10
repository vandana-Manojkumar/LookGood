// import { StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { Label } from "../ui/label";
// import StarRatingComponent from "../common/star-rating";
// import { useEffect, useState } from "react";
// import { addReview, getReviews } from "@/store/shop/review-slice";

// function ProductDetailsDialog({ open, setOpen, productDetails }) {
//   const [reviewMsg, setReviewMsg] = useState("");
//   const [rating, setRating] = useState(0);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { reviews } = useSelector((state) => state.shopReview);

//   const { toast } = useToast();

//   function handleRatingChange(getRating) {
//     console.log(getRating, "getRating");

//     setRating(getRating);
//   }

//   function handleAddToCart(getCurrentProductId, getTotalStock) {
//     let getCartItems = cartItems.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Only ${getQuantity} quantity can be added for this item`,
//             variant: "destructive",
//           });

//           return;
//         }
//       }
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   function handleDialogClose() {
//     setOpen(false);
//     dispatch(setProductDetails());
//     setRating(0);
//     setReviewMsg("");
//   }

//   function handleAddReview() {
//     dispatch(
//       addReview({
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       })
//     ).then((data) => {
//       if (data.payload.success) {
//         setRating(0);
//         setReviewMsg("");
//         dispatch(getReviews(productDetails?._id));
//         toast({
//           title: "Review added successfully!",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));
//   }, [productDetails]);

//   console.log(reviews, "reviews");

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
//         reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>
//       <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
//         <div className="relative overflow-hidden rounded-lg">
//           <img
//             src={productDetails?.image}
//             alt={productDetails?.title}
//             width={600}
//             height={600}
//             className="aspect-square w-full object-cover"
//           />
//         </div>
//         <div className="">
//           <div>
//             <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
//             <p className="text-muted-foreground text-2xl mb-5 mt-4">
//               {productDetails?.description}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <p
//               className={`text-3xl font-bold text-primary ${
//                 productDetails?.salePrice > 0 ? "line-through" : ""
//               }`}
//             >
//               ${productDetails?.price}
//             </p>
//             {productDetails?.salePrice > 0 ? (
//               <p className="text-2xl font-bold text-muted-foreground">
//                 ${productDetails?.salePrice}
//               </p>
//             ) : null}
//           </div>
//           <div className="flex items-center gap-2 mt-2">
//             <div className="flex items-center gap-0.5">
//               <StarRatingComponent rating={averageReview} />
//             </div>
//             <span className="text-muted-foreground">
//               ({averageReview.toFixed(2)})
//             </span>
//           </div>
//           <div className="mt-5 mb-5">
//             {productDetails?.totalStock === 0 ? (
//               <Button className="w-full opacity-60 cursor-not-allowed">
//                 Out of Stock
//               </Button>
//             ) : (
//               <Button
//                 className="w-full"
//                 onClick={() =>
//                   handleAddToCart(
//                     productDetails?._id,
//                     productDetails?.totalStock
//                   )
//                 }
//               >
//                 Add to Cart
//               </Button>
//             )}
//           </div>
//           <Separator />
//           <div className="max-h-[300px] overflow-auto">
//             <h2 className="text-xl font-bold mb-4">Reviews</h2>
//             <div className="grid gap-6">
//               {reviews && reviews.length > 0 ? (
//                 reviews.map((reviewItem) => (
//                   <div className="flex gap-4">
//                     <Avatar className="w-10 h-10 border">
//                       <AvatarFallback>
//                         {reviewItem?.userName[0].toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid gap-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-bold">{reviewItem?.userName}</h3>
//                       </div>
//                       <div className="flex items-center gap-0.5">
//                         <StarRatingComponent rating={reviewItem?.reviewValue} />
//                       </div>
//                       <p className="text-muted-foreground">
//                         {reviewItem.reviewMessage}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <h1>No Reviews</h1>
//               )}
//             </div>
//             <div className="mt-10 flex-col flex gap-2">
//               <Label>Write a review</Label>
//               <div className="flex gap-1">
//                 <StarRatingComponent
//                   rating={rating}
//                   handleRatingChange={handleRatingChange}
//                 />
//               </div>
//               <Input
//                 name="reviewMsg"
//                 value={reviewMsg}
//                 onChange={(event) => setReviewMsg(event.target.value)}
//                 placeholder="Write a review..."
//               />
//               <Button
//                 onClick={handleAddReview}
//                 disabled={reviewMsg.trim() === ""}
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ProductDetailsDialog;






// import { StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { Label } from "../ui/label";
// import StarRatingComponent from "../common/star-rating";
// import { useEffect, useState } from "react";
// import { addReview, getReviews } from "@/store/shop/review-slice";

// function ProductDetailsDialog({ open, setOpen, productDetails }) {
//   const [reviewMsg, setReviewMsg] = useState("");
//   const [rating, setRating] = useState(0);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { reviews } = useSelector((state) => state.shopReview);

//   const { toast } = useToast();

//   function handleRatingChange(getRating) {
//     console.log(getRating, "getRating");
//     setRating(getRating);
//   }

//   function handleAddToCart(getCurrentProductId, getTotalStock) {
//     let getCartItems = cartItems.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Only ${getQuantity} quantity can be added for this item`,
//             variant: "destructive",
//           });
//           return;
//         }
//       }
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   function handleDialogClose() {
//     setOpen(false);
//     dispatch(setProductDetails());
//     setRating(0);
//     setReviewMsg("");
//   }

//   function handleAddReview() {
//     dispatch(
//       addReview({
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       })
//     ).then((data) => {
//       if (data.payload.success) {
//         setRating(0);
//         setReviewMsg("");
//         dispatch(getReviews(productDetails?._id));
//         toast({
//           title: "Review added successfully!",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));
//   }, [productDetails]);

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
//         reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>
//       <DialogContent className="p-4 sm:p-6 md:p-8 w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] h-[90vh] overflow-y-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//           <div className="relative overflow-hidden rounded-lg">
//             <img
//               src={productDetails?.image}
//               alt={productDetails?.title}
//               width={600}
//               height={600}
//               className="aspect-square w-full object-cover"
//             />
//           </div>
//           <div className="flex flex-col h-full">
//             <div>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">{productDetails?.title}</h1>
//               <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-3 mt-2">
//                 {productDetails?.description}
//               </p>
//             </div>
//             <div className="flex items-center justify-between">
//               <p
//                 className={`text-xl md:text-2xl font-bold text-primary ${
//                   productDetails?.salePrice > 0 ? "line-through" : ""
//                 }`}
//               >
//                 ${productDetails?.price}
//               </p>
//               {productDetails?.salePrice > 0 ? (
//                 <p className="text-lg md:text-xl font-bold text-muted-foreground">
//                   ${productDetails?.salePrice}
//                 </p>
//               ) : null}
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="flex items-center gap-0.5">
//                 <StarRatingComponent rating={averageReview} />
//               </div>
//               <span className="text-muted-foreground">
//                 ({averageReview.toFixed(2)})
//               </span>
//             </div>
//             <div className="mt-4 mb-4">
//               {productDetails?.totalStock === 0 ? (
//                 <Button className="w-full opacity-60 cursor-not-allowed">
//                   Out of Stock
//                 </Button>
//               ) : (
//                 <Button
//                   className="w-full"
//                   onClick={() =>
//                     handleAddToCart(
//                       productDetails?._id,
//                       productDetails?.totalStock
//                     )
//                   }
//                 >
//                   Add to Cart
//                 </Button>
//               )}
//             </div>
//             <Separator />
//             <div className="flex-1 overflow-y-auto mt-4">
//               <h2 className="text-lg md:text-xl font-bold mb-4">Reviews</h2>
//               <div className="grid gap-4">
//                 {reviews && reviews.length > 0 ? (
//                   reviews.map((reviewItem) => (
//                     <div className="flex gap-3" key={reviewItem.id}>
//                       <Avatar className="w-8 h-8 md:w-10 md:h-10 border">
//                         <AvatarFallback>
//                           {reviewItem?.userName[0].toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="grid gap-1">
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-bold">{reviewItem?.userName}</h3>
//                         </div>
//                         <div className="flex items-center gap-0.5">
//                           <StarRatingComponent rating={reviewItem?.reviewValue} />
//                         </div>
//                         <p className="text-muted-foreground text-sm md:text-base">
//                           {reviewItem.reviewMessage}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <h1>No Reviews</h1>
//                 )}
//               </div>
//               <div className="mt-6 flex-col flex gap-2">
//                 <Label>Write a review</Label>
//                 <div className="flex gap-1">
//                   <StarRatingComponent
//                     rating={rating}
//                     handleRatingChange={handleRatingChange}
//                   />
//                 </div>
//                 <Input
//                   name="reviewMsg"
//                   value={reviewMsg}
//                   onChange={(event) => setReviewMsg(event.target.value)}
//                   placeholder="Write a review..."
//                 />
//                 <Button
//                   onClick={handleAddReview}
//                   disabled={reviewMsg.trim() === ""}
//                 >
//                   Submit
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ProductDetailsDialog;









import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);
  const [alreadyReviewedAlert, setAlreadyReviewedAlert] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  // This would need to come from your state
  const orderHistory = useSelector((state) => state.orders?.orderHistory || []);

  const { toast } = useToast();

  // Enhanced debugging for key data
  useEffect(() => {
    console.log("Product Details:", productDetails);
    console.log("User:", user);
    console.log("Order History:", orderHistory);
    console.log("Reviews:", reviews);
  }, [productDetails, user, orderHistory, reviews]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setShowPurchaseAlert(false);
    setAlreadyReviewedAlert(false);
  }

  // Fixed function to check if user has purchased this product
  function hasUserPurchasedProduct(productId) {
    console.log("Checking purchase for product:", productId);
    
    if (!orderHistory || !Array.isArray(orderHistory) || orderHistory.length === 0) {
      console.log("No order history available");
      return false;
    }
    
    // Check each order for the product
    for (const order of orderHistory) {
      console.log("Checking order:", order);
      
      // If the order doesn't have items, skip it
      if (!order.items || !Array.isArray(order.items)) {
        continue;
      }
      
      // Check each item in the order
      for (const item of order.items) {
        console.log("Checking item:", item);
        
        // Check for different possible ID keys and status values
        const itemProductId = item.productId || item.product_id || item._id;
        const orderStatus = typeof order.status === 'string' ? order.status.toLowerCase() : '';
        
        // Check if this product matches and the order is in a completed state
        if (itemProductId === productId && 
            (orderStatus.includes('deliver') || 
             orderStatus.includes('complet') || 
             orderStatus === 'success' || 
             orderStatus === 'shipped')) {
          console.log("Found purchase match!");
          return true;
        }
      }
    }
    
    console.log("No purchase found");
    return false;
  }

  // Function to check if user has already reviewed this product
  function hasUserAlreadyReviewed(productId) {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0 || !user) {
      return false;
    }
    
    const hasReview = reviews.some(review => {
      const reviewUserId = review.userId || review.user_id;
      const reviewProductId = review.productId || review.product_id;
      return reviewUserId === user.id && reviewProductId === productId;
    });
    
    console.log("Has user already reviewed:", hasReview);
    return hasReview;
  }

  function handleAddReview() {
    if (reviewMsg.trim() === "" || rating === 0) {
      toast({
        title: "Please add a review message and rating",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has already reviewed this product
    if (hasUserAlreadyReviewed(productDetails?._id)) {
      setAlreadyReviewedAlert(true);
      return;
    }
    
    // TEMPORARY FOR TESTING - Skip purchase check
    const bypassPurchaseCheck = true;
    
    // Check if user has purchased the product (unless bypassing)
    if (!bypassPurchaseCheck && !hasUserPurchasedProduct(productDetails?._id)) {
      // Show purchase required message
      setShowPurchaseAlert(true);
      return;
    }
    
    // Submit the review
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName || user?.name || "User",
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload && data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: data.payload?.message || "You need to purchase this product before you can write a review.",
          variant: "destructive",
        });
      }
    }).catch(error => {
      console.error("Error adding review:", error);
      toast({
        title: "You need to purchase this product before you can write a review.",
        variant: "destructive",
      });
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + (reviewItem.reviewValue || 0), 0) /
        reviews.length
      : 0;

  return (
    <>
      {/* Main product dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="p-4 sm:p-6 md:p-8 w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="flex flex-col h-full">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">{productDetails?.title}</h1>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-3 mt-2">
                  {productDetails?.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-xl md:text-2xl font-bold text-primary ${
                    productDetails?.salePrice > 0 ? "line-through" : ""
                  }`}
                >
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 ? (
                  <p className="text-lg md:text-xl font-bold text-muted-foreground">
                    ${productDetails?.salePrice}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-muted-foreground">
                  ({averageReview.toFixed(2)})
                </span>
              </div>
              <div className="mt-4 mb-4">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full opacity-60 cursor-not-allowed">
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
              <Separator />
              <div className="flex-1 overflow-y-auto mt-4">
                <h2 className="text-lg md:text-xl font-bold mb-4">Reviews</h2>
                <div className="grid gap-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem) => (
                      <div className="flex gap-3" key={reviewItem._id || reviewItem.id}>
                        <Avatar className="w-8 h-8 md:w-10 md:h-10 border">
                          <AvatarFallback>
                            {reviewItem?.userName && reviewItem.userName[0] ? reviewItem.userName[0].toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{reviewItem?.userName || "User"}</h3>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Verified Purchase</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={reviewItem?.reviewValue || 0} />
                          </div>
                          <p className="text-muted-foreground text-sm md:text-base">
                            {reviewItem.reviewMessage || "No comment provided"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Reviews Yet</p>
                  )}
                </div>
                <div className="mt-6 flex-col flex gap-2">
                  <Label>Write a review</Label>
                  <div className="flex gap-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === "" || rating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase required popup dialog */}
      <Dialog open={showPurchaseAlert} onOpenChange={setShowPurchaseAlert}>
        <DialogContent className="p-6 max-w-md">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold">Purchase Required</h2>
            <p className="text-gray-600">
              You need to purchase this product before you can write a review. 
              Only verified buyers can leave reviews for products.
            </p>
            <Button 
              className="w-full mt-2" 
              onClick={() => setShowPurchaseAlert(false)}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Already reviewed popup dialog */}
      <Dialog open={alreadyReviewedAlert} onOpenChange={setAlreadyReviewedAlert}>
        <DialogContent className="p-6 max-w-md">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Review Already Submitted</h2>
            <p className="text-gray-600">
              You have already submitted a review for this product. 
              Each customer can only submit one review per product.
            </p>
            <Button 
              className="w-full mt-2" 
              onClick={() => setAlreadyReviewedAlert(false)}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductDetailsDialog;