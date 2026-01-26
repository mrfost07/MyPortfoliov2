"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroScreen = ({ onComplete }) => {
    const [displayText, setDisplayText] = useState("");
    const [phase, setPhase] = useState("typing"); // typing, colorTransition, warp, fadeOut, done
    const [navbarPosition, setNavbarPosition] = useState({ x: 0, y: 0 });
    const textRef = useRef(null);
    const fullText = "Renier F";
    const typingSpeed = 120; // ms per character - slightly faster

    // Calculate exact navbar position
    useEffect(() => {
        const calculateNavbarPosition = () => {
            // Navbar is at top-left with padding: py-5 (20px) and px-6 (24px) on mobile, sm:px-12 (48px)
            const isMobile = window.innerWidth < 640;
            const paddingX = isMobile ? 24 : 48;
            const paddingY = 20;

            // Account for the max-width container centering
            let containerOffset = 0;
            if (window.innerWidth >= 1536) { // 2xl
                containerOffset = (window.innerWidth - 1472) / 2; // 92rem = 1472px
            } else if (window.innerWidth >= 1280) { // xl
                containerOffset = (window.innerWidth - 1216) / 2; // 76rem = 1216px
            } else if (window.innerWidth >= 1024) { // lg
                containerOffset = (window.innerWidth - 1120) / 2; // 70rem = 1120px
            }

            setNavbarPosition({
                x: containerOffset + paddingX,
                y: paddingY
            });
        };

        calculateNavbarPosition();
        window.addEventListener("resize", calculateNavbarPosition);
        return () => window.removeEventListener("resize", calculateNavbarPosition);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (phase !== "typing") return;

        if (displayText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length + 1));
            }, typingSpeed);
            return () => clearTimeout(timeout);
        } else {
            // Typing complete, start color transition
            setTimeout(() => setPhase("colorTransition"), 400);
        }
    }, [displayText, phase]);

    // Phase transitions
    useEffect(() => {
        if (phase === "colorTransition") {
            setTimeout(() => setPhase("warp"), 600);
        } else if (phase === "warp") {
            // After warp animation completes, instantly disappear and show webapp
            setTimeout(() => {
                setPhase("done");
                onComplete();
            }, 1200);
        }
    }, [phase, onComplete]);

    // Get current text position for warp calculation
    const getTextCenter = useCallback(() => {
        if (textRef.current) {
            const rect = textRef.current.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }, []);

    if (phase === "done") return null;

    // Calculate target position (navbar logo position)
    const targetX = navbarPosition.x;
    const targetY = navbarPosition.y;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                style={{ backgroundColor: "#000000" }}
                initial={{ opacity: 1 }}
                animate={{
                    opacity: 1,
                    backgroundColor: phase === "typing" ? "#000000" : "#0d1224"
                }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
            >
                <motion.h1
                    ref={textRef}
                    className="font-bold select-none whitespace-nowrap"
                    style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "optimizeLegibility"
                    }}
                    initial={{
                        fontSize: "clamp(2.5rem, 8vw, 5rem)",
                        color: "#ffffff",
                        x: 0,
                        y: 0,
                        position: "relative"
                    }}
                    animate={{
                        fontSize: phase === "warp" ? "1.875rem" : "clamp(2.5rem, 8vw, 5rem)",
                        color: phase === "typing" ? "#ffffff" : "#16f2b3",
                        x: phase === "warp"
                            ? targetX - window.innerWidth / 2 + 50 // Adjust for text width
                            : 0,
                        y: phase === "warp"
                            ? targetY - window.innerHeight / 2 + 15 // Adjust for text height
                            : 0,
                        textShadow: phase === "colorTransition"
                            ? "0 0 30px rgba(22, 242, 179, 0.6), 0 0 60px rgba(22, 242, 179, 0.3)"
                            : phase === "warp"
                                ? "0 0 10px rgba(22, 242, 179, 0.3)"
                                : "none"
                    }}
                    transition={{
                        duration: phase === "warp" ? 1.2 : 0.5,
                        ease: phase === "warp"
                            ? [0.22, 1, 0.36, 1] // Custom smooth ease-out
                            : [0.4, 0, 0.2, 1],
                        fontSize: { duration: phase === "warp" ? 1.0 : 0.5 },
                        color: { duration: 0.5, ease: "easeOut" },
                        textShadow: { duration: 0.4 }
                    }}
                >
                    {displayText}
                    {phase === "typing" && displayText.length < fullText.length && (
                        <motion.span
                            className="inline-block ml-1 bg-white"
                            style={{
                                width: "3px",
                                height: "1em",
                                verticalAlign: "text-bottom"
                            }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                </motion.h1>
            </motion.div>
        </AnimatePresence>
    );
};

export default IntroScreen;
