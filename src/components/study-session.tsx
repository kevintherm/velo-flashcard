import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/lib/hooks/flashcards";
import { useSaveSession } from "@/lib/hooks/sessions";
import { useAuthStore } from "@/lib/store/auth-store";
import { ArrowLeft, Loader2, Check, X, Award, BookOpen, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store/settings-store";
import { PageTransition } from "./ui/page-transition";

export function StudySession() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data: flashcards, isLoading } = useFlashcards();
    const saveSession = useSaveSession();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Shuffle cards for variety
    const shuffledCards = useMemo(() => {
        if (!flashcards) return [];
        return [...flashcards].sort(() => Math.random() - 0.5);
    }, [flashcards]);

    const currentCard = shuffledCards[currentIndex];

    // Generate options for the current card
    useEffect(() => {
        if (currentCard && flashcards) {
            const correctAnswer = currentCard.answer;
            // Get all other answers
            const otherAnswers = flashcards
                .filter(c => c.id !== currentCard.id)
                .map(c => c.answer);
            
            // Randomly pick 3 decoys (or fewer if not enough cards)
            const decoys = [...otherAnswers]
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
            
            // Combine and shuffle
            const options = [...decoys, correctAnswer].sort(() => Math.random() - 0.5);
            setShuffledOptions(options);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    }, [currentCard, flashcards]);

    const { studyPace, studyMode } = useSettingsStore();

    const handleSelect = (answer: string) => {
        if (showResult) return;
        
        setSelectedAnswer(answer);
        setShowResult(true);
        const isCorrect = answer === currentCard.answer;
        
        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        }

        // Auto proceed after delay based on pace
        const delays = {
            fast: 500,
            normal: 1500,
            relaxed: 3000
        };

        setTimeout(() => {
            if (currentIndex < shuffledCards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                handleFinish(isCorrect ? correctCount + 1 : correctCount);
            }
        }, delays[studyPace] || 1500);
    };

    const handleFinish = async (finalCorrect: number) => {
        setIsFinished(true);
        if (user) {
            saveSession.mutate({
                user: user.id,
                correct_count: finalCorrect,
                total_count: shuffledCards.length
            }, {
                onSuccess: () => toast.success("Session saved!"),
                onError: (error: any) => toast.error(error.message || "Failed to save session")
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!shuffledCards.length) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 space-y-6">
                <div className="h-20 w-20 bg-zinc-100  flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-zinc-300" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">No cards to study</h2>
                    <p className="text-zinc-500 font-medium">Add some flashcards before starting a session.</p>
                </div>
                <Button onClick={() => navigate("/flashcards")} className="bg-indigo-600 w-full max-w-xs">
                    Go to Cards
                </Button>
            </div>
        );
    }

    if (isFinished) {
        const percentage = Math.round((correctCount / shuffledCards.length) * 100);
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="h-32 w-32 bg-indigo-50  flex items-center justify-center">
                        <Award className="h-16 w-16 text-indigo-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1  shadow-lg">
                        DONE!
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Quiz Results</h1>
                    <p className="text-zinc-400 font-medium italic">Accuracy Score</p>
                </div>

                <div className="w-full max-w-xs bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center gap-4">
                    <div className="text-center">
                        <span className="text-5xl font-black text-indigo-600">{percentage}%</span>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Accuracy</p>
                    </div>
                    <div className="w-full h-2 bg-zinc-200  overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-sm font-bold text-zinc-600">{correctCount} / {shuffledCards.length} correct</p>
                </div>

                <div className="flex flex-col w-full max-w-xs gap-3">
                    <Button onClick={() => window.location.reload()} className="h-14 bg-zinc-900 hover:bg-zinc-800 font-bold  gap-2">
                        <RotateCcw className="h-5 w-5" />
                        Play Again
                    </Button>
                    <Button onClick={() => navigate("/dashboard")} variant="outline" className="h-14 border-2 font-bold ">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <header className="px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate("/dashboard")} className="text-zinc-400 hover:text-zinc-900 transition-colors pointer-events-none opacity-0">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                            Card {currentIndex + 1} / {shuffledCards.length}
                        </span>
                    </div>
                    <button onClick={() => navigate("/dashboard")} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                <main className="flex-1 flex flex-col px-6 pb-12 items-center space-y-8">
                    {/* Progress Bar */}
                    <div className="w-full max-w-sm h-1.5 bg-zinc-200  overflow-hidden">
                        <div 
                            className="h-full bg-indigo-600 transition-all duration-300" 
                            style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }} 
                        />
                    </div>

                    {/* 3D Flashcard Container */}
                    <div className="w-full max-w-sm perspective-1000 h-[220px]">
                        <div 
                            onClick={() => studyMode === 'flashcard' && !showResult && setIsFlipped(!isFlipped)}
                            className={cn(
                                "relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer",
                                isFlipped && "rotate-y-180",
                                studyMode === 'quiz' && "cursor-default"
                            )}
                        >
                            {/* Front Face (Question) */}
                            <div className="absolute inset-0 backface-hidden bg-white p-8 rounded-[2.5rem] border-2 border-zinc-100 shadow-xl shadow-zinc-100 flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 px-3 py-1 bg-indigo-50 ">Question</span>
                                <h2 className="text-2xl font-black text-zinc-900 leading-tight">
                                    {currentCard.question}
                                </h2>
                                {studyMode === 'flashcard' && !isFlipped && (
                                    <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                                        Tap to flip
                                    </p>
                                )}
                            </div>

                            {/* Back Face (Answer) */}
                            <div className="absolute inset-0 backface-hidden bg-white p-8 rounded-[2.5rem] border-2 border-indigo-500 shadow-xl shadow-indigo-100 flex flex-col items-center justify-center text-center rotate-y-180">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-4 px-3 py-1 bg-green-50 ">Correct Answer</span>
                                <h2 className="text-2xl font-black text-indigo-600 leading-tight italic">
                                    "{currentCard.answer}"
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Options / Action Grid */}
                    <div className="w-full max-w-sm grid grid-cols-1 gap-3 flex-1">
                        {studyMode === 'quiz' ? (
                            shuffledOptions.map((option, idx) => {
                                const isCorrect = option === currentCard.answer;
                                const isSelected = option === selectedAnswer;
                                
                                let variant = "default";
                                if (showResult) {
                                    if (isCorrect) variant = "correct";
                                    else if (isSelected) variant = "incorrect";
                                    else variant = "dim";
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={showResult}
                                        onClick={() => handleSelect(option)}
                                        className={cn(
                                            "p-5  text-left font-bold text-sm transition-all duration-200 flex items-center justify-between border-2 active:scale-[0.98]",
                                            variant === "default" && "bg-white border-zinc-100 text-zinc-700 hover:border-indigo-200",
                                            variant === "correct" && "bg-green-50 border-green-500 text-green-700 shadow-none",
                                            variant === "incorrect" && "bg-red-50 border-red-500 text-red-700 shadow-none",
                                            variant === "dim" && "bg-zinc-50 border-zinc-100 text-zinc-300 shadow-none grayscale opacity-50"
                                        )}
                                    >
                                        <span className="flex-1 italic">"{option}"</span>
                                        {showResult && isCorrect && <Check className="h-5 w-5 text-green-600 shrink-0 ml-2" />}
                                        {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600 shrink-0 ml-2" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {!isFlipped ? (
                                    <Button 
                                        onClick={() => setIsFlipped(true)}
                                        className="col-span-2 h-16 bg-indigo-600 hover:bg-indigo-700 font-bold  shadow-lg shadow-indigo-100"
                                    >
                                        Reveal Answer
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            disabled={showResult}
                                            onClick={() => {
                                                setShowResult(true);
                                                // Handle as incorrect
                                                const delays = { fast: 300, normal: 800, relaxed: 1500 };
                                                setTimeout(() => {
                                                    if (currentIndex < shuffledCards.length - 1) {
                                                        setCurrentIndex(prev => prev + 1);
                                                        setIsFlipped(false);
                                                    } else {
                                                        handleFinish(correctCount);
                                                    }
                                                }, delays[studyPace] || 800);
                                            }}
                                            variant="outline"
                                            className="h-16 border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold "
                                        >
                                            <X className="h-5 w-5 mr-2" />
                                            Incorrect
                                        </Button>
                                        <Button 
                                            disabled={showResult}
                                            onClick={() => {
                                                setShowResult(true);
                                                setCorrectCount(prev => prev + 1);
                                                const delays = { fast: 300, normal: 800, relaxed: 1500 };
                                                setTimeout(() => {
                                                    if (currentIndex < shuffledCards.length - 1) {
                                                        setCurrentIndex(prev => prev + 1);
                                                        setIsFlipped(false);
                                                    } else {
                                                        handleFinish(correctCount + 1);
                                                    }
                                                }, delays[studyPace] || 800);
                                            }}
                                            className="h-16 bg-green-600 hover:bg-green-700 font-bold  shadow-lg shadow-green-100"
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            Correct
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </PageTransition>
    );
}
