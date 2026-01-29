import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useLogin, useForgotPassword, useConfirmForgotPassword } from "@/lib/hooks/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
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

export function LoginPage() {
    const navigate = useNavigate();
    const login = useLogin();
    const forgotPassword = useForgotPassword();
    const confirmForgotPassword = useConfirmForgotPassword();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setToken = useAuthStore((state) => state.setToken);

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [invalidateSessions, setInvalidateSessions] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const identifier = formData.get("email") as string;
        const password = formData.get("password") as string;

        login.mutate({ identifier, password }, {
            onSuccess: async (response: any) => {
                const token = response.data;
                setToken(token);
                
                try {
                    const userData = await apiFetch<any>('collections/users/auth/me');
                    setAuth(userData.data || userData, token);
                    toast.success("Login successful!");
                    navigate("/");
                } catch (error: any) {
                    toast.error("Failed to fetch user profile after login");
                    console.error("Profile fetch error:", error);
                }
            },
            onError: (error: any) => {
                toast.error(error.message || "Login failed");
            }
        });
    };

    const handleForgotPasswordClick = () => {
        setShowResetModal(true);
    };

    const handleRequestReset = () => {
        if (!resetEmail) {
            toast.error("Please enter your email");
            return;
        }

        forgotPassword.mutate(resetEmail, {
            onSuccess: () => {
                toast.success("OTP sent to your email!");
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to send OTP");
            }
        });
    };

    const handleConfirmReset = () => {
        if (!otp || !resetEmail || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        confirmForgotPassword.mutate({
            email: resetEmail,
            otp: otp,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            invalidate_sessions: invalidateSessions
        }, {
            onSuccess: () => {
                toast.success("Password reset successfully!");
                setShowResetModal(false);
                setResetEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setInvalidateSessions(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to reset password");
            }
        });
    };

    return (
        <AuthLayout 
            title="Welcome back" 
            description="Enter your credentials to access your account"
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
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button 
                            type="button"
                            onClick={handleForgotPasswordClick}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
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

                <Button 
                    type="submit"
                    disabled={login.isPending}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {login.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm font-medium text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-bold underline-offset-4 hover:underline transition-all">
                        Create an account
                    </Link>
                </p>
            </div>

            {/* Reset Password Modal */}
            <AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Password</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter your email to receive an OTP, then use it to reset your password.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <Input 
                                id="reset-email"
                                type="email"
                                placeholder="your@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <Button 
                                type="button"
                                onClick={handleRequestReset}
                                disabled={forgotPassword.isPending || !resetEmail}
                                variant="outline"
                                className="w-full"
                                size="sm"
                            >
                                {forgotPassword.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP Code</Label>
                            <Input 
                                id="otp"
                                type="text"
                                placeholder="Enter OTP from email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input 
                                id="new-password"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input 
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                id="invalidate-sessions"
                                checked={invalidateSessions}
                                onChange={(e) => setInvalidateSessions(e.target.checked)}
                                className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label 
                                htmlFor="invalidate-sessions"
                                className="text-sm font-medium text-zinc-700 cursor-pointer select-none"
                            >
                                Sign out from all devices
                            </label>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmReset}
                            disabled={confirmForgotPassword.isPending}
                        >
                            {confirmForgotPassword.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthLayout>
    );
}
