"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Github, Linkedin, Facebook, Twitter, FileText, Image as ImageIcon, Save } from 'lucide-react';

// Defined OUTSIDE ProfileForm to prevent re-creation on every render (fixes focus loss)
const InputField = ({ icon: Icon, label, name, type = "text", placeholder, required = false, value, onChange }) => (
    <div className="flex flex-col">
        <label className="mb-1.5 text-xs sm:text-sm text-gray-400 flex items-center gap-1.5">
            {Icon && <Icon size={14} />}
            {label} {required && <span className="text-pink-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-[#0d1224] px-3 py-2.5 sm:p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3]/50 focus:border-[#16f2b3] outline-none transition-all duration-200 text-sm sm:text-base text-white placeholder-gray-600"
        />
    </div>
);

const TextAreaField = ({ label, name, placeholder, rows = 3, value, onChange }) => (
    <div className="flex flex-col">
        <label className="mb-1.5 text-xs sm:text-sm text-gray-400">{label}</label>
        <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-[#0d1224] px-3 py-2.5 sm:p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3]/50 focus:border-[#16f2b3] outline-none transition-all duration-200 text-sm sm:text-base text-white placeholder-gray-600 resize-none"
        />
    </div>
);

export default function ProfileForm() {
    const [profile, setProfile] = useState({
        name: '', designation: '', description: '', bio: '', email: '', phone: '', address: '',
        github: '', facebook: '', linkedin: '', twitter: '', stackoverflow: '',
        leetcode: '', dev_username: '', resume: '', profile_image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
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
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('profile')
                .upsert(profile)
                .select();

            if (error) throw error;
            toast.success('Profile saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile');
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-[#16f2b3]" size={24} />
                    Edit Profile
                </h2>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2a3241] pb-2">
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField icon={User} label="Name" name="name" placeholder="Your full name" required value={profile.name} onChange={handleChange} />
                    <InputField label="Designation" name="designation" placeholder="e.g., Software Engineer" required value={profile.designation} onChange={handleChange} />
                </div>
                <TextAreaField label="Hero Description" name="description" placeholder="Short tagline for Hero section" rows={2} value={profile.description} onChange={handleChange} />
                <TextAreaField label="About Me (Bio)" name="bio" placeholder="Detailed bio for the About section" rows={4} value={profile.bio} onChange={handleChange} />
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2a3241] pb-2">
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputField icon={Mail} label="Email" name="email" type="email" placeholder="your@email.com" value={profile.email} onChange={handleChange} />
                    <InputField icon={Phone} label="Phone" name="phone" placeholder="+1 234 567 890" value={profile.phone} onChange={handleChange} />
                    <InputField icon={MapPin} label="Address" name="address" placeholder="City, Country" value={profile.address} onChange={handleChange} />
                </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2a3241] pb-2">
                    Social Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField icon={Github} label="GitHub" name="github" placeholder="https://github.com/username" value={profile.github} onChange={handleChange} />
                    <InputField icon={Linkedin} label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/username" value={profile.linkedin} onChange={handleChange} />
                    <InputField icon={Facebook} label="Facebook" name="facebook" placeholder="https://facebook.com/username" value={profile.facebook} onChange={handleChange} />
                    <InputField icon={Twitter} label="Twitter" name="twitter" placeholder="https://twitter.com/username" value={profile.twitter} onChange={handleChange} />
                    <InputField label="StackOverflow" name="stackoverflow" placeholder="https://stackoverflow.com/users/..." value={profile.stackoverflow} onChange={handleChange} />
                    <InputField label="LeetCode" name="leetcode" placeholder="https://leetcode.com/username" value={profile.leetcode} onChange={handleChange} />
                    <InputField label="Dev.to Username" name="dev_username" placeholder="your-dev-username" value={profile.dev_username} onChange={handleChange} />
                </div>
            </div>

            {/* Resume & Image Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2a3241] pb-2">
                    Resume & Profile Image
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField icon={FileText} label="Resume URL" name="resume" placeholder="Link to your resume" value={profile.resume} onChange={handleChange} />
                    <div className="flex flex-col">
                        <label className="mb-1.5 text-sm text-gray-400 flex items-center gap-1.5">
                            <ImageIcon size={14} />
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
                        />
                    </div>
                </div>
                {profile.profile_image && (
                    <div className="flex justify-center sm:justify-start">
                        <img
                            src={profile.profile_image}
                            alt="Profile"
                            className="h-24 w-24 object-cover rounded-full border-2 border-[#16f2b3]"
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#2a3241]">
                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#16f2b3] text-[#0d1224] px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
