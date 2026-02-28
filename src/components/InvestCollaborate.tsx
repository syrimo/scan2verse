
const InvestCollaborate = () => (
  <section id="invest" className="max-w-6xl mx-auto px-6 py-16 my-12 flex flex-col md:flex-row gap-8 animate-fade-in">
    <div className="glass-morphism bg-brand-primary/10 border-brand-primary/20 rounded-2xl p-8 shadow-xl flex-1">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-brand-primary">For Investors</h2>
      <ul className="list-disc ml-5 text-foreground space-y-2 mb-5">
        <li>Access to a next-gen, AI-driven ecosystem—first of its kind</li>
        <li>Rapidly growing verticals: food, wellness, mental health, work, fitness</li>
        <li>Tech with both <span className="font-semibold text-brand-primary">real-world</span> & <span className="font-semibold text-brand-secondary">digital</span> revenue streams</li>
        <li>Human in the loop: safe, responsible, adaptable AI</li>
        <li>Custom solutions, white-label & API opportunities</li>
      </ul>
      <a href="mailto:founders@scan2verse.com" className="inline-block mt-4 px-6 py-2 rounded-full text-white font-bold bg-gradient-to-r from-brand-primary to-blue-700 hover:from-blue-700 hover:to-brand-primary transition shadow-lg hover:scale-105 transform duration-200">
        Contact Us
      </a>
    </div>
    <div className="glass-morphism bg-brand-secondary/10 border-brand-secondary/20 rounded-2xl p-8 shadow-xl flex-1">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-brand-secondary">For Collaborators</h2>
      <ul className="list-disc ml-5 text-foreground space-y-2 mb-5">
        <li>AI researchers, engineers, health pros, creators—join us at the core</li>
        <li>Access datasets & product APIs to train, build, or improve agents</li>
        <li>Startup and corporate partnership friendly—SDKs & support</li>
        <li>Shape the future of human-AI collaboration, responsibly</li>
      </ul>
      <a href="mailto:founders@scan2verse.com" className="inline-block mt-4 px-6 py-2 rounded-full text-white font-bold bg-gradient-to-r from-brand-secondary to-red-700 hover:from-red-700 hover:to-brand-secondary transition shadow-lg hover:scale-105 transform duration-200">
        Collaborate
      </a>
    </div>
  </section>
);

export default InvestCollaborate;
