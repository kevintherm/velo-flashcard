import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useConfirmForgotPassword } from "@/lib/hooks/auth";
import { toast } from "sonner";

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const confirmForgotPassword = useConfirmForgotPassword();
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const passwordConfirm = formData.get("confirm-password") as string;

        if (password !== passwordConfirm) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        confirmForgotPassword.mutate({
            token,
            password,
            passwordConfirm,
        }, {
            onSuccess: () => {
                toast.success("Password reset successful! You can now login.");
                navigate("/login");
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to reset password");
            }
        });
    };

    return (
        <AuthLayout 
            title="Set new password" 
            description="Your new password must be different from previous used passwords"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
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
                    disabled={confirmForgotPassword.isPending}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {confirmForgotPassword.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        <>
                            Reset Password
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
