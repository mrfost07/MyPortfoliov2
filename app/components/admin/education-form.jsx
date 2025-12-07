"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2 } from 'lucide-react';

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
            setEducations(data);
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Education' : 'Add Education'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-[#0d1224] p-4 rounded border border-[#2a3241]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Degree/Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Degree" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Institution</label>
                        <input name="institution" value={formData.institution} onChange={handleChange} placeholder="Institution" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
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
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', institution: '', duration: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:opacity-90">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                {educations.map((edu) => (
                    <div key={edu.id} className="bg-[#0d1224] p-4 rounded border border-[#2a3241] flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{edu.title}</h3>
                            <p className="text-sm text-gray-400">{edu.institution}</p>
                            <p className="text-sm">{edu.duration}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(edu); setEditingId(edu.id); }} className="p-2 text-blue-400 hover:bg-[#1a202c] rounded"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(edu.id)} className="p-2 text-red-400 hover:bg-[#1a202c] rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
