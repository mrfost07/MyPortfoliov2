"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';
import { Trash2, Edit2, FolderOpen, Plus, ExternalLink, Code } from 'lucide-react';

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
            setProjects(data || []);
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
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
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
                ? formData.tools.split(',').map(t => t.trim()).filter(t => t)
                : formData.tools;

            const payload = {
                ...formData,
                tools: toolsArray,
                image: formData.image && formData.image.trim() !== '' ? formData.image : null
            };

            if (editingId) {
                const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
                if (error) throw error;
                toast.success('Project updated!');
            } else {
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
            image: project.image || ''
        });
        setEditingId(project.id);
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
                <FolderOpen className="text-[#16f2b3]" size={24} />
                {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#0d1224] p-4 rounded-lg border border-[#2a3241]">
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400">Project Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="My Awesome Project"
                                required
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400">Role</label>
                            <input
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Full Stack Developer"
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1.5 text-sm text-gray-400">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the project"
                            required
                            rows="3"
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all resize-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1.5 text-sm text-gray-400">Technologies (comma separated)</label>
                        <input
                            name="tools"
                            value={formData.tools}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400 flex items-center gap-1.5">
                                <Code size={14} />
                                Code URL
                            </label>
                            <input
                                name="code_url"
                                value={formData.code_url}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1.5 text-sm text-gray-400 flex items-center gap-1.5">
                                <ExternalLink size={14} />
                                Demo URL
                            </label>
                            <input
                                name="demo_url"
                                value={formData.demo_url}
                                onChange={handleChange}
                                placeholder="https://myproject.com"
                                className="w-full bg-[#1a202c] p-3 rounded-lg border border-[#2a3241] focus:ring-2 focus:ring-[#16f2b3] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm text-gray-400">Project Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
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
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#16f2b3] text-[#0d1224] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        <Plus size={18} />
                        {uploading ? 'Uploading...' : editingId ? 'Update Project' : 'Add Project'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ name: '', description: '', tools: '', role: '', code_url: '', demo_url: '', image: '' }); }}
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
                    Your Projects ({projects.length})
                </h3>
                {projects.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-[#0d1224] rounded-lg border border-[#2a3241]">
                        No projects added yet.
                    </p>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-[#0d1224] p-4 rounded-lg border border-[#2a3241]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {project.image && (
                                    <img src={project.image} alt={project.name} className="w-full sm:w-28 h-28 object-cover rounded-lg border border-[#2a3241] flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-lg text-white truncate">{project.name}</h4>
                                            {project.role && <p className="text-[#16f2b3] text-sm">{project.role}</p>}
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 text-blue-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-red-400 hover:bg-[#1a202c] rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                    {project.tools && project.tools.length > 0 && (
                                        <div className="flex gap-1.5 mt-2 flex-wrap">
                                            {project.tools.slice(0, 5).map((t, i) => (
                                                <span key={i} className="text-xs bg-[#1a202c] px-2 py-1 rounded text-gray-300">{t}</span>
                                            ))}
                                            {project.tools.length > 5 && (
                                                <span className="text-xs bg-[#1a202c] px-2 py-1 rounded text-gray-500">+{project.tools.length - 5}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-4 mt-2 text-sm">
                                        {project.code_url && (
                                            <a href={project.code_url} target="_blank" rel="noopener noreferrer" className="text-[#16f2b3] hover:underline flex items-center gap-1">
                                                <Code size={14} /> Code
                                            </a>
                                        )}
                                        {project.demo_url && (
                                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline flex items-center gap-1">
                                                <ExternalLink size={14} /> Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
