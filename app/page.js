import { getProfile, getExperiences, getSkills, getEducations, getProjects, getAchievements, getCertificates } from "@/utils/data-fetch";
import AboutSection from "./components/homepage/about";
import Achievements from "./components/homepage/achievements";
import Certificates from "./components/homepage/certificates";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

export const revalidate = 0;

export default async function Home() {
  const profile = await getProfile();
  const experiences = await getExperiences();
  const skills = await getSkills();
  const educations = await getEducations();
  const projects = await getProjects();
  const achievements = await getAchievements();
  const certificates = await getCertificates();

  // Fallback if no profile data yet (to avoid crash)
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to mrFost!</h1>
          <p>Please log in to <a href="/admin" className="text-[#16f2b3] underline">/admin</a> to set up your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning >
      <HeroSection profile={profile} projects={projects} />
      <AboutSection profile={profile} />
      <Experience experiences={experiences} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Education educations={educations} />
      <Achievements achievements={achievements} />
      <Certificates certificates={certificates} />
      <ContactSection profile={profile} />
    </div>
  )
};