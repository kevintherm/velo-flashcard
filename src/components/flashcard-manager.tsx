import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    useFlashcards, 
    useCreateFlashcard, 
    useUpdateFlashcard, 
    useDeleteFlashcard,
    type Flashcard 
} from "@/lib/hooks/flashcards";
import { useAuthStore } from "@/lib/store/auth-store";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "./ui/page-transition";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function FlashcardManager() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data: flashcards, isLoading } = useFlashcards();
    const createFlashcard = useCreateFlashcard();
    const updateFlashcard = useUpdateFlashcard();
    const deleteFlashcard = useDeleteFlashcard();

    const [isEditing, setIsEditing] = useState(false);
    const [currentCard, setCurrentCard] = useState<Partial<Flashcard> | null>(null);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const question = formData.get("question") as string;
        const answer = formData.get("answer") as string;

        if (!user) return;

        if (currentCard?.id) {
            updateFlashcard.mutate({ id: currentCard.id, question, answer }, {
                onSuccess: () => {
                    toast.success("Flashcard updated!");
                    setIsEditing(false);
                    setCurrentCard(null);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to update flashcard");
                }
            });
        } else {
            createFlashcard.mutate({ question, answer, user: user.id }, {
                onSuccess: () => {
                    toast.success("Flashcard created!");
                    setIsEditing(false);
                    setCurrentCard(null);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to create flashcard");
                }
            });
        }
    };

    const handleDelete = () => {
        if (cardToDelete) {
            deleteFlashcard.mutate(cardToDelete, {
                onSuccess: () => {
                    toast.success("Flashcard deleted");
                    setCardToDelete(null);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to delete flashcard");
                    setCardToDelete(null);
                }
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

    return (
        <PageTransition>
            <div className="min-h-screen bg-zinc-50 pb-24">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/dashboard")} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-zinc-900">Your Cards</h1>
                </header>

                <main className="p-6 max-w-lg mx-auto w-full space-y-6">
                    {isEditing ? (
                        <div className="bg-white p-6  border border-zinc-200 shadow-xl space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold">{currentCard?.id ? "Edit Card" : "New Card"}</h2>
                                <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-zinc-400">Cancel</button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question</Label>
                                    <Input 
                                        id="question" 
                                        name="question" 
                                        defaultValue={currentCard?.question} 
                                        placeholder="Enter question..." 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer</Label>
                                    <Textarea 
                                        id="answer" 
                                        name="answer" 
                                        defaultValue={currentCard?.answer} 
                                        placeholder="Enter answer..." 
                                        className="min-h-[100px]" 
                                        required 
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full bg-zinc-900 hover:bg-zinc-800"
                                    disabled={createFlashcard.isPending || updateFlashcard.isPending}
                                >
                                    {(createFlashcard.isPending || updateFlashcard.isPending) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Card"
                                    )}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => { setIsEditing(true); setCurrentCard({}); }}
                            className="w-full h-14 bg-white hover:bg-zinc-50 border-2 border-dashed border-zinc-200 text-zinc-500 font-bold  flex items-center justify-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Flashcard
                        </Button>
                    )}

                    <div className="space-y-4">
                        {flashcards?.map((card) => (
                            <div key={card.id} className="bg-white p-5  border border-zinc-100 shadow-sm space-y-3 group">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-indigo-50 ">
                                        <BookOpen className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => { setIsEditing(true); setCurrentCard(card); }}
                                            className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => setCardToDelete(card.id)}
                                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-zinc-900 leading-tight">{card.question}</h3>
                                    <p className="text-sm text-zinc-500 line-clamp-2 italic">"{card.answer}"</p>
                                </div>
                            </div>
                        ))}

                        {flashcards?.length === 0 && !isEditing && (
                            <div className="text-center py-12 space-y-3">
                                <div className="h-16 w-16 bg-zinc-100  flex items-center justify-center mx-auto">
                                    <BookOpen className="h-8 w-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-400 font-medium">No cards yet. Start by adding one!</p>
                            </div>
                        )}
                    </div>
                </main>

                <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your flashcard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete Card
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </PageTransition>
    );
}
