import React, { useEffect, useRef } from "react";

interface AudioPlayerProps {
    shouldPlay: boolean;
    type: "happy" | "sad" | "heartbreak" | null;
}

const AudioPlayer = ({ shouldPlay, type }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (shouldPlay && type && audioRef.current) {
            // Pause any currently playing audio
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            if (type === "happy") {
                // User needs to add 'perfect.mp3' to public/songs/ folder
                audioRef.current.src = "/songs/perfect.mp3";
            } else if (type as string === "heartbreak") {
                // Opradhi for heartbreak
                audioRef.current.src = "/songs/opradhi.mp3";
            }

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play failed (user interaction usually required first):", error);
                });
            }
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [shouldPlay, type]);

    return <audio ref={audioRef} className="hidden" loop />;
};

export default AudioPlayer;
