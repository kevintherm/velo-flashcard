import { useNavigate } from "react-router-dom";
import { useSessions } from "@/lib/hooks/sessions";
import { 
    ArrowLeft, TrendingUp, Target, BookOpen, 
    Calendar, Loader2, Award 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/lib/hooks/flashcards";
import { cn } from "@/lib/utils";

export function StatsPage() {
    const navigate = useNavigate();
    const { data: sessions, isLoading: isSessionsLoading } = useSessions();
    const { data: flashcards, isLoading: isCardsLoading } = useFlashcards();

    const stats = {
        totalSessions: sessions?.length || 0,
        totalCardsStudied: sessions?.reduce((acc, s) => acc + s.total_count, 0) || 0,
        totalCorrect: sessions?.reduce((acc, s) => acc + s.correct_count, 0) || 0,
        avgAccuracy: sessions?.length 
            ? Math.round((sessions.reduce((acc, s) => acc + (s.correct_count / s.total_count), 0) / sessions.length) * 100) 
            : 0,
        totalCards: flashcards?.length || 0,
    };

    if (isSessionsLoading || isCardsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col pb-12">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate("/dashboard")} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-zinc-900">Statistics</h1>
            </header>

            <main className="flex-1 p-6 max-w-lg mx-auto w-full space-y-8">
                {/* Summary Cards */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[2rem] border border-zinc-200 shadow-sm space-y-3">
                        <div className="h-10 w-10 bg-indigo-50  flex items-center justify-center">
                            <Target className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900">{stats.avgAccuracy}%</p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Avg Accuracy</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] border border-zinc-200 shadow-sm space-y-3">
                        <div className="h-10 w-10 bg-orange-50  flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900">{stats.totalSessions}</p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sessions</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] border border-zinc-200 shadow-sm space-y-3">
                        <div className="h-10 w-10 bg-blue-50  flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900">{stats.totalCards}</p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Cards</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] border border-zinc-200 shadow-sm space-y-3">
                        <div className="h-10 w-10 bg-green-50  flex items-center justify-center">
                            <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-zinc-900">{stats.totalCardsStudied}</p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cards Studied</p>
                        </div>
                    </div>
                </section>

                {/* History */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Study History</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {sessions && sessions.length > 0 ? (
                            [...sessions].reverse().map((session) => (
                                <div key={session.id} className="bg-white p-4  border border-zinc-100 shadow-sm flex items-center gap-4">
                                    <div className="h-10 w-10 bg-zinc-50  flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-zinc-900">
                                                {new Date(session.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-0.5 ",
                                                (session.correct_count / session.total_count) >= 0.8 ? "bg-green-50 text-green-600" : 
                                                (session.correct_count / session.total_count) >= 0.5 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {Math.round((session.correct_count / session.total_count) * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400 font-medium">
                                            {session.correct_count} correct out of {session.total_count} cards
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm">
                                <div className="h-12 w-12 bg-zinc-50  flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-6 w-6 text-zinc-300" />
                                </div>
                                <p className="text-sm text-zinc-400 font-bold">No sessions logged yet.</p>
                                <Button 
                                    onClick={() => navigate("/study")} 
                                    variant="link" 
                                    className="text-indigo-600 font-bold"
                                >
                                    Start your first session
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
