"use client";
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Award, X, ChevronLeft, ChevronRight } from 'lucide-react';

function Certificates({ certificates }) {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const hasCertificates = certificates && certificates.length > 0;

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextSlide = useCallback(() => {
        if (!hasCertificates) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % certificates.length);
    }, [certificates?.length, hasCertificates]);

    const prevSlide = useCallback(() => {
        if (!hasCertificates) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    }, [certificates?.length, hasCertificates]);

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

    const currentCertificate = hasCertificates ? certificates[currentIndex] : null;

    return (
        <div id='certificates' className="relative my-12 lg:my-24">
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
                        <Award size={20} className="text-pink-500" />
                        CERTIFICATES
                    </span>
                    <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                </div>
            </motion.div>

            {hasCertificates ? (
                <>
                    {/* Mobile: Carousel View */}
                    <div className="sm:hidden px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            {/* Image Container with Arrows Inside */}
                            <div className="relative w-full">
                                {/* Image */}
                                <div
                                    className="relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
                                    onClick={() => setSelectedCertificate(currentCertificate)}
                                >
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
                                            {currentCertificate?.image ? (
                                                <Image
                                                    src={currentCertificate.image}
                                                    alt={currentCertificate.title}
                                                    fill
                                                    className="object-contain"
                                                    sizes="100vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Award size={48} className="text-pink-500/30" />
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Left Arrow - Inside Image */}
                                    {certificates.length > 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
                                            aria-label="Previous"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                    )}

                                    {/* Right Arrow - Inside Image */}
                                    {certificates.length > 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
                                            aria-label="Next"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    )}
                                </div>

                                {/* Text - Below image */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center mt-4"
                                    >
                                        <h3 className="font-bold text-white text-lg line-clamp-1">
                                            {currentCertificate?.title}
                                        </h3>
                                        {currentCertificate?.issuer && (
                                            <p className="text-[#16f2b3] text-sm">{currentCertificate.issuer}</p>
                                        )}
                                        {currentCertificate?.date && (
                                            <p className="text-gray-500 text-xs">{currentCertificate.date}</p>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Dots */}
                            {certificates.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    {certificates.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setDirection(index > currentIndex ? 1 : -1);
                                                setCurrentIndex(index);
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? 'bg-pink-500 w-6'
                                                : 'bg-[#2a3241] w-2 hover:bg-[#3a4251]'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Desktop: Grid View */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: false, amount: 0.3 }}
                                onClick={() => setSelectedCertificate(cert)}
                                className="cursor-pointer group"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden rounded-lg h-48 bg-[#11152c]">
                                    {cert.image ? (
                                        <Image
                                            src={cert.image}
                                            alt={cert.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Award size={48} className="text-pink-500/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">View Details</span>
                                    </div>
                                </div>

                                {/* Text - Centered */}
                                <div className="text-center mt-3">
                                    <h3 className="font-bold text-white text-lg group-hover:text-pink-400 transition-colors line-clamp-1">
                                        {cert.title}
                                    </h3>
                                    {cert.issuer && (
                                        <p className="text-[#16f2b3] text-sm">{cert.issuer}</p>
                                    )}
                                    {cert.date && (
                                        <p className="text-gray-500 text-xs">{cert.date}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Award size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No certificates to display yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setSelectedCertificate(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full"
                        >
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="absolute -top-12 right-0 p-2 text-white hover:text-pink-500 transition-colors"
                            >
                                <X size={28} />
                            </button>

                            {selectedCertificate.image && (
                                <div className="relative w-full h-[50vh] sm:h-[60vh] rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedCertificate.image}
                                        alt={selectedCertificate.title}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                    />
                                </div>
                            )}

                            <div className="text-center mt-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                    {selectedCertificate.title}
                                </h2>
                                {selectedCertificate.issuer && (
                                    <p className="text-[#16f2b3] mt-1">{selectedCertificate.issuer}</p>
                                )}
                                {selectedCertificate.date && (
                                    <p className="text-gray-500 text-sm">{selectedCertificate.date}</p>
                                )}
                                {selectedCertificate.description && (
                                    <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">
                                        {selectedCertificate.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Certificates;
