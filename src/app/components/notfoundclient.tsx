'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Compass, Home, RefreshCw } from 'lucide-react'
import type { Variants } from 'framer-motion'

const NotFoundClient: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const compassVariants: Variants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 4,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div
            className="inline-block text-indigo-600 mb-4"
            variants={compassVariants}
            initial="initial"
            animate="animate"
          >
            <Compass size={80} strokeWidth={1.5} />
          </motion.div>
          <motion.h1
            className="text-6xl font-bold text-gray-900 mb-2"
            variants={itemVariants}
          >
            404
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-6"
            variants={itemVariants}
          >
            Looks like you've ventured into uncharted territory
          </motion.p>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <p className="text-gray-500 max-w-md mx-auto">
            Don't worry, even the best explorers get lost sometimes. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </motion.a>

            <motion.button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="mr-2" size={20} />
              Go Back
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="mt-12 text-gray-400" variants={itemVariants}>
          <p className="text-sm">Error Code: 404 | Page Not Found</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundClient
