import { useTheme } from "./ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Palette } from "lucide-react";

const THEMES = [
    { id: "classic", label: "Classic", color: "bg-[#ff4d6d]" },
    { id: "dark", label: "Dark", color: "bg-[#2a0a12]" },
    { id: "cute", label: "Cute", color: "bg-[#bae6fd]" },
    { id: "elegant", label: "Elegant", color: "bg-[#f5e6d3]" },
] as const;

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-50">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md border-2 border-primary/20 text-primary"
            >
                <Palette size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        className="absolute top-14 right-0 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-primary/10 flex flex-col gap-2 min-w-[120px]"
                    >
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${theme === t.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border border-gray-300 ${t.color}`} />
                                <span className="text-sm">{t.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeToggle;
