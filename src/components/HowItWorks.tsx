
import { User, Brain, Network } from "lucide-react";

const HowItWorks = () => (
  <section className="max-w-5xl mx-auto px-6 py-12 mb-10 bg-white/5 border-white/10 rounded-2xl backdrop-blur-xl shadow-lg glass-morphism animate-fade-in">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-300 text-center">How It Works</h2>
    <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10">
      {/* Simple visual diagram */}
      <div className="flex-1 flex flex-col items-center mb-8 lg:mb-0">
        <div className="relative flex items-center justify-center my-3">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-28 h-28 rounded-full flex items-center justify-center shadow-2xl">
            <Brain className="w-12 h-12 text-white drop-shadow" />
          </div>
          <span className="absolute -bottom-3 text-xs uppercase text-white/60 font-medium">Scan2Verse AI</span>
        </div>
        <div className="flex items-center gap-6 mt-7">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-yellow-300 to-amber-400 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-2">
              <User className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-white/70">You</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-green-300 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-2">
              <Network className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-white/70">Apps & Agents</span>
          </div>
        </div>
      </div>
      {/* Steps */}
      <div className="flex-1">
        <ol className="list-decimal text-lg text-white/80 space-y-3 mx-6">
          <li>
            <span className="font-semibold text-cyan-400">You</span> interact via <span className="font-semibold text-fuchsia-400">app</span> or <span className="font-semibold text-green-300">web</span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Scan2Verse AI</span> processes your request & context in real time
          </li>
          <li>
            Seamless connection to <span className="font-semibold text-yellow-300">Apps</span> and <span className="font-semibold text-emerald-400">Live Agents</span>
          </li>
          <li>
            <span className="font-semibold text-white">Instant answers, action & guidance</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
);

export default HowItWorks;
