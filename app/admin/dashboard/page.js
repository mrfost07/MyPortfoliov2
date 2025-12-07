"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/app/components/admin/profile-form';
import ExperienceForm from '@/app/components/admin/experience-form';
import SkillsForm from '@/app/components/admin/skills-form';
import EducationForm from '@/app/components/admin/education-form';
import ProjectsForm from '@/app/components/admin/projects-form';
import BlogsForm from '@/app/components/admin/blogs-form';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'experience', label: 'Experience' },
        { id: 'skills', label: 'Skills' },
        { id: 'education', label: 'Education' },
        { id: 'projects', label: 'Projects' },
        { id: 'blogs', label: 'Blogs' },
    ];

    return (
        <div className="min-h-screen bg-[#0d1224] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/admin');
                        }}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 border-b border-[#2a3241]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-[#16f2b3] text-[#0d1224] font-bold'
                                    : 'bg-[#1a202c] hover:bg-[#2a3241]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-[#1a202c] p-6 rounded-lg border border-[#2a3241]">
                    {activeTab === 'profile' && <ProfileForm />}
                    {activeTab === 'experience' && <ExperienceForm />}
                    {activeTab === 'skills' && <SkillsForm />}
                    {activeTab === 'education' && <EducationForm />}
                    {activeTab === 'projects' && <ProjectsForm />}
                    {activeTab === 'blogs' && <BlogsForm />}
                </div>
            </div>
        </div>
    );
}
