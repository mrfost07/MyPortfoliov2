"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';

export default function ProfileForm() {
    const [profile, setProfile] = useState({
        name: '', designation: '', description: '', bio: '', email: '', phone: '', address: '',
        github: '', facebook: '', linkedin: '', twitter: '', stackoverflow: '',
        leetcode: '', dev_username: '', resume: '', profile_image: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase.from('profile').select('*').single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data) setProfile(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `profile/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setProfile(prev => ({ ...prev, profile_image: publicUrl }));
            toast.success('Image uploaded!');
        } catch (error) {
            console.error(error);
            toast.error('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove id if it exists to avoid issues with upsert if it's not a valid uuid or if we want to let DB handle it
            // Actually upsert needs a primary key match to update. 
            // If we have an ID, we use it. If not, we don't send it?
            // But we only have one profile.

            const { data, error } = await supabase
                .from('profile')
                .upsert(profile)
                .select();

            if (error) throw error;
            toast.success('Profile updated!');
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Name</label>
                    <input name="name" value={profile.name || ''} onChange={handleChange} placeholder="Name" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Designation</label>
                    <input name="designation" value={profile.designation || ''} onChange={handleChange} placeholder="Designation" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label className="mb-1 text-sm text-gray-400">Description (Short tagline for Hero section)</label>
                    <textarea name="description" value={profile.description || ''} onChange={handleChange} placeholder="A short intro shown in the hero section" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" rows="2" />
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label className="mb-1 text-sm text-gray-400">Bio (Who I am? - About section)</label>
                    <textarea name="bio" value={profile.bio || ''} onChange={handleChange} placeholder="Detailed bio for the About Me section" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" rows="5" />
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Email</label>
                    <input name="email" value={profile.email || ''} onChange={handleChange} placeholder="Email" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Phone</label>
                    <input name="phone" value={profile.phone || ''} onChange={handleChange} placeholder="Phone" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Address</label>
                    <input name="address" value={profile.address || ''} onChange={handleChange} placeholder="Address" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>

                {/* Socials */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">GitHub URL</label>
                    <input name="github" value={profile.github || ''} onChange={handleChange} placeholder="GitHub URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">LinkedIn URL</label>
                    <input name="linkedin" value={profile.linkedin || ''} onChange={handleChange} placeholder="LinkedIn URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Facebook URL</label>
                    <input name="facebook" value={profile.facebook || ''} onChange={handleChange} placeholder="Facebook URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Twitter URL</label>
                    <input name="twitter" value={profile.twitter || ''} onChange={handleChange} placeholder="Twitter URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">StackOverflow URL</label>
                    <input name="stackoverflow" value={profile.stackoverflow || ''} onChange={handleChange} placeholder="StackOverflow URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">LeetCode URL</label>
                    <input name="leetcode" value={profile.leetcode || ''} onChange={handleChange} placeholder="LeetCode URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Dev.to Username</label>
                    <input name="dev_username" value={profile.dev_username || ''} onChange={handleChange} placeholder="Dev.to Username" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>

                {/* Resume & Image */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-400">Resume URL</label>
                    <input name="resume" value={profile.resume || ''} onChange={handleChange} placeholder="Resume URL" className="bg-[#0d1224] p-2 rounded border border-[#2a3241]" />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 text-sm text-gray-400">Profile Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    {profile.profile_image && <img src={profile.profile_image} alt="Profile" className="mt-2 h-32 w-32 object-cover rounded-full" />}
                </div>
            </div>
            <button type="submit" className="bg-[#16f2b3] text-[#0d1224] px-6 py-2 rounded font-bold hover:opacity-90">Save Profile</button>
        </form>
    );
}
