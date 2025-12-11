// src/pages/Policy.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  CreditCard,
  Truck,
  RefreshCw,
  XCircle,
  HelpCircle,
  Mail,
  Phone,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Users,
  ShoppingBag,
  Package,
  Clock,
} from "lucide-react";
import { colors } from "../theme/colors";
import useSEO from "../hooks/useSEO";
export default function Policy() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const policySections = [
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: <Lock className="w-5 h-5" />,
      lastUpdated: "December 06, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Information We Collect</h3>
        <p class="mb-3">We collect information to provide better services to our users. The types of information we collect include:</p>
        
        <h4 class="font-semibold mb-2">Personal Information:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Name, email address, phone number</li>
          <li>Shipping and billing addresses</li>
          <li>Payment information (processed securely through payment gateways)</li>
          
        </ul>
        
        <h4 class="font-semibold mb-2">Usage Information:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Browser type and device information</li>
          <li>IP address and location data</li>
          <li>Pages visited and time spent on site</li>
          <li>Search queries and product views</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">How We Use Your Information</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and updates</li>
          <li>Provide customer support</li>
          <li>Improve our website and services</li>
          <li>Send promotional emails (you can opt-out anytime)</li>
          <li>Prevent fraud and unauthorized transactions</li>
        </ul>
      `,
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: <FileText className="w-5 h-5" />,
      lastUpdated: "December 05, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Account Registration</h3>
        <p class="mb-3">To use certain features of our platform, you must register for an account. You agree to:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Immediately notify us of any unauthorized use</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Product Information</h3>
        <p class="mb-3">We strive to ensure product information is accurate, but we do not warrant that descriptions, images, or other content is complete or error-free.</p>
        
        <h3 class="text-lg font-semibold mb-3">Pricing and Payments</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>All prices are in Nepalese Rupees (Rs)</li>
          <li>Prices are subject to change without notice</li>
          <li>We accept major credit cards, debit cards, esewa, and net banking</li>
          <li>Payment is processed at the time of order confirmation as well as cash on delivery</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Prohibited Activities</h3>
        <p class="mb-3">You agree not to:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Use the site for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to any part of the site</li>
          <li>Interfere with the proper working of the site</li>
          <li>Use automated systems to extract data</li>
        </ul>
      `,
    },
    {
      id: "shipping",
      title: "Shipping Policy",
      icon: <Truck className="w-5 h-5" />,
      lastUpdated: "December 05, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Shipping Methods & Timeframes</h3>
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Standard Shipping:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Delivery within 2-3 business days</li>
            <li>Free shipping on orders above Rs.999 inside Kathmandu Valley</li>
          
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Express Shipping:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Delivery within 1-3 business days</li>
         
            <li>Available for most pin codes</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Same-Day Delivery:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Available in select metro cities</li>
            <li>Order must be placed before 12 PM</li>
            <li>Additional charge of Rs. 299</li>
          </ul>
        </div>
        
        <h3 class="text-lg font-semibold mb-3">Shipping Restrictions</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>We currently ship to all pin codes </li>
          <li>International shipping is not available</li>
          <li>Certain items may have shipping restrictions</li>
          <li>Remote locations may have longer delivery times</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Order Tracking</h3>
        <p class="mb-3">Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Through our website's order tracking page</li>
          <li>Using the tracking link in your email</li>
          <li>By contacting our customer support</li>
        </ul>
      `,
    },
    {
      id: "returns",
      title: "Return & Refund Policy",
      icon: <RefreshCw className="w-5 h-5" />,
      lastUpdated: "December 05, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Return Window</h3>
        <p class="mb-3">You may return most items within 7 days of delivery for a full refund. Some items have different return periods:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Electronics:</strong> 7 days from delivery</li>
          <li><strong>Clothing & Footwear:</strong> 7 days from delivery</li>
          <li><strong>Personal Care Products:</strong> Non-returnable for hygiene reasons</li>
          <li><strong>Customized Products:</strong> Non-returnable unless defective</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Return Conditions</h3>
        <p class="mb-3">To be eligible for a return, your item must be:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Unused and in the original condition</li>
          <li>In the original packaging with all tags attached</li>
          <li>Accompanied by the original receipt or proof of purchase</li>
          <li>Returned with all accessories and free gifts</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Refund Process</h3>
        <div class="space-y-3 mb-4">
          <div class="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">1. Return Initiation</p>
              <p class="text-sm text-gray-600">Initiate return within 24 hours of approval</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <Package className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">2. Pickup & Inspection</p>
              <p class="text-sm text-gray-600">Pickup within 2-3 days, inspection within 48 hours</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium">3. Refund Processing</p>
              <p class="text-sm text-gray-600">Refund initiated within 5-7 business days after approval</p>
            </div>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold mb-3">Non-Returnable Items</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Gift cards and downloadable products</li>
          <li>Personal care and beauty products</li>
          <li>Underwear and intimate apparel</li>
          <li>Customized or personalized items</li>
          <li>Perishable goods and food items</li>
        </ul>
      `,
    },
    {
      id: "cancellation",
      title: "Order Cancellation",
      icon: <XCircle className="w-5 h-5" />,
      lastUpdated: "December 05, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Cancellation Timeframe</h3>
        <p class="mb-3">You can cancel your order at different stages:</p>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Before Shipping:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>100% refund will be processed</li>
            <li>Refund within 5-7 business days</li>
            <li>No cancellation charges</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">After Shipping:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Contact customer support immediately</li>
            <li>Refund after return and inspection</li>
            <li>Shipping charges are non-refundable</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Failed Delivery:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Multiple delivery attempts will be made</li>
            <li>After 3 failed attempts, order will be cancelled</li>
            <li>Refund processed minus shipping charges</li>
          </ul>
        </div>
        
        <h3 class="text-lg font-semibold mb-3">How to Cancel</h3>
        <p class="mb-3">You can cancel your order through:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Website:</strong> Go to "My Orders" and click "Cancel Order"</li>
          <li><strong>Mobile App:</strong> Navigate to order details and cancel</li>
          <li><strong>Customer Support:</strong> Call or email with order details</li>
        </ul>
      `,
    },
    {
      id: "security",
      title: "Security & Data Protection",
      icon: <Shield className="w-5 h-5" />,
      lastUpdated: "December 05, 2025",
      content: `
        <h3 class="text-lg font-semibold mb-3">Data Security Measures</h3>
        <p class="mb-3">We implement industry-standard security measures to protect your personal information:</p>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Encryption:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>SSL encryption for all data transmission</li>
            <li>Payment data encrypted using PCI-DSS compliant methods</li>
            <li>Secure socket layer (SSL) technology</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Access Controls:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Limited employee access to personal data</li>
            <li>Regular security audits and monitoring</li>
            <li>Two-factor authentication for admin access</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Payment Security:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>PCI-DSS compliant payment processing</li>
            <li>Tokenization for payment information</li>
            <li>Regular security vulnerability assessments</li>
          </ul>
        </div>
        
        <h3 class="text-lg font-semibold mb-3">Cookies & Tracking</h3>
        <p class="mb-3">We use cookies and similar tracking technologies to:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Remember your preferences and settings</li>
          <li>Analyze site traffic and usage patterns</li>
          <li>Provide personalized content and ads</li>
          <li>Improve user experience</li>
        </ul>
        
        <h3 class="text-lg font-semibold mb-3">Third-Party Services</h3>
        <p class="mb-3">We may share information with trusted third parties for:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Payment processing (Razorpay, Stripe, etc.)</li>
          <li>Shipping and delivery services</li>
          <li>Marketing and analytics services</li>
          <li>Customer support platforms</li>
        </ul>
      `,
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      details: ["support@nepalikart.com", "help@nepalikart.com"],
      responseTime: "Within 24 hours",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone Support",
      details: ["+977 9866573177"],
      responseTime: "9 AM - 9 PM ",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "FAQ & Help Center",
      details: [
        "Visit our comprehensive help center",
        "Find instant answers to common questions",
      ],
      responseTime: "Available 24/7",
    },
  ];
  const seo = useSEO("policy");
  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mb-6">
                <Shield
                  className="w-8 h-8"
                  style={{ color: colors.green[500] }}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Policies & Terms
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Your trust is important to us. Read our comprehensive policies
                to understand how we protect your information and ensure a
                secure shopping experience.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    100% Secure Payments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    7-Day Return Policy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">GDPR Compliant</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Last Updated Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Last Updated: December 05, 2025
                    </p>
                    <p className="text-sm text-gray-600">
                      Please review these policies regularly as they may be
                      updated.
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium">
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>

          {/* Policy Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {policySections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                    expandedSections[section.id] ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.green[50] }}
                      >
                        <div style={{ color: colors.green[500] }}>
                          {section.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated: {section.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.gray[100] }}
                    >
                      {expandedSections[section.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedSections[section.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-6">
                            <div
                              className="prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: section.content,
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Need Help?
                </h2>
                <p className="text-gray-600">
                  Our support team is here to help you with any questions about
                  our policies.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {contactInfo.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                      style={{ backgroundColor: colors.green[50] }}
                    >
                      <div style={{ color: colors.green[500] }}>
                        {contact.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {contact.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {contact.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{contact.responseTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Points Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Key Policy Highlights
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "Data Privacy",
                  points: [
                    "GDPR compliant",
                    "No data sharing",
                    "Secure encryption",
                  ],
                },
                {
                  icon: <CreditCard className="w-6 h-6" />,
                  title: "Secure Payments",
                  points: [
                    "PCI-DSS compliant",
                    "Multiple options",
                    "100% secure",
                  ],
                },
                {
                  icon: <Truck className="w-6 h-6" />,
                  title: "Easy Returns",
                  points: ["7-day window", "Free returns", "Quick refunds"],
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Customer Support",
                  points: [
                    "24/7 available",
                    "Multiple channels",
                    "Quick response",
                  ],
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colors.green[100]}, ${colors.blue[100]})`,
                    }}
                  >
                    <div style={{ color: colors.green[500] }}>{item.icon}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                By using our platform, you acknowledge that you have read,
                understood, and agree to be bound by these policies.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 NepaliKarT. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
