"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

export default function AchievementsForm() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', description: '', image: '', date: '' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('order_index', { ascending: true });
            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching achievements');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `achievements/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: publicUrl }));
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
            const payload = {
                ...formData,
                image: formData.image && formData.image.trim() !== '' ? formData.image : null,
                order_index: editingId ? formData.order_index : achievements.length
            };

            if (editingId) {
                const { error } = await supabase.from('achievements').update(payload).eq('id', editingId);
                if (error) throw error;
                toast.success('Achievement updated!');
            } else {
                const { id, ...insertPayload } = payload;
                const { error } = await supabase.from('achievements').insert(insertPayload);
                if (error) throw error;
                toast.success('Achievement added!');
            }
            setFormData({ title: '', description: '', image: '', date: '' });
            setEditingId(null);
            fetchAchievements();
        } catch (error) {
            console.error('Error saving achievement:', error);
            toast.error('Error saving achievement');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            ...item,
            image: item.image || ''
        });
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this achievement?')) return;
        try {
            const { error } = await supabase.from('achievements').delete().eq('id', id);
            if (error) throw error;
            toast.success('Achievement deleted!');
            fetchAchievements();
        } catch (error) {
            toast.error('Error deleting achievement');
        }
    };

    const moveItem = async (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= achievements.length) return;

        const items = [...achievements];
        const [removed] = items.splice(index, 1);
        items.splice(newIndex, 0, removed);

        // Update order_index for all items
        const updates = items.map((item, i) => ({ id: item.id, order_index: i }));

        try {
            for (const update of updates) {
                await supabase.from('achievements').update({ order_index: update.order_index }).eq('id', update.id);
            }
            fetchAchievements();
        } catch (error) {
            toast.error('Error reordering');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Achievement' : 'Add Achievement'}</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#0d1224] p-4 rounded-lg border border-[#2a3241]">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Achievement Title"
                            required
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Date</label>
                        <input
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="e.g., March 2024"
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your achievement"
                            rows="3"
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all resize-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm text-gray-400">Achievement Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
                        />
                        {formData.image && (
                            <div className="mt-3">
                                <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-[#2a3241]" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 sm:flex-none bg-[#16f2b3] text-[#0d1224] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : editingId ? 'Update' : 'Add Achievement'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ title: '', description: '', image: '', date: '' }); }}
                            className="flex-1 sm:flex-none bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-300">Your Achievements ({achievements.length})</h3>
                {achievements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No achievements yet. Add your first one above!</p>
                ) : (
                    achievements.map((item, index) => (
                        <div key={item.id} className="bg-[#0d1224] p-4 rounded-lg border border-[#2a3241] flex flex-col sm:flex-row gap-4">
                            {/* Reorder Controls */}
                            <div className="flex sm:flex-col justify-center gap-1">
                                <button
                                    onClick={() => moveItem(index, -1)}
                                    disabled={index === 0}
                                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                                >
                                    <ChevronUp size={20} />
                                </button>
                                <button
                                    onClick={() => moveItem(index, 1)}
                                    disabled={index === achievements.length - 1}
                                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col sm:flex-row gap-4">
                                {item.image && (
                                    <img src={item.image} alt={item.title} className="w-full sm:w-24 h-24 object-cover rounded-lg border border-[#2a3241]" />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg">{item.title}</h4>
                                    {item.date && <p className="text-sm text-[#16f2b3]">{item.date}</p>}
                                    {item.description && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col gap-2 justify-end">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-3 text-blue-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
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
