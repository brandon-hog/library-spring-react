import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Library,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Library className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">LibStream</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#stats" className="hover:text-blue-600 transition-colors">Statistics</a>
          <a href="/register">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all shadow-sm">
              Register
            </button>
          </a>
          <a href="/login">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all shadow-sm">
              Login
            </button>
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-8 py-20 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Library system online
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Manage your library with <span className="text-blue-600 underline decoration-blue-200">precision.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            A modern way to browse titles, manage checkouts, and keep your collection organized, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Browse Collection <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 p-5 shadow-lg shadow-blue-600/25">
              <Library className="text-white" size={108} />
            </div>
            <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-black">
              LibStream
            </div>
          </div>
        </div>
      </header>

      {/* --- LIVE STATS BAR --- */}
      <section id="stats" className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-blue-400 text-3xl font-bold">12k+</p>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Total Books</p>
          </div>
          <div>
            <p className="text-blue-400 text-3xl font-bold">99.9%</p>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Service Availability</p>
          </div>
          <div>
            <p className="text-blue-400 text-3xl font-bold">&lt; 50ms</p>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Fast Responses</p>
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Built for Everyday Use</h2>
          <p className="text-slate-500">Simple, dependable tools that make finding and managing books feel effortless.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Search className="text-blue-600" />, 
              title: "Instant Search", 
              desc: "Find the right book in seconds with quick, smart searching across your collection." 
            },
            { 
              icon: <Users className="text-blue-600" />, 
              title: "Member Management", 
              desc: "Keep member details organized and view borrowing history at a glance." 
            },
            { 
              icon: <BookOpen className="text-blue-600" />, 
              title: "Digital Cataloging", 
              desc: "Add new books faster by scanning ISBNs to pull in titles, details, and cover art." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all group">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Library className="text-slate-400" size={20} />
            <span className="font-bold text-slate-400">LibStream</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 Brandon Hoggatt. Library tools made simple.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            {/* Links to the documentation and github */}
            <a href="http://localhost:8080/swagger-ui/index.html" className="hover:text-blue-600">API Docs</a>
            <a href="https://github.com/brandon-hog/library-spring-react" className="hover:text-blue-600">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};