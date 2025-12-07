"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';

const AVAILABLE_SKILLS = [
    "HTML", "CSS", "JS", "React", "Next JS", "Nuxt JS", "Node JS", "Vue", "Angular", "Docker", "Photoshop", "Illustrator", "Svelte", "GCP", "Azure", "Fastify", "Haxe", "Ionic", "Markdown", "Microsoft Office", "Picsart", "Sketch", "Unity", "WolframAlpha", "Adobe XD", "After Effects", "Bootstrap", "Bulma", "CapacitorJs", "Coffeescript", "MemSQL", "C", "C++", "C#", "Python", "Java", "Julia", "Matlab", "Swift", "Ruby", "Kotlin", "Go", "PHP", "Flutter", "Dart", "Typescript", "Git", "Figma", "Canva", "Ubuntu", "MongoDB", "Tailwind", "ViteJS", "VuetifyJS", "MySQL", "PostgreSQL", "AWS", "Firebase", "Blender", "Premiere Pro", "Adobe Audition", "Deno", "Django", "Gimp", "Graphql", "Lightroom", "MaterialUI", "Nginx", "Numpy", "OpenCV", "Pytorch", "Selenium", "Strapi", "Tensorflow", "Webex", "Wordpress"
];

export default function SkillsForm() {
    const [enabledSkills, setEnabledSkills] = useState([]);
    const [loading, setLoading] = useState(true);

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

        // Update DB
        try {
            // Check if skill exists
            const { data: existing } = await supabase.from('skills').select('id').eq('name', skill).single();

            if (existing) {
                await supabase.from('skills').update({ is_enabled: !isEnabled }).eq('id', existing.id);
            } else {
                await supabase.from('skills').insert({ name: skill, is_enabled: true });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating skill');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Manage Skills</h2>
            <p className="mb-4 text-gray-400">Select the skills you want to display on your portfolio.</p>
            <div className="flex flex-wrap gap-3">
                {AVAILABLE_SKILLS.map((skill) => (
                    <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full border transition-all ${enabledSkills.includes(skill)
                                ? 'bg-[#16f2b3] text-[#0d1224] border-[#16f2b3] font-bold'
                                : 'bg-transparent text-gray-400 border-gray-600 hover:border-[#16f2b3] hover:text-[#16f2b3]'
                            }`}
                    >
                        {skill}
                    </button>
                ))}
            </div>
        </div>
    );
}
