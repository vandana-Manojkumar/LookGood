// import { Button } from "@/components/ui/button";
// import bannerOne from "../../assets/banner-1.webp";
// import bannerTwo from "../../assets/banner-2.webp";
// import bannerThree from "../../assets/banner-3.webp";
// import {
//   Airplay,
//   BabyIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CloudLightning,
//   Heater,
//   Images,
//   Shirt,
//   ShirtIcon,
//   ShoppingBasket,
//   UmbrellaIcon,
//   WashingMachine,
//   WatchIcon,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { useNavigate } from "react-router-dom";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "@/components/ui/use-toast";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import { getFeatureImages } from "@/store/common-slice";

// const categoriesWithIcon = [
//   { id: "men", label: "Men", icon: ShirtIcon },
//   { id: "women", label: "Women", icon: CloudLightning },
//   { id: "kids", label: "Kids", icon: BabyIcon },
//   { id: "accessories", label: "Accessories", icon: WatchIcon },
//   { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
// ];

// const brandsWithIcon = [
//   { id: "nike", label: "Nike", icon: Shirt },
//   { id: "adidas", label: "Adidas", icon: WashingMachine },
//   { id: "puma", label: "Puma", icon: ShoppingBasket },
//   { id: "levi", label: "Levi's", icon: Airplay },
//   { id: "zara", label: "Zara", icon: Images },
//   { id: "h&m", label: "H&M", icon: Heater },
// ];


// function ShoppingHome() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const { productList, productDetails } = useSelector(
//     (state) => state.shopProducts
//   );
//   const { featureImageList } = useSelector((state) => state.commonFeature);

//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

//   const { user } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   function handleNavigateToListingPage(getCurrentItem, section) {
//     sessionStorage.removeItem("filters");
//     const currentFilter = {
//       [section]: [getCurrentItem.id],
//     };

//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));
//     navigate(`/shop/listing`);
//   }

//   function handleGetProductDetails(getCurrentProductId) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId) {
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

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [featureImageList]);

//   useEffect(() => {
//     dispatch(
//       fetchAllFilteredProducts({
//         filterParams: {},
//         sortParams: "price-lowtohigh",
//       })
//     );
//   }, [dispatch]);

//   console.log(productList, "productList");

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="relative w-full h-[600px] overflow-hidden">
//         {featureImageList && featureImageList.length > 0
//           ? featureImageList.map((slide, index) => (
//               <img
//                 src={slide?.image}
//                 key={index}
//                 className={`${
//                   index === currentSlide ? "opacity-100" : "opacity-0"
//                 } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
//               />
//             ))
//           : null}
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() =>
//             setCurrentSlide(
//               (prevSlide) =>
//                 (prevSlide - 1 + featureImageList.length) %
//                 featureImageList.length
//             )
//           }
//           className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
//         >
//           <ChevronLeftIcon className="w-4 h-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() =>
//             setCurrentSlide(
//               (prevSlide) => (prevSlide + 1) % featureImageList.length
//             )
//           }
//           className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
//         >
//           <ChevronRightIcon className="w-4 h-4" />
//         </Button>
//       </div>
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Shop by category
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             {categoriesWithIcon.map((categoryItem) => (
//               <Card
//                 onClick={() =>
//                   handleNavigateToListingPage(categoryItem, "category")
//                 }
//                 className="cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
//                   <span className="font-bold">{categoryItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {brandsWithIcon.map((brandItem) => (
//               <Card
//                 onClick={() => handleNavigateToListingPage(brandItem, "brand")}
//                 className="cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <CardContent className="flex flex-col items-center justify-center p-6">
//                   <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
//                   <span className="font-bold">{brandItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Feature Products
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {productList && productList.length > 0
//               ? productList.map((productItem) => (
//                   <ShoppingProductTile
//                     handleGetProductDetails={handleGetProductDetails}
//                     product={productItem}
//                     handleAddtoCart={handleAddtoCart}
//                   />
//                 ))
//               : null}
//           </div>
//         </div>
//       </section>
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingHome;











import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

import VideoSection from "../../components/admin-view/VideoSection";




const categoriesWithImages = [
  {
    id: "men",
    label: "Men",
    image: <img 
      src="/images/29482642-three-men-fashion-metraseksualy-shop-shopping-walk.jpg"
      alt="Men's Fashion"
      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
    />
  },
  {
    id: "women",
    label: "Women",
    image: <img 
      src="/images/happy-young-group-women-shopping-big-mall-bags-78254692.webp"
      alt="Women's Fashion"
      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
    />
  },
  {
    id: "kids",
    label: "Kids",
    image: <img 
      src="/images/360_F_209237853_PkcPTlx2zh7HIx7xFS0pe7xNWV02fP3v.jpg"
      alt="Kids' Fashion"
      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
    />
  },
  {
    id: "accessories",
    label: "Accessories",
    image: <img 
      src="/images/fashion-women-stylish-accessories-outfit-600nw-1532053424.webp"
      alt="Accessories"
      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
    />
  },
  {
    id: "footwear",
    label: "Footwear",
    image: <img 
      src="/images/download (1).jpg"
      alt="Footwear"
      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
    />
  }
];

const brandsWithLogos = [
    {
      id: "nike",
      label: "Nike",
      logo: <img 
        src="/images/download.jpg" 
        alt="Nike logo" 
        className="w-24 h-12 object-contain"
      />
    },
    {
      id: "adidas",
      label: "Adidas",
      logo: <img 
        src="/images/download (3).png" 
        alt="Adidas logo"
        className="w-24 h-12 object-contain"
      />
    },
    {
      id: "puma",
      label: "Puma",
      logo: <img 
        src="/images/puma-logo-and-art-free-vector.jpg" 
        alt="Puma logo"
        className="w-24 h-12 object-contain"
      />
    },
    {
      id: "levi",
      label: "Levi's",
      logo: <img 
        src="/images/download (2).png" 
        alt="Levi's logo"
        className="w-24 h-12 object-contain"
      />
    },
    {
      id: "zara",
      label: "Zara",
      logo: <img 
        src="/images/download (4).png" 
        alt="Zara logo"
        className="w-24 h-12 object-contain"
      />
    },
    {
      id: "h&m",
      label: "H&M",
      logo: <img 
        src="/images/download.png" 
        alt="H&M logo"
        className="w-24 h-12 object-contain"
      />
    }
  ];
  

function ShoppingHome() {
  const [uniqueKeys, setUniqueKeys] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    window.scrollTo(0, 0);
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);


  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);
  useEffect(() => {
    setUniqueKeys([Date.now(), Date.now() + 1]);
  }, []);


  return (
    




    <div className="mt-20 flex flex-col min-h-screen">
      {/* Hero Slider Section */}
      <div className="  relative w-full h-auto min-h-[250px] sm:min-h-[350px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden ">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
            <img
            src={slide?.image}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000`}
            alt={`Slide ${index + 1}`}
          />
          
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80 w-8 h-8 sm:w-10 sm:h-10"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80 w-8 h-8 sm:w-10 sm:h-10"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>





{/* 1st vedio section */}

       <div>
        <VideoSection uniqueKey={uniqueKeys[0]} numAds={1} />
      </div>




      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithImages.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {categoryItem.image}
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithLogos.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {brandItem.logo}
                  <span className="font-bold mt-4">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



   {/* 2nd vedio section     */}
   <div>
        <VideoSection uniqueKey={uniqueKeys[1]} numAds={1} />
      </div>


      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
