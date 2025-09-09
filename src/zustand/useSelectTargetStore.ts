import { create } from 'zustand';

interface SelectTargetState {
    selectTarget: string;
    loading: boolean;
    error: string | null;
    setSelectTarget: (selectTarget: string) => void;
    clearSelectTarget: () => void;
}

const useSelectTargetStore = create<SelectTargetState>((set) => ({
    selectTarget: '',
    loading: false,
    error: null,

    setSelectTarget: (selectTarget: string) => set({ selectTarget }),
    clearSelectTarget: () => set({ selectTarget: '' }),
}));

export default useSelectTargetStore;