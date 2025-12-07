import { supabase } from "./supabase-client";

export async function getProfile() {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) {
        console.warn('Error fetching profile:', error.message);
        return null;
    }
    return data;
}

export async function getExperiences() {
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.warn('Error fetching experience:', error.message);
        return [];
    }
    return data;
}

export async function getSkills() {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: true }); // Fetch all for admin, filter in component if needed

    if (error) {
        console.warn('Error fetching skills:', error.message);
        return [];
    }
    return data;
}

export async function getEducations() {
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.warn('Error fetching education:', error.message);
        return [];
    }
    return data;
}

export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.warn('Error fetching projects:', error.message);
        return [];
    }
    console.log('Fetched Projects:', JSON.stringify(data, null, 2)); // Debug log
    return data;
}

export async function getBlogs() {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) {
        console.warn('Error fetching blogs:', error.message);
        return [];
    }
    return data;
}
