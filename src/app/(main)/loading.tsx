export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#07050f] p-4 text-center">
      <div className="relative">
        {/* Neon Pulsing Shadow Glow */}
        <div className="absolute inset-0 rounded-full bg-neon-purple/20 blur-xl scale-125 animate-pulse" />
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
      <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple mt-6 tracking-wider animate-pulse">
        WHOPAYS
      </h2>
      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">
        Loading Neon Grid...
      </p>
    </div>
  );
}
