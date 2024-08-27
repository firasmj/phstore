import { create } from "zustand";

const useUserAuth = create((set) => ({
    id: null,
    username: '',
    email: '',
    password: '',
    registered: '',
    address: '',
    bio: '',
    userLogout: () => set((state) => ({
        id: null,
        username: '',
        email: '',
        password: '',
        registered: '',
        address: '',
        bio: ''
    }))
}));

const useAdminAuth = create((set) => ({
    id: null,
    username: '',
    password: '',
    adminLogout: () => set((state) => ({
        id: null,
        username: '',
        password: ''
    }))
}));

export { useUserAuth, useAdminAuth };