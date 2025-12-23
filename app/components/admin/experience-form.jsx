"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2, Briefcase, Plus } from 'lucide-react';

export default function ExperienceForm() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', company: '', duration: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const { data, error } = await supabase.from('experience').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setExperiences(data || []);
        } catch (error) {
            toast.error('Error fetching experience');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase.from('experience').update(formData).eq('id', editingId);
                if (error) throw error;
                toast.success('Experience updated!');
            } else {
                const { error } = await supabase.from('experience').insert(formData);
                if (error) throw error;
                toast.success('Experience added!');
            }
            setFormData({ title: '', company: '', duration: '' });
            setEditingId(null);
            fetchExperiences();
        } catch (error) {
            toast.error('Error saving experience');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('experience').delete().eq('id', id);
            if (error) throw error;
            toast.success('Experience deleted!');
            fetchExperiences();
        } catch (error) {
            toast.error('Error deleting experience');
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
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="text-[#16f2b3]" size={24} />
                {editingId ? 'Edit Experience' : 'Add Experience'}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#0d1224] p-4 rounded-lg border border-[#2a3241]">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1.5 text-sm text-gray-400">Job Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Senior Software Engineer"
                            required
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400">Company *</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g., Google"
                                required
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400">Duration *</label>
                            <input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 2021 - Present"
                                required
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#16f2b3] text-[#0d1224] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
                    >
                        <Plus size={18} />
                        {editingId ? 'Update' : 'Add Experience'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ title: '', company: '', duration: '' }); }}
                            className="flex-1 sm:flex-none bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Your Experience ({experiences.length})
                </h3>
                {experiences.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-[#0d1224] rounded-lg border border-[#2a3241]">
                        No experience added yet.
                    </p>
                ) : (
                    experiences.map((exp) => (
                        <div key={exp.id} className="bg-[#0d1224] p-4 rounded-lg border border-[#2a3241] flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-white">{exp.title}</h4>
                                <p className="text-[#16f2b3] text-sm">{exp.company}</p>
                                <p className="text-gray-500 text-sm">{exp.duration}</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                                <button
                                    onClick={() => { setFormData(exp); setEditingId(exp.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="p-3 text-blue-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="p-3 text-red-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
