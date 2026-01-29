import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/lib/hooks/auth";
import { toast } from "sonner";

export function ForgotPasswordPage() {
    const forgotPassword = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        forgotPassword.mutate(email, {
            onSuccess: () => {
                toast.success("Password reset email sent! Please check your inbox.");
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to send reset email");
            }
        });
    };

    return (
        <AuthLayout 
            title="Forgot password?" 
            description="No worries, we'll send you reset instructions"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="name@example.com" 
                            className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                            required 
                        />
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={forgotPassword.isPending}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {forgotPassword.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            Reset Password
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center">
                <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </AuthLayout>
    );
}
