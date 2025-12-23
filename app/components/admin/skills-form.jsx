"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Code, Check } from 'lucide-react';

const AVAILABLE_SKILLS = [
    "HTML", "CSS", "JS", "React", "Next JS", "Nuxt JS", "Node JS", "Vue", "Angular", "Docker", "Photoshop", "Illustrator", "Svelte", "GCP", "Azure", "Fastify", "Haxe", "Ionic", "Markdown", "Microsoft Office", "Picsart", "Sketch", "Unity", "WolframAlpha", "Adobe XD", "After Effects", "Bootstrap", "Bulma", "CapacitorJs", "Coffeescript", "MemSQL", "C", "C++", "C#", "Python", "Java", "Julia", "Matlab", "Swift", "Ruby", "Kotlin", "Go", "PHP", "Flutter", "Dart", "Typescript", "Git", "Figma", "Canva", "Ubuntu", "MongoDB", "Tailwind", "ViteJS", "VuetifyJS", "MySQL", "PostgreSQL", "AWS", "Firebase", "Blender", "Premiere Pro", "Adobe Audition", "Deno", "Django", "Gimp", "Graphql", "Lightroom", "MaterialUI", "Nginx", "Numpy", "OpenCV", "Pytorch", "Selenium", "Strapi", "Tensorflow", "Webex", "Wordpress"
];

// Group skills by category for better organization
const SKILL_CATEGORIES = {
    "Languages": ["HTML", "CSS", "JS", "Typescript", "Python", "Java", "C", "C++", "C#", "Go", "PHP", "Ruby", "Kotlin", "Swift", "Dart", "Julia", "Coffeescript", "Matlab"],
    "Frontend": ["React", "Next JS", "Vue", "Nuxt JS", "Angular", "Svelte", "Bootstrap", "Tailwind", "MaterialUI", "VuetifyJS", "Bulma"],
    "Backend": ["Node JS", "Django", "Fastify", "Strapi", "Deno", "Nginx"],
    "Mobile": ["Flutter", "Ionic", "CapacitorJs"],
    "Database": ["MongoDB", "MySQL", "PostgreSQL", "MemSQL", "Firebase"],
    "Cloud & DevOps": ["Docker", "AWS", "GCP", "Azure", "Git", "Ubuntu"],
    "AI/ML": ["Tensorflow", "Pytorch", "OpenCV", "Numpy", "Selenium"],
    "Design": ["Figma", "Photoshop", "Illustrator", "Adobe XD", "Canva", "Sketch", "Gimp", "Lightroom"],
    "Video/3D": ["Blender", "Premiere Pro", "After Effects", "Adobe Audition", "Unity"],
    "Other": ["ViteJS", "Graphql", "Markdown", "Microsoft Office", "Picsart", "WolframAlpha", "Webex", "Wordpress", "Haxe"]
};

export default function SkillsForm() {
    const [enabledSkills, setEnabledSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data, error } = await supabase.from('skills').select('*');
            if (error) throw error;
            setEnabledSkills(data.filter(s => s.is_enabled).map(s => s.name));
        } catch (error) {
            console.error(error);
            toast.error('Error fetching skills');
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = async (skill) => {
        const isEnabled = enabledSkills.includes(skill);
        const newEnabled = isEnabled
            ? enabledSkills.filter(s => s !== skill)
            : [...enabledSkills, skill];

        setEnabledSkills(newEnabled);
        setSaving(true);

        try {
            const { data: existing } = await supabase.from('skills').select('id').eq('name', skill).maybeSingle();

            if (existing) {
                await supabase.from('skills').update({ is_enabled: !isEnabled }).eq('id', existing.id);
            } else {
                await supabase.from('skills').insert({ name: skill, is_enabled: true });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating skill');
            // Revert on error
            setEnabledSkills(enabledSkills);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#16f2b3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Code className="text-[#16f2b3]" size={24} />
                    Manage Skills
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="bg-[#16f2b3] text-[#0d1224] px-2 py-1 rounded font-bold">
                        {enabledSkills.length}
                    </span>
                    skills selected
                </div>
            </div>

            <p className="text-gray-400 text-sm">
                Click on skills to toggle them on/off. Selected skills will be displayed on your portfolio.
            </p>

            {/* Skills by Category */}
            <div className="space-y-6">
                {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2a3241] pb-2">
                            {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => {
                                const isEnabled = enabledSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        disabled={saving}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isEnabled
                                            ? 'bg-[#16f2b3] text-[#0d1224]'
                                            : 'bg-[#0d1224] text-gray-400 border border-[#2a3241] hover:border-[#16f2b3] hover:text-[#16f2b3]'
                                            }`}
                                    >
                                        {isEnabled && <Check size={14} />}
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
