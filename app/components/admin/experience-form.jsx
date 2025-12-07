"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2 } from 'lucide-react';

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
            setExperiences(data);
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-[#0d1224] p-4 rounded border border-[#2a3241]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Job Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Company</label>
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Duration</label>
                        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-[#16f2b3] text-[#0d1224] px-6 py-2 rounded font-bold hover:opacity-90">
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', company: '', duration: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:opacity-90">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-[#0d1224] p-4 rounded border border-[#2a3241] flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{exp.title}</h3>
                            <p className="text-sm text-gray-400">{exp.company}</p>
                            <p className="text-sm">{exp.duration}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(exp); setEditingId(exp.id); }} className="p-2 text-blue-400 hover:bg-[#1a202c] rounded"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:bg-[#1a202c] rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
