import React from "react";
import { motion } from "framer-motion";
import {
  
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
} from "lucide-react";
const Features = () => {
    const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free delivery inside KTM Valley",
      color: "from-green-400 to-emerald-400",
      
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure and encrypted payments",
      color: "from-blue-400 to-cyan-400",
      
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "7-day return policy",
      color: "from-purple-400 to-pink-400",
      
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "COD Available",
      description: "Cash on delivery option",
      color: "from-amber-400 to-orange-400",
    
    },
  ];

  return (
    <div>
      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
