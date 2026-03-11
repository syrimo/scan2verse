
import { ChartBar, Brain, Network, Settings, User, MessageCircle } from "lucide-react";

const solutions = [
  {
    name: "scan3eat",
    icon: ChartBar,
    desc: "Track food, calories & nutrition effortlessly. AI-powered and automatic.",
    color: "from-cyan-300 to-blue-400",
  },
  {
    name: "scan2mind",
    icon: Brain,
    desc: "Your real-time mental health assistant. Listen, advise, support.",
    color: "from-fuchsia-400 to-purple-500",
  },
  {
    name: "Fitness",
    icon: User,
    desc: "Personal AI fitness guidance. Connects to wearables & routines.",
    color: "from-green-300 to-emerald-500",
  },
  {
    name: "Jobs",
    icon: Network,
    desc: "AI-powered job search, upskilling, and human networking.",
    color: "from-amber-300 to-orange-400",
  },
  {
    name: "Live Coaching",
    icon: MessageCircle,
    desc: "Real human & AI coaches for anything life throws your way.",
    color: "from-cyan-300 to-purple-500",
  },
  {
    name: "Custom Agents",
    icon: Settings,
    desc: "Personalized AIs trained for your unique tasks—securely.",
    color: "from-purple-400 to-blue-500",
  },
];

const Ecosystem = () => (
  <section className="max-w-6xl mx-auto py-10 mb-10">
    <h2 className="text-2xl md:text-3xl font-bold mb-7 text-center text-cyan-300">Ecosystem: One Verse, Many Worlds</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {solutions.map((s) => (
        <div
          key={s.name}
          className={`rounded-xl p-6 glass-morphism bg-gradient-to-br ${s.color} shadow-xl flex flex-col items-center text-center animate-scale-in hover-scale transition`}
        >
          <span className="w-14 h-14 flex items-center justify-center rounded-full mb-3 bg-white/10 backdrop-blur">
            <s.icon className="w-8 h-8 text-white drop-shadow" />
          </span>
          <h3 className="font-bold text-xl mb-2 uppercase tracking-wide">{s.name}</h3>
          <p className="text-md text-white/90">{s.desc}</p>
          <a
            href={s.name === 'scan3eat' ? '/dashboard?tab=scan2eat' : s.name === 'scan2mind' ? '/dashboard?tab=scan2mind' : '#'}
            className={`mt-4 text-sm px-4 py-2 rounded-full border backdrop-blur-sm transition hover-scale ${
              s.name === 'scan3eat' || s.name === 'scan2mind'
                ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                : 'bg-white/10 border-white/20 text-cyan-50 hover:bg-white/20'
            }`}
            tabIndex={s.name === 'scan3eat' || s.name === 'scan2mind' ? 0 : -1}
            aria-disabled={s.name !== 'scan3eat' && s.name !== 'scan2mind'}
          >
            {s.name === 'scan3eat' || s.name === 'scan2mind' ? 'Open Dashboard' : 'Coming Soon'}
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Ecosystem;
