"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2 } from 'lucide-react';

export default function BlogsForm() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', url: '', description: '', cover_image: '', published_at: '' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });
            if (error) throw error;
            setBlogs(data);
        } catch (error) {
            toast.error('Error fetching blogs');
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
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `blogs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setFormData({ ...formData, cover_image: publicUrl });
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
                published_at: formData.published_at || new Date().toISOString()
            };

            if (editingId) {
                const { error } = await supabase.from('blogs').update(payload).eq('id', editingId);
                if (error) throw error;
                toast.success('Blog updated!');
            } else {
                const { error } = await supabase.from('blogs').insert(payload);
                if (error) throw error;
                toast.success('Blog added!');
            }
            setFormData({ title: '', url: '', description: '', cover_image: '', published_at: '' });
            setEditingId(null);
            fetchBlogs();
        } catch (error) {
            console.error(error);
            toast.error('Error saving blog');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;
            toast.success('Blog deleted!');
            fetchBlogs();
        } catch (error) {
            toast.error('Error deleting blog');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Blog' : 'Add Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-[#0d1224] p-4 rounded border border-[#2a3241]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">URL</label>
                        <input name="url" value={formData.url} onChange={handleChange} placeholder="URL" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="mb-1 text-sm text-gray-400">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" rows="3" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Published At (optional)</label>
                        <input type="datetime-local" name="published_at" value={formData.published_at} onChange={handleChange} className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm text-gray-400">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        {formData.cover_image && <img src={formData.cover_image} alt="Blog" className="mt-2 h-32 object-cover rounded" />}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-[#16f2b3] text-[#0d1224] px-6 py-2 rounded font-bold hover:opacity-90">
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', url: '', description: '', cover_image: '', published_at: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:opacity-90">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-[#0d1224] p-4 rounded border border-[#2a3241] flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{blog.title}</h3>
                            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#16f2b3] hover:underline">{blog.url}</a>
                            <p className="text-sm mt-1">{blog.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(blog); setEditingId(blog.id); }} className="p-2 text-blue-400 hover:bg-[#1a202c] rounded"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-400 hover:bg-[#1a202c] rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
