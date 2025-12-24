"use client"

import { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";

const AnimationLottie = ({ animationPath, width }) => {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Control animation based on visibility
  useEffect(() => {
    if (lottieRef.current) {
      if (isVisible) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <div ref={containerRef}>
      <Lottie
        lottieRef={lottieRef}
        loop={true}
        autoplay={true}
        animationData={animationPath}
        style={{ width: '95%' }}
      />
    </div>
  );
};

export default AnimationLottie;
