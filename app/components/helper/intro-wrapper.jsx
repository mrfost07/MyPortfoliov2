"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const IntroScreen = dynamic(() => import("./intro-screen"), { ssr: false });

const IntroWrapper = ({ children }) => {
    const [showIntro, setShowIntro] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check if this is the first visit
        const hasVisited = localStorage.getItem("hasVisitedBefore");

        if (!hasVisited) {
            setShowIntro(true);
        } else {
            setIntroComplete(true);
        }
    }, []);

    const handleIntroComplete = () => {
        localStorage.setItem("hasVisitedBefore", "true");
        setShowIntro(false);
        setIntroComplete(true);
    };

    // Don't render anything until we know if we should show intro
    if (!isClient) {
        return (
            <div className="min-h-screen bg-black" />
        );
    }

    return (
        <>
            {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
            <div style={{
                opacity: introComplete ? 1 : 0,
                transition: "opacity 0.5s ease-in-out"
            }}>
                {children}
            </div>
        </>
    );
};

export default IntroWrapper;
