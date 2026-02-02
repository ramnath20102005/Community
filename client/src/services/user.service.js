import api from './api';

const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    promoteToClubMember: async (userId, clubName, position) => {
        const response = await api.post('/users/promote', { userId, clubName, position });
        return response.data;
    },

    demoteUser: async (userId) => {
        const response = await api.post('/users/demote', { userId });
        return response.data;
    },

    getAlumni: async () => {
        const response = await api.get('/users/alumni');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    triggerBackup: async () => {
        const response = await api.post('/users/backup');
        return response.data;
    }
};

export default userService;
