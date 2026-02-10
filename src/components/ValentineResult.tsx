import { useState, useRef, useEffect } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import html2canvas from "html2canvas";
import { Download, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROSE_GIF = "/media/rose.gif";
const CAT_CRYING_GIF = "/media/crying.gif";

interface ValentineResultProps {
  answer: "yes" | "no" | "heartbreak";
  name: string;
  message?: string;
}

const ResultCaptureTemplate = ({ answer, name, message, captureRef }: ValentineResultProps & { captureRef: React.RefObject<HTMLDivElement> }) => {
  const isHeartbreak = answer === "heartbreak" || answer === "no";
  const poem = isHeartbreak ? `"তোমার এলাকা ছাইড়া যাচ্ছি; তোমারে ছাড়ার ফিলিংস্ হচ্ছে, হোক – আমি অনেক-কিছুই-ছাইড়া-আসা-লোক !"` : "";

  return (
    <div className="fixed -left-[2000px] top-0 pointer-events-none">
      <div
        ref={captureRef}
        className="w-[1080px] h-[1920px] p-20 flex flex-col items-center justify-center relative overflow-hidden text-center"
        style={{
          background: "linear-gradient(135deg, #fff5f6 0%, #ffe4e8 100%)",
        }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {isHeartbreak ? "💔" : "💖"}
            </div>
          ))}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
        </div>

        {/* Content Card */}
        <div className="bg-white/90 rounded-[100px] p-24 w-full relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-8 border-white">
          <div className="text-[200px] mb-16 animate-bounce">
            {answer === "yes" ? "💝" : "🥀"}
          </div>

          <h1 className="font-display text-[140px] text-primary mb-16 drop-shadow-sm leading-tight">
            {answer === "yes" ? "She said YES! 💝" : answer === "heartbreak" ? "Heartbroken... 💔" : "She said No... 😿"}
          </h1>

          <div className="space-y-16 mb-20 px-10">
            {isHeartbreak && (
              <div className="bg-[#fce4e4] rounded-[60px] p-16 border-4 border-[#f8d7da]">
                <p className="text-[54px] font-bold text-[#721c24] font-body leading-relaxed italic">
                  {poem}
                </p>
                <p className="text-[36px] text-[#e1306c] font-bold mt-8">— মারজুক রাসেল</p>
              </div>
            )}

            {!isHeartbreak && !message && (
              <div className="bg-primary/5 rounded-[60px] p-16 border-4 border-primary/10">
                <p className="text-[58px] font-semibold text-foreground italic font-display leading-relaxed">
                  "I seek a warmest place,<br />That's your heart..." 💖
                </p>
              </div>
            )}

            {message && (
              <div className="bg-secondary/20 rounded-[80px] p-20 border-4 border-primary/5">
                <p className="text-[64px] font-bold text-foreground italic font-display leading-snug">
                  "{message}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-24 pt-20 border-t-4 border-primary/10">
            <p className="text-[40px] text-muted-foreground/60 font-body">
              Created with ❤️ by <span className="font-bold text-primary/70">Faysal Mahmud Prem</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareButtons = ({ text, cardRef, captureRef, onShowGuide }: { text: string; cardRef: React.RefObject<HTMLDivElement>; captureRef?: React.RefObject<HTMLDivElement>; onShowGuide: () => void }) => {
  const url = window.location.href;
  const encoded = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `${text} ${url}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = fullText;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (copyErr) {
        console.error("Fallback copy failed", copyErr);
      }
      document.body.removeChild(textArea);
    }
    setTimeout(() => setCopied(false), 2000);
    window.open(`https://www.instagram.com/`, "_blank");
  };

  const handleDownloadImage = async () => {
    const target = captureRef?.current || cardRef.current;
    if (!target) return;
    try {
      const canvas = await html2canvas(target, {
        backgroundColor: "#fff5f6",
        scale: 3,
        logging: false,
        useCORS: true
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `valentine-result.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  return (
    <div className="space-y-6 w-full mt-8 pt-6 border-t border-primary/10">
      <div className="space-y-1">
        <h3 className="font-display text-2xl text-primary font-bold">Share as a Story! 📸</h3>
        <p className="text-xs text-muted-foreground font-medium">Save your result and show it to the world! ✨</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href={`https://wa.me/?text=${encoded}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[120px] py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white" }}
        >
          WhatsApp 💚
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 min-w-[120px] py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #E1306C, #833AB4, #F77737)", color: "white" }}
        >
          {copied ? "Copied! ✨" : "Instagram 📸"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadImage}
          className="py-4 rounded-2xl bg-primary text-white font-bold border-none shadow-lg shadow-primary/25 transition-all flex flex-col items-center justify-center gap-1 text-sm"
        >
          <Download size={20} />
          <span>Save Result</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowGuide}
          className="py-4 rounded-2xl bg-white text-primary font-bold border border-primary/20 shadow-sm transition-all flex flex-col items-center justify-center gap-1 text-sm"
        >
          <Camera size={20} />
          <span>How to Share?</span>
        </motion.button>
      </div>
    </div>
  );
};

const ValentineResult = ({ answer, name, message }: ValentineResultProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  if (answer === "yes") {
    return (
      <div className="min-h-screen gradient-romantic flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <FloatingHearts />
        <Confetti />

        <div ref={cardRef} className="card-valentine rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative z-10 animate-fade-in-up">
          <div className="text-8xl animate-heartbeat mb-4">❤️</div>
          <h1 className="font-display text-4xl sm:text-5xl text-primary text-glow mb-4">
            Yay! 🎉
          </h1>
          <p className="text-xl font-bold text-foreground mb-4 font-body">
            ইয়েস {name}! আমি জানতাম! 🎉
          </p>

          <div className="bg-secondary/50 rounded-2xl p-6 mb-6 border border-primary/10 space-y-3">
            <p className="text-lg font-semibold text-foreground italic font-display leading-relaxed">
              "I seek a warmest place,"
            </p>
            <p className="text-lg font-semibold text-foreground italic font-display leading-relaxed">
              "That's your heart..."
            </p>
            <p className="text-lg font-semibold text-foreground italic font-display leading-relaxed">
              "Little little dreams I have,"
            </p>
            <p className="text-lg font-semibold text-foreground italic font-display leading-relaxed">
              "Do I have your permission to let them breathe? 💕"
            </p>
          </div>

          {message && (
            <div className="bg-secondary/30 rounded-2xl p-5 mb-6 border border-primary/10">
              <p className="text-sm text-muted-foreground mb-1 font-body">A message for you:</p>
              <p className="text-lg font-semibold text-foreground italic font-display">
                "{message}"
              </p>
            </div>
          )}

          <div className="my-6">
            <img
              src={ROSE_GIF}
              alt="Beautiful rose"
              className="w-56 h-56 object-cover rounded-2xl mx-auto shadow-lg shadow-primary/20 border-4 border-white"
            />
          </div>

          <p className="text-lg text-muted-foreground font-medium font-body">
            পৃথিবীর সমস্ত ফুল আজ তোমার জন্য! 💖🌹💕
          </p>

          <ShareButtons
            text={`${name} said YES to being my Valentine! 💝🎉`}
            cardRef={cardRef}
            captureRef={captureRef}
            onShowGuide={() => setShowGuide(true)}
          />
        </div>

        <ResultCaptureTemplate answer={answer} name={name} message={message} captureRef={captureRef} />

        <footer className="mt-8 text-sm text-muted-foreground/60 relative z-10 font-body">
          Made with ❤️ by <a href="https://bio.link/faysalmahmudprem" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Faysal Mahmud Prem</a>
        </footer>

        <ScreenshotGuide show={showGuide} onClose={() => setShowGuide(false)} />
      </div>
    );
  }

  if (answer === "heartbreak") {
    return (
      <div className="min-h-screen gradient-romantic flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/5">
        <FloatingHearts />

        <div ref={cardRef} className="card-valentine rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative z-10 animate-fade-in-up">
          <div className="text-8xl mb-4">💔🥀</div>
          <h1 className="font-display text-4xl sm:text-5xl text-primary text-glow mb-4">
            Heartbroken...
          </h1>

          <div className="bg-[#fce4e4] border border-[#f8d7da] rounded-2xl p-6 mb-6 space-y-4 shadow-sm">
            <p className="text-xl font-bold text-[#721c24] font-body leading-relaxed italic">
              "তোমার এলাকা ছাইড়া যাচ্ছি; তোমারে ছাড়ার ফিলিংস্ হচ্ছে, হোক – আমি অনেক-কিছুই-ছাইড়া-আসা-লোক !"
            </p>
            <p className="text-sm text-[#e1306c] font-body font-bold">
              — মারজুক রাসেল
            </p>
          </div>

          <div className="my-6">
            <img
              src="/media/special-no/heartbreak.gif"
              alt="Heartbreak"
              onError={(e) => {
                // If special gif doesn't exist, fallback to crying cat
                (e.target as HTMLImageElement).src = CAT_CRYING_GIF;
              }}
              className="w-56 h-56 object-cover rounded-2xl mx-auto shadow-lg shadow-primary/20 border-4 border-white"
            />
          </div>

          <p className="text-lg text-muted-foreground font-medium font-body mb-6">
            The music is playing your pain... 🎶
          </p>

          <ShareButtons
            text={`I broke someone's heart today... 💔🥀`}
            cardRef={cardRef}
            captureRef={captureRef}
            onShowGuide={() => setShowGuide(true)}
          />
        </div>

        <ResultCaptureTemplate answer={answer} name={name} message={message} captureRef={captureRef} />

        <footer className="mt-8 text-sm text-muted-foreground/60 relative z-10 font-body">
          Made with 💔 by <a href="https://bio.link/faysalmahmudprem" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Faysal Mahmud Prem</a>
        </footer>

        <ScreenshotGuide show={showGuide} onClose={() => setShowGuide(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-romantic flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      <div ref={cardRef} className="card-valentine rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative z-10 animate-fade-in-up">
        <div className="text-7xl mb-4">💔😿</div>
        <h1 className="font-display text-4xl sm:text-5xl text-primary text-glow mb-4">
          She said No... 😿
        </h1>
        <div className="bg-[#fce4e4] border border-[#f8d7da] rounded-2xl p-6 mb-6 space-y-4 shadow-sm">
          <p className="text-xl font-bold text-[#721c24] font-body leading-relaxed italic">
            "তোমার এলাকা ছাইড়া যাচ্ছি; তোমারে ছাড়ার ফিলিংস্ হচ্ছে, হোক – আমি অনেক-কিছুই-ছাইড়া-আসা-লোক !"
          </p>
          <p className="text-sm text-[#e1306c] font-body font-bold">
            — মারজুক রাসেল
          </p>
        </div>

        <div className="my-6">
          <img
            src={CAT_CRYING_GIF}
            alt="Crying cat"
            className="w-56 h-56 object-cover rounded-2xl mx-auto shadow-lg shadow-primary/20 border-4 border-white"
          />
        </div>

        <p className="text-lg text-muted-foreground font-medium font-body mb-6">
          The music is playing your pain... 🎶
        </p>

        <ShareButtons
          text={`My Valentine rejected me... 💔😿`}
          cardRef={cardRef}
          captureRef={captureRef}
          onShowGuide={() => setShowGuide(true)}
        />
      </div>

      <ResultCaptureTemplate answer={answer} name={name} message={message} captureRef={captureRef} />

      <footer className="mt-8 text-sm text-muted-foreground/60 relative z-10 font-body">
        Made with 💔 by <a href="https://bio.link/faysalmahmudprem" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Faysal Mahmud Prem</a>
      </footer>

      <ScreenshotGuide show={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

const ScreenshotGuide = ({ show, onClose }: { show: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full relative shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 font-body">
            <Camera size={24} /> Capture the Moment
          </h3>

          <ul className="space-y-4 text-left text-foreground/80 font-body">
            <li className="flex gap-3 items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span>Wait for the hearts and confetti to settle ✨</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span>Take a screenshot with your phone! 📱</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span>Share it on your Story with a heart ❤️</span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-primary/5 rounded-2xl text-[10px] text-center text-primary/80 font-medium">
            Pro Tip: You can also use the "Result Image" button to save a high-quality version instantly!
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ValentineResult;
