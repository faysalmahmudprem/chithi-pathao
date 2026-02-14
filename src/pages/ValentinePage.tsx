import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import ValentineResult from "@/components/ValentineResult";
import AudioPlayer from "@/components/AudioPlayer";
import { playHappySound, playWhooshSound } from "@/lib/sounds";
import { decodeShareData } from "@/lib/shareData";

const CAT_ASKING_GIF = "/media/asking.gif";

const PHRASES = [
  "No",
  "মনটা ভেঙে দিচ্ছ!",
  "এটা ঠিক না!",
  "আমি কিন্তু কাঁদবো!",
  "শেষ সুযোগ কিন্তু!",
  "তোমার কি মায়া নেই?",
];

const ENGLISH_POEMS = [
  "Roses are red,\nViolets are blue,\nMy life is beautiful,\nBecause of you.",
  "In your smile I see something more beautiful than the stars.",
  "I love you not only for what you are,\nbut for what I am when I am with you.",
  "If I had a flower for every time I thought of you,\nI could walk through my garden forever.",
  "You are my heart, my life, my one and only thought.",
  "Thinking of you keeps me awake. Dreaming of you keeps me asleep. Being with you keeps me alive.",
  "I seem to have loved you in numberless forms, numberless times, in life after life, in age after age forever."
];

const ValentinePage = () => {
  const [searchParams] = useSearchParams();
  const dParam = searchParams.get("d") || "";
  const decoded = decodeShareData(dParam);
  const fallbackName = searchParams.get("to") || "Someone Special";
  const fallbackMessage = searchParams.get("msg") || "";
  const recipientName = decoded?.name || fallbackName;
  const customMessage = decoded?.message || fallbackMessage;
  const [answer, setAnswer] = useState<"yes" | "no" | "heartbreak" | null>(null);
  const [noCount, setNoCount] = useState(0);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio state
  const [playAudio, setPlayAudio] = useState(false);
  const [audioType, setAudioType] = useState<"happy" | "sad" | "heartbreak" | null>(null);

  // Stats tracking
  useEffect(() => {
    const views = parseInt(localStorage.getItem("valentine_views") || "0");
    localStorage.setItem("valentine_views", (views + 1).toString());
  }, []);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "message_viewed");
    }
  }, []);

  // Yes button scale logic (adds 0.15 each time, caps at 2.5)
  const yesScale = Math.min(1 + noCount * 0.15, 2.5);

  const getNoText = () => {
    if (noCount === 0) return "No";
    if (noCount > 15) return "Why? :(";
    return PHRASES[Math.min(noCount, PHRASES.length - 1)];
  };

  const moveButton = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Calculate bounds based on container size to stay on screen
    const btnWidth = 100; // Approximate
    const btnHeight = 50; // Approximate

    // We want it to move within the container bounds
    const maxX = (container.offsetWidth - btnWidth) / 2;
    const maxY = (container.offsetHeight - btnHeight) / 2;

    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;

    setPosition({ x: newX, y: newY });
  };

  const handleNoInteraction = () => {
    moveButton();
    playWhooshSound();
    setNoCount(c => c + 1);

    const noClicks = parseInt(localStorage.getItem("valentine_no_clicks") || "0");
    localStorage.setItem("valentine_no_clicks", (noClicks + 1).toString());

    // After 5 clicks, trigger heartbreak
    if (noCount + 1 >= 5) {
      setTimeout(() => {
        setAnswer("heartbreak");
        setAudioType("heartbreak");
        setPlayAudio(true);
      }, 500);
    }
  };

  const handleYes = () => {
    setAnswer("yes");
    setAudioType("happy");
    setPlayAudio(true);
    playHappySound();

    const yesClicks = parseInt(localStorage.getItem("valentine_yes_clicks") || "0");
    localStorage.setItem("valentine_yes_clicks", (yesClicks + 1).toString());
  };

  // Result screen
  if (answer) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ValentineResult answer={answer} name={recipientName} message={customMessage} />

          <AudioPlayer shouldPlay={playAudio} type={audioType} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const showGiveUp = noCount >= 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen gradient-romantic flex items-center justify-center p-4 relative overflow-hidden"
    >
      <FloatingHearts />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="card-valentine rounded-[2rem] p-8 sm:p-12 max-w-lg w-full text-center relative z-10 shadow-2xl border border-white/50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="mb-10 w-full"
        >
          <h1 className="font-display text-4xl sm:text-6xl text-primary text-glow mb-2 break-words leading-tight drop-shadow-sm">
            এই {recipientName} 💝
          </h1>

          <div className="text-xl sm:text-2xl font-body font-bold text-foreground/80 mt-4 mb-6">
            আমার সাথে বুড়ো হবে?
          </div>

          <div className="my-8 relative group">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              src={CAT_ASKING_GIF}
              alt="Cute cat asking"
              className="w-56 h-56 object-cover rounded-3xl mx-auto shadow-2xl shadow-primary/20 border-4 border-white"
              onLoad={() => setGifLoaded(true)}
            />
            {!gifLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-3xl">
                <span className="loading-dots">🐱</span>
              </div>
            )}
          </div>

          {customMessage && (
            <p className="mt-4 text-lg italic opacity-80 max-w-xs mx-auto font-body text-muted-foreground">
              "{customMessage}"
            </p>
          )}
        </motion.div>

        {/* Buttons Container - Fixed height */}
        <div ref={containerRef} className="relative w-full h-[250px] flex items-center justify-center">
          {/* YES BUTTON */}
          <motion.button
            onClick={handleYes}
            animate={{ scale: yesScale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute z-20 px-12 py-4 rounded-[50px] font-bold text-xl cursor-pointer gradient-button text-white shadow-lg shadow-primary/30"
            style={{
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
            }}
          >
            Yes! 💕
          </motion.button>

          {/* NO BUTTON */}
          <motion.button
            onMouseEnter={moveButton}
            onClick={handleNoInteraction}
            animate={{
              x: position.x,
              y: position.y
            }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
            className="absolute z-10 px-12 py-4 rounded-[50px] font-bold text-xl cursor-pointer bg-white/80 text-muted-foreground border border-white/50 shadow-md hover:bg-white"
            style={{
              top: '50%',
              left: '50%',
              marginTop: noCount === 0 ? '80px' : '0px'
            }}
          >
            {getNoText()}
          </motion.button>
        </div>

        <div className="mt-4 font-semibold text-lg h-8 text-valentine-rose">
          {noCount >= 2 && noCount < 4 && "😊"}
          {noCount >= 4 && noCount < 5 && "থেকে যাও না একটু! 😄"}
        </div>

        {showGiveUp && (
          <motion.button
            onClick={handleYes}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 px-8 py-3 rounded-[50px] font-bold text-lg animate-pulse gradient-button text-white shadow-lg"
          >
            {recipientName} কিছুক্ষন থেকে যাও, যেওনা এখনি! 😊
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ValentinePage;
