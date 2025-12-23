"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaArrowUp } from "react-icons/fa6";

const DEFAULT_BTN_CLS =
  "fixed bottom-20 right-6 z-50 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 p-3 text-white/80 hover:text-[#16f2b3] hover:border-[#16f2b3]/50 transition-all duration-300 ease-out";
const SCROLL_THRESHOLD = 50;

const ScrollToTop = () => {
  const pathname = usePathname();
  const [btnCls, setBtnCls] = useState(DEFAULT_BTN_CLS + " hidden");

  // Hide on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) return;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setBtnCls(DEFAULT_BTN_CLS);
      } else {
        setBtnCls(DEFAULT_BTN_CLS + " hidden");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => {
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [isAdminPage]);

  // Don't render on admin pages
  if (isAdminPage) {
    return null;
  }

  const onClickBtn = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button className={btnCls} onClick={onClickBtn}>
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;
