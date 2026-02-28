
import { ChartBar, Brain, Heart, Briefcase, TrendingUp, Calendar } from "lucide-react";

const DashboardPreview = () => (
  <section className="max-w-7xl mx-auto px-6 py-16">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Your Unified Dashboard Preview</h2>
      <p className="text-xl text-white/70">All your apps, all your data, one intelligent interface</p>
    </div>

    {/* Mock Dashboard Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Scan3Eat Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <ChartBar className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">Scan3Eat</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Today's Calories</span>
            <span className="text-cyan-400 font-semibold">1,847 / 2,200</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Protein</span>
            <span className="text-green-400 font-semibold">89g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Last Scan</span>
            <span className="text-white/90">2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Scan2Mind Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">Scan2Mind</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Mood Score</span>
            <span className="text-fuchsia-400 font-semibold">8.2/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Sessions This Week</span>
            <span className="text-purple-400 font-semibold">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Streak</span>
            <span className="text-white/90">12 days</span>
          </div>
        </div>
      </div>

      {/* Fitness Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">Fitness</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Steps Today</span>
            <span className="text-green-400 font-semibold">8,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Workouts This Week</span>
            <span className="text-emerald-400 font-semibold">4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Active Minutes</span>
            <span className="text-white/90">142 min</span>
          </div>
        </div>
      </div>

      {/* Jobs Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">Jobs</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Applications</span>
            <span className="text-yellow-400 font-semibold">12 Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Interviews</span>
            <span className="text-orange-400 font-semibold">3 Scheduled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Skills Progress</span>
            <span className="text-white/90">78%</span>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">AI Insights</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-white/70">
            Your mood improves 23% on workout days
          </div>
          <div className="text-white/70">
            Best productivity: Tuesdays after 10am
          </div>
          <div className="text-white/70">
            Protein intake correlates with better sleep
          </div>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-white">Today's Plan</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-white/70">• Morning workout (7am)</div>
          <div className="text-white/70">• Job interview prep (2pm)</div>
          <div className="text-white/70">• Mindfulness session (8pm)</div>
        </div>
      </div>
    </div>

    {/* Call to Action for Investors */}
    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-4 text-cyan-300">Ready to Invest in the Future?</h3>
      <p className="text-white/70 mb-6 max-w-2xl mx-auto">
        This unified AI ecosystem represents a $50B+ market opportunity. Be part of the revolution 
        that connects human data, AI intelligence, and real-world applications.
      </p>
      <a 
        href="mailto:founders@scan2verse.com" 
        className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 hover:scale-105"
      >
        Contact for Investment Opportunities
      </a>
    </div>
  </section>
);

export default DashboardPreview;
