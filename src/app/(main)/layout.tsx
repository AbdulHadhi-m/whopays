import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col relative min-h-screen">
      {/* Decorative Casino Neon Cyber Backdrop Grid Grid */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <main className="flex-1 flex flex-col relative z-10">{children}</main>
    </div>
  );
}
