import { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Github, 
  Star, 
  GitFork, 
  FileUp, 
  ExternalLink, 
  RefreshCcw, 
  Cpu, 
  Code2, 
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Repository {
  rank: number;
  name: string;
  url: string;
  stars: number;
  forks: number;
  languages_list: string[];
  similarity_score: number;
}

const API_BASE = "http://localhost:8000";

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'pdf'>('text');
  const [topK, setTopK] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (inputType === 'text' && !query.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/search/text`, null, {
        params: { query, top_k: top_k }
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during text search.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/search/pdf`, formData, {
        params: { top_k: top_k },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during PDF analysis.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Github className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">GitQuest <span className="text-primary italic">AI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              GitHub Repo
            </button>
          </div>
        </div>
      </nav>

      {/* App Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Hero & Search Left Side (4 Columns) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tight">
                Find your next <br />
                <span className="text-gradient">Open Source</span> project.
              </h1>
              <p className="text-gray-400 text-lg max-w-lg">
                Discover GitHub repositories that match your technical needs and semantic intent using advanced hybrid AI search.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-3xl space-y-6"
            >
              {/* Toggle Input Type */}
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                <button
                  onClick={() => setInputType('text')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm",
                    inputType === 'text' ? "bg-primary shadow-lg shadow-primary/30 text-white" : "hover:bg-white/5 text-gray-400"
                  )}
                >
                  <Search size={18} /> Semantic Search
                </button>
                <button
                  onClick={() => setInputType('pdf')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm",
                    inputType === 'pdf' ? "bg-primary shadow-lg shadow-primary/30 text-white" : "hover:bg-white/5 text-gray-400"
                  )}
                >
                  <FileUp size={18} /> PDF Analysis
                </button>
              </div>

              {inputType === 'text' ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <textarea 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. 'A high performance deep learning framework for computer vision in PyTorch'"
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-gray-600"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">
                      {query.length} chars
                    </div>
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20"
                  >
                    {isLoading ? <RefreshCcw className="animate-spin" /> : <Zap fill="currentColor" />}
                    {isLoading ? "Analyzing Vector Space..." : "Start Recommendation Engine"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileUp className="text-gray-400 group-hover:text-primary" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">Click to Upload PDF</p>
                      <p className="text-gray-500 text-sm">Extract technical specs from documentation</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={handleFileUpload}
                    />
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-3 text-primary animate-pulse justify-center">
                      <RefreshCcw className="animate-spin" />
                      <span className="font-medium">Ocr & Embedding Generation...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Slider Top K */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-400">Results Density</label>
                  <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded-md">{topK} Repos</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="20" 
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full accent-primary bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </motion.div>
          </div>

          {/* Results Area Right Side (8 Columns) */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-primary" size={20} />
                Recommendation Stream
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Index Online: 1349 Repos
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4 text-red-400"
                >
                  <AlertCircle className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Recommendation Error</h4>
                    <p className="text-sm opacity-90">{error}</p>
                    <button onClick={() => setError(null)} className="text-xs underline mt-2">Dismiss</button>
                  </div>
                </motion.div>
              )}

              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((repo, index) => (
                    <motion.div
                      key={repo.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 rounded-3xl"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 flex flex-col gap-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                {repo.rank}
                              </span>
                              <h3 className="text-xl font-bold font-display hover:text-primary transition-colors">
                                <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                              </h3>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                              Identity Match: {Math.round(repo.similarity_score * 100)}%
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {repo.languages_list.map(lang => (
                              <span key={lang} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/10">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-3 md:pl-6 md:border-l border-white/5">
                          <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-xl">
                            <Star size={16} className="text-yellow-500" />
                            <span className="font-mono font-bold">{repo.stars.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-xl">
                            <GitFork size={16} className="text-blue-500" />
                            <span className="font-mono font-bold">{repo.forks.toLocaleString()}</span>
                          </div>
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-primary transition-all text-gray-400 hover:text-white"
                          >
                            <ExternalLink size={20} />
                          </a>
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${repo.similarity_score * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-[40px] text-gray-500 gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                    <Zap className="opacity-20" size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">Ready for your query</p>
                    <p className="text-sm opacity-60">Results will appear here based on semantic similarity</p>
                  </div>
                </div>
              )}

              {isLoading && results.length === 0 && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="w-1/2 h-6 bg-white/5 rounded-md mb-4" />
                        <div className="w-20 h-6 bg-white/5 rounded-full" />
                      </div>
                      <div className="flex gap-2 mb-6">
                        <div className="w-16 h-4 bg-white/5 rounded" />
                        <div className="w-16 h-4 bg-white/5 rounded" />
                        <div className="w-16 h-4 bg-white/5 rounded" />
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full" />
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Stats Sidebar-like section at the bottom */}
      <footer className="border-t border-white/5 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-3">
            <Cpu size={20} className="text-primary" />
            <span>Search Engine: FAISS Index FlatL2</span>
          </div>
          <div className="flex items-center gap-3">
            <Code2 size={20} className="text-primary" />
            <span>Embeddings: SentenceTransformer L6-v2</span>
          </div>
          <div className="flex items-center gap-3">
            <Github size={20} className="text-primary" />
            <span>Built by Nour El Houda & Antigravity</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
