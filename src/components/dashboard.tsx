import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Home, Plus, BookOpen, Settings, TrendingUp, Play, Clock, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useFlashcards } from "@/lib/hooks/flashcards";
import { useSessions, calculateStreak } from "@/lib/hooks/sessions";
import { BASE_URL } from "@/lib/api";
import { PageTransition } from "./ui/page-transition";

export function DashboardPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { data: flashcards, isLoading: isCardsLoading } = useFlashcards();
    const { data: sessions, isLoading: isSessionsLoading } = useSessions();

    const recentCards = flashcards || [];
    const streakCount = sessions ? calculateStreak(sessions) : 0;
    const isLoading = isCardsLoading || isSessionsLoading;

    return (
        <PageTransition>
            <div className="min-h-screen bg-zinc-50 flex flex-col pb-20 md:pb-0">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600  flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-zinc-900 tracking-tight">Velo</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate("/profile")}
                            className="h-8 w-8  bg-gradient-to-br from-indigo-500 to-purple-500 border border-white shadow-sm active:scale-95 transition-transform flex items-center justify-center text-[10px] font-black text-white overflow-hidden" 
                        >
                            {user?.avatar ? (
                                <img 
                                    src={`${BASE_URL.replace(/\/$/, '')}/${typeof user.avatar === 'object' ? user.avatar.url : `files/users/${user.id}/${user.avatar}`}`} 
                                    alt={user.name} 
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"
                            )}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 space-y-8 max-w-lg mx-auto w-full">
                    {/* Greeting */}
                    <section>
                        <h1 className="text-2xl font-bold text-zinc-900">Hi, {user?.name?.split(' ')[0] || "User"}! 👋</h1>
                        <p className="text-zinc-500 text-sm">Ready to master something new today?</p>
                    </section>

                    {/* Quick Action */}
                    <section className="bg-indigo-600  p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col items-start gap-4">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold">Study Flashcards</h2>
                                <p className="text-indigo-100 text-xs">Review your due cards and boost retention.</p>
                            </div>
                            <Button 
                                className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-6 py-2 h-auto"
                                onClick={() => navigate("/study")}
                            >
                                <Play className="h-4 w-4 mr-2 fill-current" />
                                Start Now
                            </Button>
                        </div>
                        <Play className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4  border border-zinc-200 shadow-sm flex flex-col gap-1">
                            <div className="h-8 w-8 bg-blue-50  flex items-center justify-center mb-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-zinc-900">{flashcards?.length || 0}</span>
                            <span className="text-xs font-medium text-zinc-400">Total Cards</span>
                        </div>
                        <div className="bg-white p-4  border border-zinc-200 shadow-sm flex flex-col gap-1">
                            <div className="h-8 w-8 bg-orange-50  flex items-center justify-center mb-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold text-zinc-900">{streakCount}d</span>
                            <span className="text-xs font-medium text-zinc-400">Study Streak</span>
                        </div>
                    </section>

                    {/* Recent Items */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900">Recently Added</h2>
                            <Link to="/flashcards" className="text-sm font-bold text-indigo-600 hover:underline">View all</Link>
                        </div>
                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
                                </div>
                            ) : recentCards.length > 0 ? (
                                recentCards.map((card) => (
                                    <div key={card.id} className="bg-white p-4  border border-zinc-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all">
                                        <div className="h-10 w-10 bg-indigo-50  flex items-center justify-center flex-shrink-0">
                                            <BookOpen className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 truncate">{card.question}</p>
                                            <p className="text-xs text-zinc-500 truncate italic">"{card.answer}"</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white  border border-zinc-100 shadow-sm">
                                    <p className="text-sm text-zinc-400 font-medium">Flashcards you add will appear here.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-zinc-200 px-6 py-3 flex items-center justify-between z-40 md:hidden">
                    <button className="flex flex-col items-center gap-1 text-indigo-600">
                        <Home className="h-6 w-6" />
                        <span className="text-[10px] font-bold">Home</span>
                    </button>
                    <button 
                        onClick={() => navigate("/flashcards")}
                        className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <BookOpen className="h-6 w-6" />
                        <span className="text-[10px] font-bold">Cards</span>
                    </button>
                    <div className="relative -top-6">
                        <button 
                            onClick={() => navigate("/flashcards/new")}
                            className="h-14 w-14 bg-zinc-900  flex items-center justify-center text-white shadow-xl shadow-zinc-200 active:scale-90 transition-all"
                        >
                            <Plus className="h-8 w-8" />
                        </button>
                    </div>
                    <button 
                        onClick={() => navigate("/stats")}
                        className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <TrendingUp className="h-6 w-6" />
                        <span className="text-[10px] font-bold">Stats</span>
                    </button>
                    <button 
                        onClick={() => navigate("/profile")}
                        className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <Settings className="h-6 w-6" />
                        <span className="text-[10px] font-bold">Profile</span>
                    </button>
                </nav>
            </div>
        </PageTransition>
    );
}
