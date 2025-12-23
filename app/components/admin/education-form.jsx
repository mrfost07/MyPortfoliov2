"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2, GraduationCap, Plus } from 'lucide-react';

export default function EducationForm() {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', institution: '', duration: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const { data, error } = await supabase.from('education').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setEducations(data || []);
        } catch (error) {
            toast.error('Error fetching education');
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
                const { error } = await supabase.from('education').update(formData).eq('id', editingId);
                if (error) throw error;
                toast.success('Education updated!');
            } else {
                const { error } = await supabase.from('education').insert(formData);
                if (error) throw error;
                toast.success('Education added!');
            }
            setFormData({ title: '', institution: '', duration: '' });
            setEditingId(null);
            fetchEducations();
        } catch (error) {
            toast.error('Error saving education');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('education').delete().eq('id', id);
            if (error) throw error;
            toast.success('Education deleted!');
            fetchEducations();
        } catch (error) {
            toast.error('Error deleting education');
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
                <GraduationCap className="text-[#16f2b3]" size={24} />
                {editingId ? 'Edit Education' : 'Add Education'}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#0d1224] p-4 rounded-lg border border-[#2a3241]">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1.5 text-sm text-gray-400">Degree/Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            required
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400">Institution *</label>
                            <input
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="e.g., University of Technology"
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
                                placeholder="e.g., 2018 - 2022"
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
                        {editingId ? 'Update' : 'Add Education'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ title: '', institution: '', duration: '' }); }}
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
                    Your Education ({educations.length})
                </h3>
                {educations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-[#0d1224] rounded-lg border border-[#2a3241]">
                        No education added yet.
                    </p>
                ) : (
                    educations.map((edu) => (
                        <div key={edu.id} className="bg-[#0d1224] p-4 rounded-lg border border-[#2a3241] flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-white">{edu.title}</h4>
                                <p className="text-[#16f2b3] text-sm">{edu.institution}</p>
                                <p className="text-gray-500 text-sm">{edu.duration}</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                                <button
                                    onClick={() => { setFormData(edu); setEditingId(edu.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="p-3 text-blue-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(edu.id)}
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
