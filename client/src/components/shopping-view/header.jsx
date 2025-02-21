
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id]
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }
    
    setClickedItem(getCurrentMenuItem.id);
    setTimeout(() => setClickedItem(null), 500); // Reset clicked state after animation
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
  {shoppingViewHeaderMenuItems.map((menuItem) => (
    <div
      key={menuItem.id}
      className="relative"
      onMouseEnter={() => setHoveredItem(menuItem.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Label
        onClick={() => handleNavigate(menuItem)}
        className={`
          text-sm font-bold cursor-pointer 
          transition-all duration-300 flex items-center gap-1
          relative px-4 py-2 rounded-md
          overflow-hidden
          ${hoveredItem === menuItem.id ? 'text-white' : 'text-gray-1000'} 
          ${clickedItem === menuItem.id ? 'scale-95' : 'scale-150'}
        `}
      >
        {/* Hover background effect */}
        <span
          className={`
            absolute inset-0 bg-primary
            transition-all duration-300 ease-out
            ${hoveredItem === menuItem.id ? 'opacity-100' : 'opacity-0'}
            ${hoveredItem === menuItem.id ? 'scale-100' : 'scale-0'}
            rounded-md
          `}
          style={{
            transform: hoveredItem === menuItem.id ? 'scale(1)' : 'scale(0.7)',
            transformOrigin: 'center'
          }}
        />
        
        {/* Menu item text */}
        <span className="relative z-10">
          {menuItem.label}
        </span>
        
        {/* Glow effect */}
        <span
          className={`
            absolute inset-0 bg-primary/20 blur-lg
            transition-all duration-300
            ${hoveredItem === menuItem.id ? 'opacity-100' : 'opacity-0'}
            ${clickedItem === menuItem.id ? 'scale-110' : 'scale-0'}
          `}
        />
      </Label>
    </div>
  ))}
</nav>
  );
}

// Rest of the code remains the same (HeaderRightContent and ShoppingHeader components)
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors duration-200"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black hover:bg-gray-800 transition-colors duration-200">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          {/* <img src="/public/Lookgood.jpg" alt="LookGood Logo" className="h-8 w-8 object-contain" /> */}
          <span className="lookgood-text">LookGood</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden hover:bg-gray-100 transition-colors duration-200">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
  
      {/* 🔥 Enhanced Dark Text + Neon Glow Effects */}
      <style>
        {`
          /* LookGood Text Styling */
          .lookgood-text {
            font-size: 1.8rem;
            font-weight: bold;
            letter-spacing: 2px;
            color: black;
            position: relative;
          }
  
          /* Multi-Layered Glow & Shadow */
          .lookgood-text::before {
            content: "LookGood";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            color: black;
            text-shadow:
              0px 0px 5px rgba(255, 255, 255, 0.3),
              0px 0px 10px rgba(255, 255, 255, 0.4),
              -3px 3px 5px rgba(0, 0, 0, 0.7),
              3px -3px 5px rgba(0, 0, 0, 0.7),
              0px 0px 20px rgba(0, 0, 0, 0.8);
          }
  
          /* Neon Shadow Animation */
          .lookgood-text::after {
            content: "LookGood";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            color: black;
            text-shadow:
              0px 0px 5px rgba(0, 0, 0, 0.6),
              0px 0px 15px rgba(0, 0, 0, 0.5),
              0px 0px 30px rgba(0, 0, 0, 0.4);
            animation: darkGlow 1.5s infinite alternate ease-in-out;
          }
  
          /* Animation for a pulsing glow */
          @keyframes darkGlow {
            0% {
              text-shadow:
                0px 0px 10px rgba(0, 0, 0, 0.7),
                0px 0px 20px rgba(0, 0, 0, 0.6),
                0px 0px 30px rgba(0, 0, 0, 0.5);
            }
            100% {
              text-shadow:
                0px 0px 15px rgba(0, 0, 0, 0.8),
                0px 0px 25px rgba(0, 0, 0, 0.7),
                0px 0px 35px rgba(0, 0, 0, 0.6);
            }
          }
        `}
      </style>
    </header>
  );
  
  
}

export default ShoppingHeader;