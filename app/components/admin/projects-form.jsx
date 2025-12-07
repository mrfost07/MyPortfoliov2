"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2 } from 'lucide-react';

export default function ProjectsForm() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', description: '', tools: '', role: '', code_url: '', demo_url: '', image: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data);
        } catch (error) {
            toast.error('Error fetching projects');
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
            const filePath = `projects/${fileName}`;

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
            const toolsArray = typeof formData.tools === 'string'
                ? formData.tools.split(',').map(t => t.trim())
                : formData.tools;

            // Convert empty image string to null
            const payload = {
                ...formData,
                tools: toolsArray,
                image: formData.image && formData.image.trim() !== '' ? formData.image : null
            };

            console.log('Submitting Payload:', payload); // Debug log

            if (editingId) {
                const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
                if (error) throw error;
                toast.success('Project updated!');
            } else {
                // Remove id from payload when inserting new project (let DB auto-generate)
                const { id, ...insertPayload } = payload;
                const { error } = await supabase.from('projects').insert(insertPayload);
                if (error) throw error;
                toast.success('Project added!');
            }

            setFormData({ name: '', description: '', tools: '', role: '', code_url: '', demo_url: '', image: '' });
            setEditingId(null);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Error saving project');
        }
    };

    const handleEdit = (project) => {
        setFormData({
            ...project,
            tools: project.tools ? project.tools.join(', ') : '',
            image: project.image || '' // Ensure image is not null
        });
        setEditingId(project.id);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            toast.success('Project deleted!');
            fetchProjects();
        } catch (error) {
            toast.error('Error deleting project');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-[#0d1224] p-4 rounded border border-[#2a3241]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Project Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Role</label>
                        <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="mb-1 text-sm text-gray-400">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" rows="3" />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="mb-1 text-sm text-gray-400">Tools (comma separated)</label>
                        <input name="tools" value={formData.tools} onChange={handleChange} placeholder="Tools (comma separated)" className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Code URL</label>
                        <input name="code_url" value={formData.code_url} onChange={handleChange} placeholder="Code URL" className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-400">Demo URL</label>
                        <input name="demo_url" value={formData.demo_url} onChange={handleChange} placeholder="Demo URL" className="bg-[#1a202c] p-2 rounded border border-[#2a3241]" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm text-gray-400">Project Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        {formData.image && (
                            <div className="mt-2">
                                <img src={formData.image} alt="Project" className="h-32 object-cover rounded" />
                                <p className="text-xs text-gray-500 mt-1 break-all">URL: {formData.image}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-[#16f2b3] text-[#0d1224] px-6 py-2 rounded font-bold hover:opacity-90">
                        {editingId ? 'Update Project' : 'Add Project'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '', tools: '', role: '', code_url: '', demo_url: '', image: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:opacity-90">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-[#0d1224] p-4 rounded border border-[#2a3241] flex justify-between items-start">
                        <div className="flex gap-4">
                            {project.image && (
                                <img src={project.image} alt={project.name} className="w-24 h-24 object-cover rounded border border-[#2a3241]" />
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{project.name}</h3>
                                <p className="text-sm text-gray-400">{project.role}</p>
                                <p className="text-sm mt-1 whitespace-pre-wrap">{project.description}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {project.tools && project.tools.map((t, i) => (
                                        <span key={i} className="text-xs bg-[#1a202c] px-2 py-1 rounded">{t}</span>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-2 text-sm text-[#16f2b3]">
                                    {project.code_url && <a href={project.code_url} target="_blank" rel="noopener noreferrer">Code</a>}
                                    {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer">Demo</a>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(project)} className="p-2 text-blue-400 hover:bg-[#1a202c] rounded"><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-400 hover:bg-[#1a202c] rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
