import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "classic" | "dark" | "cute" | "elegant";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("valentine-theme") as Theme) || "classic";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("classic", "dark", "cute", "elegant");
        root.classList.add(theme);
        localStorage.setItem("valentine-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
