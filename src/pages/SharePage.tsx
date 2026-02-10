import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import html2canvas from "html2canvas";
import { Download, Camera, X, Sparkles } from "lucide-react";
import { decodeShareData, encodeShareData } from "@/lib/shareData";

// Shorten URL using TinyURL
async function shortenUrl(longUrl: string) {
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    );

    const shortUrl = await response.text();
    return shortUrl;
  } catch (error) {
    console.error("URL shortening failed:", error);
    // fallback -> return original link
    return longUrl;
  }
}

const ShareCaptureTemplate = ({ name, captureRef }: { name: string; captureRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div className="fixed -left-[2000px] top-0 pointer-events-none">
      <div
        ref={captureRef}
        className="w-[1080px] h-[1920px] p-20 flex flex-col items-center justify-center relative overflow-hidden text-center"
        style={{
          background: "linear-gradient(135deg, #fff5f6 0%, #ffe4e8 100%)",
        }}
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-7xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              💖
            </div>
          ))}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-2xl" />
        </div>

        {/* Invitation Card */}
        <div className="bg-white/95 rounded-[120px] p-24 w-full relative z-10 shadow-[0_50px_120px_rgba(0,0,0,0.12)] border-8 border-white">
          <div className="flex justify-center mb-16">
            <div className="p-10 bg-primary/10 rounded-full">
              <Sparkles size={160} className="text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="font-display text-[110px] text-primary mb-12 drop-shadow-sm leading-tight">
            Special Delivery! 🕊️
          </h1>

          <div className="space-y-12 mb-20 px-10">
            <p className="text-[60px] text-muted-foreground font-body">
              Hey someone special, <br />
              I have a surprise for you...
            </p>

            <div className="bg-primary/5 rounded-[70px] p-20 border-4 border-primary/10">
              <p className="text-[90px] font-bold text-primary font-display leading-tight">
                {name}
              </p>
            </div>

            <p className="text-[50px] font-medium text-foreground/80 font-body px-10">
              Wait till you see what's waiting for you at the link! ✨
            </p>
          </div>

          <div className="mt-24 pt-20 border-t-4 border-primary/10">
            <p className="text-[40px] text-muted-foreground/60 font-body">
              Valentine's Day 💝 {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data") || "";
  const decoded = decodeShareData(dataParam);
  const name = decoded?.name || "";
  const msg = decoded?.message || "";
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams({
    data: dataParam || encodeShareData({ name, message: msg }),
  });
  const link = `${window.location.origin}/valentine?${params.toString()}`;
  const [shortLink, setShortLink] = useState(link);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const shortened = await shortenUrl(link);
      if (!cancelled) setShortLink(shortened);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [link]);

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shortLink);
        setCopied(true);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      // Fallback for non-secure contexts or older mobile browsers
      const textArea = document.createElement("textarea");
      textArea.value = shortLink;
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
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Hey ${name}! I have something special for you 💝\n${shortLink}`)}`,
      "_blank"
    );
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(captureRef.current || cardRef.current, {
        backgroundColor: "#fff5f6", // Solid light blush background
        scale: 3,
        logging: false,
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `valentine-for-${name}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Oops! Could not generate image. Try taking a screenshot!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen gradient-romantic flex items-center justify-center p-4 relative overflow-hidden"
    >
      <FloatingHearts />

      <motion.div
        ref={cardRef}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="card-valentine rounded-[2rem] p-8 sm:p-12 max-w-lg w-full text-center relative z-10 shadow-2xl border border-white/50"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          🕊️
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl text-primary text-glow mb-4">
          Link Ready!
        </h1>

        <p className="text-muted-foreground mb-8 text-lg">
          Share this lovely surprise with <br />
          <span className="font-display text-3xl text-primary font-bold">{name}</span>
        </p>

        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-6 break-all text-sm text-primary/80 font-mono border border-white/50 shadow-inner">
          {shortLink}
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="w-full py-4 rounded-xl gradient-button text-white font-bold text-lg
              shadow-lg shadow-primary/30 transition-all border border-white/20"
          >
            {copied ? "কপি হয়ে গেছে ✅" : "লিংক কপি করো 📋"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            হোয়াটসঅ্যাপে পাঠাও 💚
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadImage}
              className="py-3 rounded-xl bg-white text-primary font-bold border border-primary/20
                  hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Download size={18} /> Save Image
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGuide(true)}
              className="py-3 rounded-xl bg-white text-primary font-bold border border-primary/20
                  hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Camera size={18} /> Screenshot?
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/valentine?${params.toString()}`)}
            className="w-full py-3 rounded-xl bg-white/60 text-primary font-bold border border-white/60
              hover:bg-white/80 transition-all mt-2"
          >
            Preview 👀
          </motion.button>
        </div>
      </motion.div>

      <ShareCaptureTemplate name={name} captureRef={captureRef} />

      {/* Screenshot Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>

              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Camera size={24} /> Best Screenshot
              </h3>

              <ol className="list-decimal list-inside space-y-3 text-left text-foreground/80">
                <li>Open this link on your phone 📱</li>
                <li>Wait for the floating hearts ✨</li>
                <li>Press <span className="font-bold">Power + Volume Down</span> (Android) or <span className="font-bold">Power + Volume Up</span> (iPhone)</li>
                <li>Share to your Story! 📸</li>
              </ol>

              <div className="mt-6 p-3 bg-muted rounded-xl text-xs text-center text-muted-foreground">
                Tip: The "Save Image" button above also creates a clean image for you!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SharePage;
