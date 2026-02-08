import { Trophy } from "lucide-react";

export default function GameStart({
    setGameStarted,
}: {
    setGameStarted: (value: boolean) => void;
}) {
    return (
        <div className="relative h-screen overflow-hidden bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 flex items-center justify-center px-4">

            {/* Floating hearts background */}
            <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-10 left-10 text-2xl animate-pulse">💖</span>
                <span className="absolute top-1/3 right-12 text-xl animate-bounce">💕</span>
                <span className="absolute bottom-20 left-16 text-xl animate-pulse">💗</span>
                <span className="absolute bottom-32 right-20 text-2xl animate-bounce">💘</span>
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-md sm:max-w-xl text-center backdrop-blur-xl bg-white/15 border border-white/20 rounded-3xl px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

                {/* Trophy */}
                <div className="mb-3">
                    <Trophy
                        className="mx-auto text-yellow-300 drop-shadow-lg animate-bounce"
                        size={52}
                    />
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow">
                    <span className="inline-block animate-bounce">💕</span>{" "}
                    Love Quest{" "}
                    <span className="inline-block animate-bounce">💕</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-lg text-white/90 mb-4">
                    Epic Adventure for My Valentine
                </p>

                {/* How to play */}
                <div className="bg-pink-500/30 rounded-2xl px-4 py-3 mb-4 text-white">
                    <h2 className="text-sm sm:text-lg font-bold mb-2">
                        How to Play
                    </h2>

                    <ul className="space-y-1 text-[11px] sm:text-sm md:text-base">
                        <li>🎮 Desktop: Arrow Keys / WASD</li>
                        <li>📱 Mobile: Swipe or Tap</li>
                        <li>💖 Collect love messages</li>
                        <li>🚫 Avoid obstacles</li>
                        <li>👾 Beware of villains</li>
                        <li>❤️ Only 3 lives</li>
                        <li>⚡ Finish fast for bonus</li>
                        <li>
                            🏆 <span className="font-bold text-yellow-300">8 Levels</span>
                        </li>
                    </ul>

                    {/* Difficulty */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                        <div className="bg-green-500/40 rounded-xl p-2">
                            <div className="font-bold">Easy</div>
                            <div>Lv 1–2</div>
                        </div>
                        <div className="bg-yellow-500/40 rounded-xl p-2">
                            <div className="font-bold">Medium</div>
                            <div>Lv 3–5</div>
                        </div>
                        <div className="bg-orange-500/40 rounded-xl p-2">
                            <div className="font-bold">Hard</div>
                            <div>Lv 6–7</div>
                        </div>
                        <div className="bg-red-500/40 rounded-xl p-2">
                            <div className="font-bold">Expert</div>
                            <div>Lv 8</div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => setGameStarted(true)}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-pink-600 rounded-full text-sm sm:text-lg font-bold shadow-[0_0_30px_rgba(255,20,147,0.8)]
hover:shadow-[0_0_60px_rgba(255,20,147,1)]
hover:scale-110 
transition-all duration-300"        >
                    Start Epic Journey 💝
                </button>
            </div>
        </div>
    );
}
