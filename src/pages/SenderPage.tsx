import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import { encodeShareData } from "@/lib/shareData";

const SenderPage = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!name.trim()) return;
    const params = new URLSearchParams({
      data: encodeShareData({
        name: name.trim(),
        message: message.trim(),
      }),
    });
    navigate(`/share?${params.toString()}`);
  };

  const getCountdown = () => {
    const now = new Date();
    const valentine = new Date(now.getFullYear(), 1, 14); // Feb 14
    if (now > valentine) valentine.setFullYear(valentine.getFullYear() + 1);
    const diff = valentine.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

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
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl mb-4"
        >
          💝
        </motion.div>
        <h1 className="font-display text-5xl sm:text-6xl text-primary text-glow mb-2">
          Valentine's Day
        </h1>

        <div className="flex justify-center gap-3 my-6">
          {[
            { val: countdown.days, label: "Days" },
            { val: countdown.hours, label: "Hrs" },
            { val: countdown.minutes, label: "Min" },
            { val: countdown.seconds, label: "Sec" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/40 backdrop-blur-sm rounded-2xl px-3 py-3 min-w-[64px] border border-white/60 shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">{item.val}</div>
              <div className="text-[10px] text-primary/80 font-bold uppercase tracking-wider">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <p className="text-muted-foreground mb-8 font-medium">
          তোমাকে ছাড়া এই বসন্ত কিভাবে কাটাই বলো তো! 🥺✨
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-left text-sm font-bold text-primary/80 ml-1">
              তাহার সুন্দর নামটি কি বলো তো ?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="বলো না নামটা..."
              maxLength={30}
              className="w-full px-6 py-4 rounded-2xl border-2 border-primary/10 bg-white/50 text-foreground text-center text-xl font-medium
                focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-left text-sm font-bold text-primary/80 ml-1">
              শতবার চেয়েও যা বলতে পারো না <span className="text-muted-foreground/60 font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আজ বলে ফেলো তো..."
              maxLength={200}
              rows={3}
              className="w-full px-5 py-4 rounded-2xl border-2 border-primary/10 bg-white/50 text-foreground text-base
                focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {["পৃথিবীটা আধুনিক হোক, আমি বরং তোমার কাছে সেই পুরোনো আমলের চিঠির মতোই থেকে যাই।", " একসাথে স্যান্তোরিনি যাব, যাবে?", "সমুদ্র দেখতে যাবে?", "বসন্তে ঘুরতে যাবে?"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMessage(preset)}
                  className="px-3 py-1.5 rounded-full bg-white/60 text-primary text-xs font-bold border border-white/60
                    hover:bg-primary hover:text-white transition-all transform hover:scale-105"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl gradient-button text-white font-bold text-xl
              shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            চিঠিটা পাঠিয়ে দাও 🪄
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SenderPage;
