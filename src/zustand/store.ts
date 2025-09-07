import { create } from 'zustand';

interface EnableHomeItemState {
    enableHomeItem: string;
    loading: boolean;
    error: string | null;
    setEnableHomeItem: (enableHomeItem: string) => void;
    clearEnableHomeItem: () => void;
}

const useEnableHomeItemStore = create<EnableHomeItemState>((set) => ({
    enableHomeItem: '',
    loading: false,
    error: null,

    setEnableHomeItem: (enableHomeItem: string) => set({ enableHomeItem }),
    clearEnableHomeItem: () => set({ enableHomeItem: '' }),
}));

export default useEnableHomeItemStore;