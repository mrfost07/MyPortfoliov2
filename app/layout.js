import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import IntroWrapper from "./components/helper/intro-wrapper";
import Navbar from "./components/navbar";
import "./css/card.scss";
import "./css/globals.scss";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Renier F - Software Developer",
  description:
    "I am a passionate Software Engineer currently pursuing a degree in Computer Science at Surigao del Norte State University. My journey in the world of technology is driven by a deep enthusiasm for coding, problem-solving, and an unwavering commitment to learning new technologies.",
  verification: {
    google: "OwJsVLVxEB5B46FDoCibgqwsI_i_xQe7bUrSlWNEqig",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ToastContainer />
        <IntroWrapper>
          <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
            <Navbar />
            {children}
            <ScrollToTop />
          </main>
          <Footer />
        </IntroWrapper>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}

