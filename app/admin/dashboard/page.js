"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/app/components/admin/profile-form';
import ExperienceForm from '@/app/components/admin/experience-form';
import SkillsForm from '@/app/components/admin/skills-form';
import EducationForm from '@/app/components/admin/education-form';
import ProjectsForm from '@/app/components/admin/projects-form';
import AchievementsForm from '@/app/components/admin/achievements-form';
import CertificatesForm from '@/app/components/admin/certificates-form';
import { User, Briefcase, Code, GraduationCap, FolderOpen, Trophy, Award, LogOut, Menu, X } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1224] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#16f2b3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'certificates', label: 'Certificates', icon: Award },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0d1224] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0d1224]/95 backdrop-blur-sm border-b border-[#2a3241]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#16f2b3] to-pink-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-2">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm font-medium transition-all"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Navigation - Desktop */}
                    <nav className="hidden md:block w-56 flex-shrink-0">
                        <div className="sticky top-24 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                                            ? 'bg-[#16f2b3] text-[#0d1224] font-bold'
                                            : 'text-gray-400 hover:bg-[#1a202c] hover:text-white'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden fixed inset-0 top-[65px] bg-[#0d1224]/95 backdrop-blur-sm z-40 p-4">
                            <div className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-all ${activeTab === tab.id
                                                ? 'bg-[#16f2b3] text-[#0d1224] font-bold'
                                                : 'text-gray-400 bg-[#1a202c] hover:text-white'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    )}

                    {/* Horizontal Tab Bar - Mobile (when menu closed) */}
                    <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
                        <div className="flex gap-2 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${activeTab === tab.id
                                            ? 'bg-[#16f2b3] text-[#0d1224] font-bold'
                                            : 'bg-[#1a202c] text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-transparent sm:bg-[#1a202c] p-2 sm:p-6 rounded-none sm:rounded-xl border-0 sm:border sm:border-[#2a3241]">
                            {activeTab === 'profile' && <ProfileForm />}
                            {activeTab === 'experience' && <ExperienceForm />}
                            {activeTab === 'skills' && <SkillsForm />}
                            {activeTab === 'education' && <EducationForm />}
                            {activeTab === 'projects' && <ProjectsForm />}
                            {activeTab === 'achievements' && <AchievementsForm />}
                            {activeTab === 'certificates' && <CertificatesForm />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
