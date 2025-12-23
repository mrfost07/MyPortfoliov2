"use client";
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

function Achievements({ achievements }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const hasAchievements = achievements && achievements.length > 0;

    const nextSlide = useCallback(() => {
        if (!hasAchievements) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % achievements.length);
    }, [achievements?.length, hasAchievements]);

    const prevSlide = useCallback(() => {
        if (!hasAchievements) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
    }, [achievements?.length, hasAchievements]);

    // Auto-play
    useEffect(() => {
        if (!hasAchievements || achievements.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, hasAchievements, achievements?.length]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: (direction) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            transition: { duration: 0.4, ease: "easeIn" }
        })
    };

    const currentAchievement = hasAchievements ? achievements[currentIndex] : null;

    return (
        <div id='achievements' className="relative z-50 my-12 lg:my-24">
            {/* Section Header */}
            <motion.div
                className="flex justify-center my-5 lg:py-8"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.5 }}
            >
                <div className="flex items-center">
                    <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                    <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md flex items-center gap-2">
                        <Trophy size={20} className="text-[#16f2b3]" />
                        ACHIEVEMENTS
                    </span>
                    <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                </div>
            </motion.div>

            {/* Content */}
            {hasAchievements ? (
                <motion.div
                    className="max-w-4xl mx-auto px-4"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    {/* Image Container with Arrows Inside */}
                    <div className="relative w-full">
                        {/* Image */}
                        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0"
                                    style={{ minHeight: '100%' }}
                                >
                                    {currentAchievement?.image ? (
                                        <Image
                                            src={currentAchievement.image}
                                            alt={currentAchievement.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Trophy size={60} className="text-[#16f2b3]/30" />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Left Arrow - Inside Image */}
                            {achievements.length > 1 && (
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            )}

                            {/* Right Arrow - Inside Image */}
                            {achievements.length > 1 && (
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
                                    aria-label="Next"
                                >
                                    <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            )}
                        </div>

                        {/* Description - Below image */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-center mt-4"
                            >
                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    {currentAchievement?.title}
                                </h3>
                                {currentAchievement?.date && (
                                    <p className="text-[#16f2b3] text-xs sm:text-sm">{currentAchievement.date}</p>
                                )}
                                {currentAchievement?.description && (
                                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                                        {currentAchievement.description}
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Indicator */}
                    {achievements.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {achievements.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-[#16f2b3] w-6'
                                        : 'bg-[#2a3241] w-2 hover:bg-[#3a4251]'
                                        }`}
                                    aria-label={`Go to achievement ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Trophy size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No achievements to display yet.</p>
                </div>
            )}
        </div>
    );
}

export default Achievements;
