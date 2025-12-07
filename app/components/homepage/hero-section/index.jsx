"use client";
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import CardSwap, { Card } from "../../helper/CardSwap";

function HeroSection({ profile, projects = [] }) {
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <motion.div
          className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hello, <br />
            This is {' '}
            <span className="text-pink-500">{profile.name}</span>
            {` , I'm a Professional `}
            <span className="text-[#16f2b3]">{profile.designation}</span>
            .
          </motion.h1>

          <motion.div
            className="my-12 flex items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href={profile.github || '#'}
              target='_blank'
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsGithub size={30} />
            </Link>
            <Link
              href={profile.linkedin || '#'}
              target='_blank'
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsLinkedin size={30} />
            </Link>
            <Link
              href={profile.facebook || '#'}
              target='_blank'
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <FaFacebook size={30} />
            </Link>
            <Link
              href={profile.leetcode || '#'}
              target='_blank'
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <SiLeetcode size={30} />
            </Link>
            <Link
              href={profile.twitter || '#'}
              target='_blank'
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <FaTwitterSquare size={30} />
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="#contact" className="bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600">
              <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0d1224] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3">
                <span>Contact me</span>
                <RiContactsFill size={16} />
              </button>
            </Link>

            <Link className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold" role="button" target="_blank" href={profile.resume || '#'}
            >
              <span>Get Resume</span>
              <MdDownload size={16} />
            </Link>
          </motion.div>

        </motion.div>

        {/* Card Swap Section with Project Images */}
        <motion.div
          className="order-1 lg:order-2 flex items-center justify-center relative"
          style={{ height: '500px', minHeight: '400px' }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {projects && projects.length > 0 ? (
            <CardSwap
              width={380}
              height={280}
              cardDistance={60}
              verticalDistance={70}
              delay={2500}
              pauseOnHover={false}
              skewAmount={6}
              easing="elastic"
            >
              {projects.slice(0, 5).map((project, index) => (
                <Card key={project.id || index}>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="380px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-pink-500/30 flex items-center justify-center">
                      <span className="text-white/50 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="card-overlay">
                    <h3>{project.name}</h3>
                    <p>{project.role}</p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          ) : (
            // Fallback: Show placeholder cards if no projects
            <CardSwap
              width={380}
              height={280}
              cardDistance={50}
              verticalDistance={55}
              delay={4000}
              pauseOnHover={true}
            >
              <Card>
                <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-pink-500/30 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Project 1</span>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-violet-600/30 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Project 2</span>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full bg-gradient-to-br from-[#16f2b3]/30 to-violet-600/30 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Project 3</span>
                </div>
              </Card>
            </CardSwap>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;