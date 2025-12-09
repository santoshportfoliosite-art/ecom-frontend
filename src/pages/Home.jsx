import { useState, useEffect } from "react";
import useSEO from "../hooks/useSEO";
import Slider from "../components/Slider";

import TopItems from "../components/TopItems";
import Trending from "./Trending";
import Features from "../components/Features";
import CTA from "../components/CTA";
import AllProducts from "./AllProducts";
import SearchItemsOnly from "./SearchItemOnly";
import FashionComponent from "../components/FashionComponent";
import BeautyComponent from "../components/BeautyComponent";
import OfferComponent from "../components/OfferComponent";
import Whatsapp from "../components/Whatsapp";
import SwipeCategory from "../components/SwipeCategory";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const seo = useSEO("home");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <>
      {seo}

      {loading ? (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-700 font-semibold">
              Loading amazing deals...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Whatsapp />
            <Slider />
            <SearchItemsOnly />
            <OfferComponent />
            <TopItems />
            <Trending />
            <FashionComponent />
            <BeautyComponent />
            <SwipeCategory />
            <Features />
            <CTA />
          </div>
        </>
      )}
    </>
  );
}
