import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, X } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
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
import { useEffect, useState, useRef } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

// Modified MenuItems component with proper closing mechanism
const MenuItems = ({ onClose, isInSheet }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const sheetCloseRef = useRef(null);

  function handleNavigate(getCurrentMenuItem) {
    // Remove existing filters
    sessionStorage.removeItem("filters");

    // Set new filter if applicable
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    }

    // Handle navigation
    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams({ category: getCurrentMenuItem.id });
    } else {
      navigate(getCurrentMenuItem.path);
    }

    // Ensure menu closes - use appropriate method based on context
    if (isInSheet && sheetCloseRef.current) {
      sheetCloseRef.current.click();
    } else if (typeof onClose === 'function') {
      onClose();
    }

    setClickedItem(getCurrentMenuItem.id);
    setTimeout(() => setClickedItem(null), 500);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-bold cursor-pointer hover:text-red-500 transition-colors duration-150"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
      {isInSheet && <SheetClose ref={sheetCloseRef} className="hidden" />}
    </nav>
  );
};

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
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
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
              {user?.userName?.[0]?.toUpperCase()}
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
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <span className="lookgood-text">LookGood</span>
        </Link>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden hover:bg-gray-100 transition-colors duration-200">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems onClose={() => setIsSheetOpen(false)} isInSheet={true} />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        
        <div className="hidden lg:block">
          <MenuItems onClose={() => {}} isInSheet={false} />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
  
      {/* Styling for the LookGood logo text */}
      <style>
      {`
        /* LookGood Text Styling */
        .lookgood-text {
          font-size: 1.8rem;
          font-weight: bold;
          letter-spacing: 2px;
          color: #cc0000; /* Softer red */
          position: relative;
          text-shadow: 
            0px 0px 3px rgba(255, 0, 0, 0.4),
            0px 0px 6px rgba(255, 0, 0, 0.5);
        }

        /* Soft White Glow */
        .lookgood-text::before {
          content: "LookGood";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          color: white;
          text-shadow:
            -2px 2px 4px rgba(255, 255, 255, 0.7),
            2px -2px 4px rgba(255, 255, 255, 0.7),
            0px 0px 8px rgba(255, 255, 255, 0.6);
        }

        /* Subtle Animated Glow */
        .lookgood-text::after {
          content: "LookGood";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          color: #cc0000; /* Softer red */
          text-shadow:
            0px 0px 4px rgba(255, 0, 0, 0.5),
            0px 0px 10px rgba(255, 0, 0, 0.4),
            0px 0px 16px rgba(255, 0, 0, 0.3);
          animation: softGlow 1.5s infinite alternate ease-in-out;
        }

        /* Animation for a subtle white-red glow */
        @keyframes softGlow {
          0% {
            text-shadow:
              0px 0px 5px rgba(255, 255, 255, 0.6),
              0px 0px 12px rgba(255, 255, 255, 0.5);
          }
          100% {
            text-shadow:
              0px 0px 8px rgba(255, 255, 255, 0.7),
              0px 0px 15px rgba(255, 255, 255, 0.6);
          }
        }
      `}
      </style>
    </header>
  );
}

export default ShoppingHeader;