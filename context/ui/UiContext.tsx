import { createContext } from 'react';

interface ContextProps {
    isMenuOpen: boolean;

    //Method
    toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);