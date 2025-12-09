import { Link } from "react-router-dom";
import { 
  Heart, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Truck,
  CreditCard,
  ArrowUp,
  Globe,
  Package,
  Users,
  Award,
  ShoppingBag,
  Linkedin,
  Youtube,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { colors } from "../theme/colors";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [siteData, setSiteData] = useState({
    companyName: "HaatBazaR",
    companyAddress: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    socialLinks: {},
    logo: null
  });
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Fetch site data from API
    fetchSiteData();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      
      // Use environment variable for API base URL
      const apiUrl = `${API_BASE_URL}/site`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success && data.site) {
        setSiteData({
          companyName: data.site.companyName || "HaatBazaR",
          companyAddress: data.site.companyAddress || "",
          contactEmail: data.site.contactEmail || "",
          contactPhone: data.site.contactPhone || "",
          whatsappNumber: data.site.whatsappNumber || "",
          socialLinks: data.site.socialLinks || {},
          logo: data.site.logo?.url || null
        });
      } else {
        throw new Error(data.message || 'Failed to fetch site data');
      }
      
    } catch (error) {
      console.error('Error fetching site data:', error);
      // Use fallback data
      setSiteData({
        companyName: "HaatBazaR",
        companyAddress: "Kirtipur, Kathmandu, Nepal",
        contactEmail: "support@haatbazar.com",
        contactPhone: "9866573177",
        whatsappNumber: "",
        socialLinks: {},
        logo: "https://res.cloudinary.com/dvp9xszv1/image/upload/v1765006165/ecommerce/site/n4b91yejugbqtnvz2nzr.webp"
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    Shop: [
      { label: "All Products", href: "/products" },
      { label: "Featured", href: "/featured" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Best Sellers", href: "/products?sort=popular" },
      { label: "Clearance Sale", href: "/products?discount=true" },
    ],
    Categories: [
      { label: "Electronics", href: "/electronics" },
      { label: "Fashion", href: "/fashion" },
      { label: "Home & Garden", href: "/home-garden" },
      { label: "Sports", href: "/sports" },
      { label: "Beauty", href: "/beauty" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQs", href: "/faqs" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  const trustBadges = [
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payments", color: "text-green-500" },
    { icon: <Truck className="w-5 h-5" />, text: "Free Shipping", color: "text-blue-500" },
    { icon: <CreditCard className="w-5 h-5" />, text: "COD Available", color: "text-purple-500" },
    { icon: <Award className="w-5 h-5" />, text: "Quality Guarantee", color: "text-amber-500" },
  ];

  // Social media icons mapping
  const socialIcons = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
   
  };

  // Filter social links that have URLs
  const activeSocialLinks = Object.entries(siteData.socialLinks || {}).filter(
    ([_, url]) => url && url.trim() !== ""
  );

  // Company description with fallback
  const companyDescription = "Discover amazing products at unbeatable prices. We're committed to providing the best shopping experience with quality products and excellent customer service.";

  return (
    <footer 
      className="text-white pt-16 pb-8 px-4 md:px-8"
      style={{
        background: `linear-gradient(135deg, ${colors.gray[900]}, ${colors.gray[950]})`
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
            style={{
              background: `linear-gradient(to right, ${colors.green[500]}, ${colors.blue[500]})`
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {loading ? (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg animate-pulse bg-gradient-to-br from-gray-800 to-gray-700">
                  <Sparkles className="w-6 h-6 text-gray-600" />
                </div>
              ) : siteData.logo ? (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-gray-800">
                  <img 
                    src={siteData.logo} 
                    alt={siteData.companyName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, ${colors.green[400]}, ${colors.blue[400]})">
                          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.green[400]}, ${colors.blue[400]})`
                  }}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                {loading ? (
                  <>
                    <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <h2 
                      className="text-2xl font-bold"
                      style={{
                        background: `linear-gradient(to right, ${colors.green[500]}, ${colors.blue[500]})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {siteData.companyName}
                    </h2>
                    <p className="text-gray-400 text-sm">Premium E-Commerce Experience</p>
                  </>
                )}
              </div>
            </div>
            
            {loading ? (
              <>
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
              </>
            ) : (
              <p className="text-gray-400 mb-6 max-w-md">
                {companyDescription}
              </p>
            )}
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={badge.color}>
                    {badge.icon}
                  </div>
                  <span className="text-sm text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                {category === "Shop" && <Package className="w-4 h-4" />}
                {category === "Categories" && <ShoppingBag className="w-4 h-4" />}
                {category === "Support" && <Users className="w-4 h-4" />}
                {category === "Company" && <Globe className="w-4 h-4" />}
                <span 
                  style={{
                    color: colors.green[300]
                  }}
                >
                  {category}
                </span>
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 hover:translate-x-1 duration-200"
                      style={{
                        '--hover-color': colors.green[500]
                      }}
                    >
                      <span 
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: colors.gray[600]
                        }}
                      ></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div 
          className="border-t my-8"
          style={{
            borderColor: colors.gray[800]
          }}
        ></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Contact Info */}
          <div className="space-y-3 text-center md:text-left">
            {loading ? (
              // Loading skeleton for contact info
              <>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-4 h-4 text-gray-700" />
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Mail className="w-4 h-4 text-gray-700" />
                  <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-700" />
                  <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              // Actual contact info
              <>
                {siteData.contactPhone && (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Phone className="w-4 h-4" style={{ color: colors.gray[400] }} />
                    <span className="text-sm" style={{ color: colors.gray[400] }}>
                      {siteData.contactPhone}
                    </span>
                  </div>
                )}
                {siteData.contactEmail && (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Mail className="w-4 h-4" style={{ color: colors.gray[400] }} />
                    <span className="text-sm" style={{ color: colors.gray[400] }}>
                      {siteData.contactEmail}
                    </span>
                  </div>
                )}
                {siteData.companyAddress && (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <MapPin className="w-4 h-4" style={{ color: colors.gray[400] }} />
                    <span className="text-sm" style={{ color: colors.gray[400] }}>
                      {siteData.companyAddress}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-4">
            {loading ? (
              // Loading skeleton for social icons
              <>
                <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: colors.gray[800] }}></div>
                <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: colors.gray[800] }}></div>
                <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: colors.gray[800] }}></div>
              </>
            ) : activeSocialLinks.length > 0 ? (
              // Actual social icons from database
              activeSocialLinks.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all"
                  style={{
                    backgroundColor: colors.gray[800],
                    color: colors.gray[400]
                  }}
                  aria-label={platform}
                >
                  {socialIcons[platform] || <Globe className="w-5 h-5" />}
                </a>
              ))
            ) : (
              // Fallback social icons if none in database
              <>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all" 
                   style={{ backgroundColor: colors.gray[800], color: colors.gray[400] }} aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all"
                   style={{ backgroundColor: colors.gray[800], color: colors.gray[400] }} aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all"
                   style={{ backgroundColor: colors.gray[800], color: colors.gray[400] }} aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="mt-8 pt-8 text-center"
          style={{
            borderTop: `1px solid ${colors.gray[800]}`
          }}
        >
          {loading ? (
            <>
              <div className="h-4 w-64 bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-3 w-48 bg-gray-700 rounded animate-pulse mx-auto"></div>
            </>
          ) : (
            <>
              <p 
                className="text-sm"
                style={{ color: colors.gray[500] }}
              >
                © {new Date().getFullYear()} {siteData.companyName}. All rights reserved. 
                Made with <Heart className="w-3 h-3 inline" style={{ color: colors.accent.red }} /> in Nepal.
              </p>
              <p 
                className="text-xs mt-2"
                style={{ color: colors.gray[600] }}
              >
                Prices are in Nepalese Rupees (रू). All prices include VAT where applicable.
              </p>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}