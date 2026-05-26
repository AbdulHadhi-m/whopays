"use client";

export default function HeroBanner() {
  const scrollToSpin = () => {
    document.getElementById("spin-section")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToDice = () => {
    document.getElementById("dice-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 pt-10 pb-8"
      style={{
        background: "linear-gradient(135deg, #6c3bff 0%, #4f28cc 60%, #3a1fa8 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(255,214,0,0.18)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-[-40px] left-[20%] w-52 h-52 rounded-full pointer-events-none"
        style={{ background: "rgba(255,64,129,0.18)", filter: "blur(50px)" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 max-w-5xl mx-auto">
        {/* Left Text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Tag pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
          >
            <span>😄</span>
            <span>Because someone has to pay!</span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-3"
            style={{ color: "#ffffff" }}
          >
            Spin it. Roll it.{" "}
            <span style={{ color: "#ffd600" }}>You pay it!</span> 🤩
          </h1>

          <p className="text-white/80 text-base font-semibold mb-6 max-w-md">
            The fun and fair way to decide who pays the restaurant bill.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
            <button id="hero-spin-btn" onClick={scrollToSpin} className="btn-yellow">
              Start Spinning →
            </button>
            <button
              id="hero-dice-btn"
              onClick={scrollToDice}
              className="btn-secondary"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "2.5px solid rgba(255,255,255,0.5)",
                color: "#fff",
              }}
            >
              Roll Dice 🎲
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {["🧑", "👩", "👨", "🧑‍🦱"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm"
                  style={{ background: "#ede8ff" }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-black text-sm">50,000+ happy groups</p>
              <div className="flex items-center gap-1 text-yellow-300 text-xs font-bold">
                ⭐⭐⭐⭐⭐
                <span className="text-white/70 ml-1">4.9/5 (2.5k reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Floating Mascot Illustration */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative" style={{ animation: "float 4s ease-in-out infinite" }}>
            {/* Big emoji mascot */}
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center text-7xl"
              style={{
                background: "rgba(255,255,255,0.2)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
              }}
            >
              😜
            </div>
            {/* Floating dice badge */}
            <div
              className="absolute -bottom-2 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{
                background: "#ffd600",
                boxShadow: "0 4px 16px rgba(255,214,0,0.5)",
                animation: "float 3s ease-in-out infinite reverse",
              }}
            >
              🎲
            </div>
            {/* Floating star badge */}
            <div
              className="absolute -top-2 -left-4 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: "#ff4081",
                boxShadow: "0 4px 12px rgba(255,64,129,0.5)",
                animation: "float 5s ease-in-out infinite",
              }}
            >
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* How it Works 3-step strip */}
      <div
        className="relative z-10 mt-8 max-w-5xl mx-auto rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
      >
        {[
          {
            icon: "👥",
            color: "#ffd600",
            title: "Add Friends",
            desc: "Invite your friends to the group",
          },
          {
            icon: "🎰",
            color: "#ff4081",
            title: "Spin or Roll",
            desc: "Spin the wheel or roll the dice",
          },
          {
            icon: "💳",
            color: "#00c853",
            title: "Whoever Lands On",
            desc: "That person pays the bill!",
          },
        ].map((step, i) => (
          <div key={i} className="how-step">
            <div
              className="how-step-icon text-2xl"
              style={{ background: step.color }}
            >
              {step.icon}
            </div>
            {i < 2 && (
              <div className="hidden md:block absolute" style={{ right: "-16px", top: "50%" }}>
                →
              </div>
            )}
            <div>
              <p className="text-white font-black text-sm">{step.title}</p>
              <p className="text-white/70 text-xs font-semibold">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
