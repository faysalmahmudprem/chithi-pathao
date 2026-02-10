import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
    x: number;
    y: number;
    id: number;
}

const HeartCursor = () => {
    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
            setPoints((prev) => [...prev.slice(-15), newPoint]); // Keep last 15 points
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Clean up old points
    useEffect(() => {
        const interval = setInterval(() => {
            setPoints((prev) => prev.filter((p) => Date.now() - p.id < 800));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {points.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 0.8, scale: 0.5, y: 0 }}
                        animate={{ opacity: 0, scale: 0, y: -20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            left: point.x,
                            top: point.y,
                            transform: 'translate(-50%, -50%)',
                        }}
                        className="text-primary text-xl"
                    >
                        ❤️
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HeartCursor;
