import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sliderRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Color gradients based on your theme
  const colorGradients = [
    "from-green-400 to-blue-400",     // Green to Blue
    "from-blue-400 to-green-400",     // Blue to Green
    "from-emerald-400 to-cyan-400",   // Emerald to Cyan (from your accent colors)
    "from-cyan-400 to-green-400",     // Cyan to Green
    "from-green-500 to-blue-500",     // Primary Green to Primary Blue
  ];

  // Badge options
  const badges = ["New Arrival", "Limited Time", "Trending", "Hot Deal", "Exclusive"];

  // Fetch sliders from database
  const fetchSliders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get(`${backendUrl}/api/sliders`);
      
      if (response.data.success) {
        // Filter only active sliders and sort by imageIndex
        const activeSliders = response.data.sliders
          .filter(slider => slider.isActive)
          .sort((a, b) => a.imageIndex - b.imageIndex);
        
        // Limit to 5 sliders maximum
        const limitedSliders = activeSliders.slice(0, 5);
        
        setSlides(limitedSliders);
        
        if (limitedSliders.length === 0) {
          setError("No active sliders found. Please add sliders from the admin panel.");
        }
      } else {
        setError(response.data.message || "Failed to load sliders.");
      }
    } catch (err) {
      console.error("Slider fetch error:", err);
      setError("Unable to load sliders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSliders();
  }, []);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-slide functionality (only if we have slides)
  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    if (slides.length > 0) {
      setCurrentSlide(index);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl shadow-2xl mx-2 md:mx-8 mt-2 mb-8 md:mb-12">
        <div className={`relative ${isMobile ? 'aspect-[5/3]' : 'h-[500px] md:h-[600px]'} bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-700 font-semibold">Loading slider...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-3xl shadow-2xl mx-2 md:mx-8 mt-2 mb-8 md:mb-12">
        <div className={`relative ${isMobile ? 'aspect-[5/3]' : 'h-[500px] md:h-[600px]'} bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-center`}>
          <div className="text-center max-w-md px-4">
            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <button
              onClick={fetchSliders}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No slides state
  if (slides.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl shadow-2xl mx-2 md:mx-8 mt-2 mb-8 md:mb-12">
        <div className={`relative ${isMobile ? 'aspect-[5/3]' : 'h-[500px] md:h-[600px]'} bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center`}>
          <div className="text-center max-w-md px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Sliders</h3>
            <p className="text-gray-600 mb-4">
              No active slider images found. Please add sliders from the admin panel.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200 rounded-xl p-3">
              <Star className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Add slider images to showcase your products</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden rounded-3xl shadow-2xl mx-2 md:mx-8 mt-2 mb-8 md:mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={sliderRef}
    >
      {/* Slides Container - 3:5 aspect ratio on mobile */}
      <div className={`relative ${isMobile ? 'aspect-[5/3]' : 'h-[500px] md:h-[600px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={slides[currentSlide].image.url}
                alt={slides[currentSlide].imageTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/1600x600/1f2937/6ee7b7?text=Slider+${slides[currentSlide].imageIndex}`;
                }}
              />
              {/* Dynamic gradient based on slide index */}
              <div className={`absolute inset-0 bg-gradient-to-r ${colorGradients[slides[currentSlide].imageIndex % colorGradients.length]} opacity-70`} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            {/* Content - Responsive positioning */}
            <div className={`relative z-10 h-full flex items-center ${isMobile ? 'px-4 items-center justify-center text-center' : 'px-8 md:px-16 lg:px-24'}`}>
              <div className={`text-white ${isMobile ? 'max-w-full px-2' : 'max-w-2xl'}`}>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 ${isMobile ? 'px-3 py-1 mb-3' : 'px-4 py-2 mb-6'} rounded-full`}
                >
                  <Star className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                  <span className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {badges[slides[currentSlide].imageIndex % badges.length]}
                  </span>
                </motion.div>

                {/* Title - Responsive text sizing */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`font-bold mb-2 md:mb-4 leading-tight ${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl md:text-4xl lg:text-5xl'}`}
                >
                  {slides[currentSlide].imageTitle}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`mb-3 md:mb-6 text-green-100 ${isMobile ? 'text-base' : 'text-xl md:text-2xl'}`}
                >
                  {slides[currentSlide].imageDescription}
                </motion.p>

                {/* Additional Info - Hide on very small screens */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`mb-4 md:mb-8 text-gray-100 ${isMobile ? 'text-sm hidden sm:block' : 'text-lg md:text-xl max-w-lg'}`}
                >
                 
                </motion.div>

                {/* CTA Button - Responsive sizing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className={isMobile ? 'flex justify-center' : ''}
                >
                  <Link
                    to={slides[currentSlide].buttonLink || "#"}
                    className={`inline-flex items-center gap-2 bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl ${isMobile ? 'px-4 py-2.5 text-sm rounded-lg' : 'px-6 md:px-8 py-3 md:py-4 text-base rounded-full'}`}
                  >
                    <ShoppingBag className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                    {isMobile 
                      ? (slides[currentSlide].buttonTitle || "Shop").replace('Now', '')
                      : slides[currentSlide].buttonTitle || "Shop Now"
                    }
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group z-20 ${isMobile ? 'left-2 w-8 h-8' : 'left-4 w-12 h-12'}`}
            aria-label="Previous slide"
          >
            <ChevronLeft className={`text-white group-hover:scale-110 transition-transform ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group z-20 ${isMobile ? 'right-2 w-8 h-8' : 'right-4 w-12 h-12'}`}
            aria-label="Next slide"
          >
            <ChevronRight className={`text-white group-hover:scale-110 transition-transform ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </button>
        </>
      )}

      {/* Indicators - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-20 ${isMobile ? 'bottom-3' : 'bottom-6'}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all ${index === currentSlide
                  ? `bg-white ${isMobile ? 'w-6' : 'w-8'}`
                  : 'bg-white/50 hover:bg-white/70'
                } ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar - Only show if auto-sliding is active */}
      {slides.length > 1 && !isPaused && (
        <div className={`absolute bottom-0 left-0 right-0 bg-white/30 ${isMobile ? 'h-0.5' : 'h-1'}`}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className={`bg-white ${isMobile ? 'h-0.5' : 'h-full'}`}
            key={currentSlide}
          />
        </div>
      )}

      {/* Quick Actions - Hide on very small screens */}
      <div className={`absolute right-4 flex gap-2 md:gap-3 z-20 ${isMobile ? 'top-3 hidden sm:flex' : 'top-6'}`}>
        {slides.length > 1 && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? (
              <div className={`border-l-4 border-r-4 border-white rounded-sm ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            ) : (
              <div className={`border-2 border-white rounded-sm ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            )}
          </button>
        )}
        <button
          className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all ${isMobile ? 'w-8 h-8 hidden md:flex' : 'w-10 h-10'}`}
          aria-label="Add to favorites"
        >
          <Heart className={`text-white ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
      </div>

      {/* Slide Count Indicator */}
      {slides.length > 0 && (
        <div className={`absolute left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 z-20 ${isMobile ? 'top-3 text-xs' : 'top-6 text-sm'}`}>
          <span className="text-white">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      )}

      {/* Mobile-Only Touch Instructions */}
      {isMobile && slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <span className="bg-black/30 px-2 py-1 rounded-full">Swipe</span>
          </div>
        </div>
      )}
    </div>
  );
}