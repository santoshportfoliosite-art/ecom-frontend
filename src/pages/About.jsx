import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageSquare,
  CheckCircle,
  Shield,
  Truck,
} from "lucide-react";
import useSEO from "../hooks/useSEO";

export default function About() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seo = useSEO("about");
  useEffect(() => {
    fetchSiteData();
  }, []);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/site`);
      const data = await res.json();

      console.log("API Response:", data); // Debug log

      if (res.ok && data.success) {
        setSiteData(data.site); // Access the site object
        console.log("Site data set:", data.site); // Debug log
      } else {
        setError(data.message || "Failed to load company information.");
      }
    } catch (err) {
      setError("Error loading company information.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        {seo}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-green-700 font-semibold text-lg">
              Loading company information...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !siteData) {
    console.log("Error or no siteData:", { error, siteData }); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Unable to Load Information
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "Company information not available at the moment."}
          </p>
          <button
            onClick={fetchSiteData}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering with siteData:", siteData); // Debug log

  const socialLinks = siteData.socialLinks || {};
  const hasSocialLinks = Object.values(socialLinks).some(
    (link) => link && link.trim()
  );

  // Company values
  const companyValues = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Customer First",
      description:
        "Your satisfaction is our top priority. We listen, adapt, and deliver.",
      color: "from-red-50 to-red-100",
      iconColor: "text-red-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Quality",
      description:
        "Every product is carefully curated and quality-checked for your peace of mind.",
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-500",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery services to get your products on time.",
      color: "from-green-50 to-green-100",
      iconColor: "text-green-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from service to support.",
      color: "from-amber-50 to-amber-100",
      iconColor: "text-amber-500",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2024",
      title: "Company Founded",
      description: "Started our journey in e-commerce",
    },
    {
      year: "2025",
      title: "1000+ Happy Customers",
      description: "Reached a major customer milestone",
    },
    {
      year: "2025",
      title: "Expanded Product Range",
      description: "Added 500+ new products",
    },
    {
      year: "Present",
      title: "Growing Strong",
      description: "Continuing to serve with passion",
    },
  ];

  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/10 to-blue-50/10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mb-6 shadow-lg">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                  {siteData.companyName || "Our Company"}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connecting customers with quality products through innovation
                and exceptional service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Information */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Story
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Founded with a vision to revolutionize online shopping,{" "}
                    {siteData.companyName || "Our Company"} has grown from a
                    small startup to a trusted e-commerce platform serving
                    customers nationwide. We believe in making quality products
                    accessible to everyone while maintaining the highest
                    standards of service.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our journey is fueled by innovation, customer satisfaction,
                    and a commitment to excellence. Every day, we work towards
                    creating better shopping experiences and building lasting
                    relationships with our customers.
                  </p>

                  {/* Contact Information */}
                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Get in Touch
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-gray-900 font-medium">
                            {siteData.companyAddress || "Address not available"}
                          </p>
                        </div>
                      </div>

                      {siteData.contactEmail && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <a
                              href={`mailto:${siteData.contactEmail}`}
                              className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                            >
                              {siteData.contactEmail}
                            </a>
                          </div>
                        </div>
                      )}

                      {siteData.contactPhone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <a
                              href={`tel:${siteData.contactPhone}`}
                              className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                            >
                              {siteData.contactPhone}
                            </a>
                          </div>
                        </div>
                      )}

                      {siteData.whatsappNumber && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">WhatsApp</p>
                            <a
                              href={`https://wa.me/${siteData.whatsappNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                            >
                              {siteData.whatsappNumber}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {siteData.logo?.url ? (
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8">
                      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        <img
                          src={siteData.logo.url}
                          alt={siteData.companyName || "Company Logo"}
                          className="w-full h-64 object-contain"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              siteData.logo.url
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8">
                      <div className="bg-white rounded-xl shadow-2xl overflow-hidden h-64 flex items-center justify-center">
                        <Building2 className="w-32 h-32 text-gray-300" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                The principles that guide everything we do at{" "}
                {siteData.companyName || "our company"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${value.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md ${value.iconColor}`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Milestones that mark our growth and progress
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-blue-500 hidden md:block"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-green-500 rounded-full z-10 hidden md:block"></div>

                    {/* Content */}
                    <div
                      className={`md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                      } w-full`}
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {milestone.year}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Media & Contact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Connect With Us
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Follow us on social media and stay updated with our latest
                  products and offers
                </p>
              </div>

              {hasSocialLinks ? (
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {socialLinks.facebook && socialLinks.facebook.trim() && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                  )}

                  {socialLinks.instagram && socialLinks.instagram.trim() && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}

                  {socialLinks.twitter && socialLinks.twitter.trim() && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}

                  {socialLinks.youtube && socialLinks.youtube.trim() && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                  )}

                  {socialLinks.linkedin && socialLinks.linkedin.trim() && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}

                  {socialLinks.tiktok && socialLinks.tiktok.trim() && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gray-900 hover:bg-black rounded-xl flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                    >
                      <MessageSquare className="w-6 h-6" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-gray-400 mb-2">
                    <Globe className="w-5 h-5" />
                    <p className="text-gray-500">Social links coming soon...</p>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Need Help?
                    </h3>
                    <p className="text-gray-600">
                      Our support team is here for you
                    </p>
                  </div>
                  <a
                    href={`mailto:${
                      siteData.contactEmail || "support@example.com"
                    }`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-lg group"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="py-8 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">
                Trusted by thousands of satisfied customers
              </span>
            </div>
            <p className="text-gray-600">
              © {new Date().getFullYear()}{" "}
              {siteData.companyName || "Our Company"}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
