"use client";
import { motion } from 'framer-motion';
import Image from "next/image";

function AboutSection({ profile }) {
    return (
        <div id="about" className="my-12 lg:my-16 relative">
            <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
                <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
                    ABOUT ME
                </span>
                <span className="h-36 w-[2px] bg-[#1a1443]"></span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <motion.div
                    className="order-2 lg:order-1"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
                        Who I am?
                    </p>
                    <p className="text-gray-200 text-sm lg:text-lg">
                        {profile.bio || profile.description}
                    </p>
                </motion.div>
                <motion.div
                    className="flex justify-center order-1 lg:order-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <Image
                        src={profile.profile_image || '/profile.png'}
                        width={280}
                        height={280}
                        alt={profile.name}
                        className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default AboutSection;
