"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCode, FaExternalLinkAlt } from 'react-icons/fa';

function Projects({ projects }) {
  return (
    <div id='projects' className="relative z-50 my-8 lg:my-24">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="py-4 md:py-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#1a1443] transform -translate-x-1/2 hidden md:block"></div>

        <div className="flex flex-col gap-6 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`flex flex-col md:flex-row gap-4 md:gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#16f2b3] rounded-full transform -translate-x-1/2 border-4 border-[#0d1224] z-10 hidden md:block"></div>

              {/* Content */}
              <div className="w-full md:w-1/2 px-4">
                <div className="bg-[#11152c] p-4 md:p-6 rounded-lg border border-[#2a3241] hover:border-[#16f2b3] transition-all duration-300 group">
                  {/* Image - Smaller on mobile */}
                  <div className="relative overflow-hidden rounded-lg mb-3 md:mb-4 h-36 md:h-64">
                    {project.image && project.image.trim() !== '' ? (
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a202c] flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.code_url && (
                        <Link href={project.code_url} target="_blank" className="p-3 bg-[#1a202c] rounded-full text-white hover:text-[#16f2b3] hover:bg-[#2a3241] transition-all">
                          <FaCode size={20} />
                        </Link>
                      )}
                      {project.demo_url && (
                        <Link href={project.demo_url} target="_blank" className="p-3 bg-[#1a202c] rounded-full text-white hover:text-[#16f2b3] hover:bg-[#2a3241] transition-all">
                          <FaExternalLinkAlt size={20} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Text - Compact on mobile */}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-xs md:text-sm text-[#16f2b3] mb-2 md:mb-3">{project.role}</p>
                  <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">{project.description}</p>

                  {/* Tags - Show fewer on mobile */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {project.tools && project.tools.slice(0, 4).map((tool, i) => (
                      <span key={i} className="text-[10px] md:text-xs bg-[#1a202c] px-2 py-1 rounded text-gray-300 border border-[#2a3241]">{tool}</span>
                    ))}
                    {project.tools && project.tools.length > 4 && (
                      <span className="text-[10px] md:text-xs bg-[#1a202c] px-2 py-1 rounded text-gray-500 border border-[#2a3241]">+{project.tools.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Spacer for the other side */}
              <div className="w-full md:w-1/2 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
