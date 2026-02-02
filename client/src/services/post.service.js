import api from './api';

const postService = {
    getAllPosts: async (type) => {
        const url = type ? `/posts?type=${type}` : '/posts';
        const response = await api.get(url);
        return response.data;
    },

    getPostById: async (postId) => {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/posts', postData);
        return response.data;
    },

    updatePost: async (postId, postData) => {
        const response = await api.put(`/posts/${postId}`, postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    likePost: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    uploadMultipleFiles: async (files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        const response = await api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default postService;
