import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

// Static equipment data
const EQUIPMENT_DATA = [
  {
    name: 'CNC Milling Machine',
    category: 'Production',
    status: 'Operational',
    statusColor: 'bg-emerald-500',
    statusTextColor: 'text-emerald-900',
    location: 'Assembly Line A',
    team: 'Mechanical Team',
    splineUrl: 'https://prod.spline.design/ZswwmiIyrG8Z8jHZ/scene.splinecode',
    cardColor: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    name: 'Industrial Server Rack',
    category: 'IT Infrastructure',
    status: 'Maintenance Due',
    statusColor: 'bg-amber-500',
    statusTextColor: 'text-amber-900',
    location: 'Server Room',
    team: 'IT Support',
    splineUrl: 'https://prod.spline.design/7-nFP3Wb1NboIT6X/scene.splinecode',
    cardColor: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    name: 'Hydraulic Pump Unit',
    category: 'Electrical',
    status: 'Critical',
    statusColor: 'bg-rose-600',
    statusTextColor: 'text-rose-900',
    location: 'Utility Section',
    team: 'Electrical Team',
    splineUrl: 'https://prod.spline.design/uA1e-vyBtFpUmvpz/scene.splinecode',
    cardColor: 'from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-950/20',
    borderColor: 'border-rose-200 dark:border-rose-800'
  }
];

const EquipmentExplorer: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<typeof EQUIPMENT_DATA[0] | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (equipment: typeof EQUIPMENT_DATA[0]) => {
    setSelectedEquipment(equipment);
    setIsLoading(true);
    
    if (!isViewerVisible) {
      setIsViewerVisible(true);
      setTimeout(() => {
        viewerRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    rest: { 
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    hover: { 
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  const viewerVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      height: 0
    },
    visible: { 
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            3D Equipment Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interact with key equipment models in a 3D environment
          </p>
        </motion.div>

        {/* Equipment Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {EQUIPMENT_DATA.map((equipment, index) => (
            <motion.div
              key={equipment.name}
              variants={itemVariants}
              custom={index}
              className="h-full"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                onClick={() => handleCardClick(equipment)}
                className={`h-full cursor-pointer rounded-2xl border-2 ${equipment.borderColor} bg-gradient-to-br ${equipment.cardColor} backdrop-blur-sm p-6 transition-all duration-200`}
              >
                <div className="flex flex-col h-full">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                      {equipment.category}
                    </span>
                  </div>

                  {/* Equipment Name */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {equipment.name}
                  </h3>

                  {/* Status Pill */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${equipment.statusColor} ${equipment.statusTextColor}`}>
                      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                      {equipment.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{equipment.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                      <span className="font-medium">Team:</span>
                      <span className="ml-2">{equipment.team}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl flex items-center justify-center transition-all duration-200 group"
                  >
                    View 3D Model
                    <motion.svg
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Viewer Section */}
        <AnimatePresence>
          {isViewerVisible && selectedEquipment && (
            <motion.div
              ref={viewerRef}
              variants={viewerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mb-12"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-700 dark:border-gray-700 overflow-hidden shadow-2xl">
                {/* Viewer Header */}
                <div className="p-6 border-b border-gray-700 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedEquipment.name}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-300">{selectedEquipment.category}</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedEquipment.statusColor} ${selectedEquipment.statusTextColor}`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                          {selectedEquipment.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsViewerVisible(false)}
                      className="mt-4 sm:mt-0 px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Close Viewer
                    </button>
                  </div>
                </div>

                {/* Spline Viewer */}
                <div className="relative h-[600px] w-full">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading 3D model...</p>
                      </div>
                    </div>
                  )}
                  <Spline
                    scene={selectedEquipment.splineUrl}
                    onLoad={handleSplineLoad}
                    className="w-full h-full"
                  />
                  
                  {/* Viewer Controls Info */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">Controls:</span>
                    </div>
                    <div className="flex space-x-4 text-xs">
                      <div className="flex items-center">
                        <span className="inline-block w-6 h-6 bg-gray-700 rounded text-center mr-1">LMB</span>
                        <span>Rotate</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-6 h-6 bg-gray-700 rounded text-center mr-1">RMB</span>
                        <span>Pan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-6 h-6 bg-gray-700 rounded text-center mr-1">Scroll</span>
                        <span>Zoom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State when no viewer */}
        {!isViewerVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Select an Equipment Model
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click on any equipment card above to explore its 3D model in real-time
              </p>
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-500">
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm">Click a card above to begin</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EquipmentExplorer;