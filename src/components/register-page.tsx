import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useRegister } from "@/lib/hooks/auth";
import { toast } from "sonner";

export function RegisterPage() {
    const navigate = useNavigate();
    const register = useRegister();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        register.mutate({
            name,
            email,
            password,
            passwordConfirm: confirmPassword,
        }, {
            onSuccess: () => {
                toast.success("Registration successful! Please login.");
                navigate("/login");
            },
            onError: (error: Error) => {
                toast.error(error.message || "Registration failed");
            }
        });
    };

    return (
        <AuthLayout 
            title="Create an account" 
            description="Join Velo Flashcard and start mastering new subjects today"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative group">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                            id="name" 
                            name="name"
                            type="text" 
                            placeholder="John Doe" 
                            className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                            required 
                        />
                    </div>
                </div>

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
                
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                            id="password" 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                            required 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />
                        <Input 
                            id="confirm-password" 
                            name="confirm-password"
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 h-11 border-zinc-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                            required 
                        />
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={register.isPending}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {register.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm font-medium text-zinc-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold underline-offset-4 hover:underline transition-all">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
