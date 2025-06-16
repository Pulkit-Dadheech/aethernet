'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState("");
    
    return (
        <SidebarContext.Provider value={{ activeSection, setActiveSection }}>
        {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = (activeSectionName) => {
    const context = useContext(SidebarContext);
    const { setActiveSection } = context;
    useEffect(() => {
        if (activeSectionName) {
          setActiveSection(activeSectionName);
        }
    }, [activeSectionName, setActiveSection]);

    return context;
}
