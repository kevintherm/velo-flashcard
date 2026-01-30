import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    LogOut, Mail, Shield, ChevronRight, ArrowLeft, 
    Pencil, Check, X, Loader2, Camera 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useUpdateProfile } from "@/lib/hooks/user";
import { BASE_URL } from "@/lib/api";
import { 
    useForgotPassword, 
    useConfirmForgotPassword,
    useRequestUpdateEmail,
    useConfirmUpdateEmail
} from "@/lib/hooks/auth";
import { toast } from "sonner";
import { useSettingsStore, type StudyPace, type StudyMode } from "@/lib/store/settings-store";
import { cn } from "@/lib/utils";
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
import { PageTransition } from "./ui/page-transition";

export function ProfilePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    
    // Mutations
    const updateProfile = useUpdateProfile();
    const forgotPassword = useForgotPassword();
    const confirmForgotPassword = useConfirmForgotPassword();
    const requestUpdateEmail = useRequestUpdateEmail();
    const confirmUpdateEmail = useConfirmUpdateEmail();

    // UI States
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modalStep, setModalStep] = useState<"none" | "password-confirm" | "email-request" | "email-confirm">("none");
    const [otpToken, setOtpToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleUpdateName = () => {
        const formData = new FormData();
        formData.append('name', newName);
        
        updateProfile.mutate(formData, {
            onSuccess: () => {
                toast.success("Name updated successfully!");
                setIsEditingName(false);
            },
            onError: (err: any) => toast.error(err.message || "Failed to update name")
        });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        updateProfile.mutate(formData, {
            onSuccess: () => {
                toast.success("Avatar updated successfully!");
            },
            onError: (err: any) => toast.error(err.message || "Failed to upload avatar")
        });
    };

    const handleRequestPasswordReset = () => {
        if (!user?.email) return;
        forgotPassword.mutate(user.email, {
            onSuccess: () => {
                toast.success("Reset code sent to your email!");
                setModalStep("password-confirm");
            },
            onError: (err: any) => toast.error(err.message || "Failed to send reset code")
        });
    };

    const handleConfirmPasswordReset = () => {
        confirmForgotPassword.mutate({
            otp: otpToken,
            "new_password": newPassword,
            "new_password_confirmation": newPassword,
        }, {
            onSuccess: () => {
                toast.success("Password changed successfully!");
                setModalStep("none");
                setOtpToken("");
                setNewPassword("");
            },
            onError: (err: any) => toast.error(err.message || "Invalid code or failed to reset")
        });
    };

    const handleRequestEmailUpdate = () => {
        if (!user?.email) return;
        requestUpdateEmail.mutate({ email: user.email }, {
            onSuccess: () => {
                toast.success("Confirmation code sent to your email!");
                setModalStep("email-confirm");
                setOtpToken("");
            },
            onError: (err: any) => toast.error(err.message || "Failed to request email update")
        });
    };

    const handleConfirmEmailUpdate = () => {
        confirmUpdateEmail.mutate({
            otp: otpToken,
            "new_email": newEmail
        }, {
            onSuccess: () => {
                toast.success("Email updated successfully! Please login again.");
                logout();
                navigate("/login");
            },
            onError: (err: any) => toast.error(err.message || "Failed to confirm email update")
        });
    };

    const { studyPace, setStudyPace, studyMode, setStudyMode } = useSettingsStore();

    return (
        <PageTransition>
            <div className="min-h-screen bg-zinc-50 flex flex-col pb-12">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/dashboard")} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-zinc-900">Profile</h1>
                </header>

                <main className="flex-1 p-6 max-w-lg mx-auto w-full space-y-8">
                    {/* User Header */}
                    <section className="flex flex-col items-center text-center gap-4 pb-4">
                        <div className="relative group">
                            <div 
                                onClick={handleAvatarClick}
                                className="h-24 w-24  bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black relative overflow-hidden cursor-pointer"
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
                                
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            {updateProfile.isPending && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </div>
                        <div className="w-full">
                            {isEditingName ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Input 
                                        value={newName} 
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="max-w-[200px] text-center font-bold text-xl h-10 border-indigo-200 focus-visible:ring-indigo-500"
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateName} className="p-2 text-green-600 hover:bg-green-50 ">
                                        <Check className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setIsEditingName(false)} className="p-2 text-red-600 hover:bg-red-50 ">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <h2 className="text-2xl font-bold text-zinc-900">{user?.name || "User"}</h2>
                                    <button onClick={() => setIsEditingName(true)} className="text-zinc-300 hover:text-indigo-600 transition-colors">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <p className="text-zinc-500 text-sm">{user?.email}</p>
                        </div>
                    </section>

                    {/* Session Mode */}
                    <section className="space-y-3">
                        <h3 className="px-1 text-xs font-black text-zinc-400 uppercase tracking-widest">Study Mode</h3>
                        <div className="bg-white p-2  border border-zinc-200 shadow-sm flex gap-1">
                            {(['quiz', 'flashcard'] as StudyMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setStudyMode(mode)}
                                    className={cn(
                                        "flex-1 py-3 px-4  text-xs font-bold capitalize transition-all",
                                        studyMode === mode 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                            : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <p className="px-1 text-[10px] text-zinc-400 font-medium">
                            {studyMode === 'quiz' && "Multiple-choice questions. Test your knowledge!"}
                            {studyMode === 'flashcard' && "Traditional flip cards. Review at your own pace."}
                        </p>
                    </section>

                    {/* Session Settings */}
                    <section className="space-y-3">
                        <h3 className="px-1 text-xs font-black text-zinc-400 uppercase tracking-widest">Study Session Pace</h3>
                        <div className="bg-white p-2  border border-zinc-200 shadow-sm flex gap-1">
                            {(['relaxed', 'normal', 'fast'] as StudyPace[]).map((pace) => (
                                <button
                                    key={pace}
                                    onClick={() => setStudyPace(pace)}
                                    className={cn(
                                        "flex-1 py-3 px-4  text-xs font-bold capitalize transition-all",
                                        studyPace === pace 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                            : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                                    )}
                                >
                                    {pace}
                                </button>
                            ))}
                        </div>
                        <p className="px-1 text-[10px] text-zinc-400 font-medium">
                            {studyPace === 'fast' && "Answers reveal instantly. Lightning speed!"}
                            {studyPace === 'normal' && "Balanced delay. Good for learning."}
                            {studyPace === 'relaxed' && "Longer reveal time. Take it slow."}
                        </p>
                    </section>

                    {/* Account Settings */}
                    <section className="space-y-3">
                        <h3 className="px-1 text-xs font-black text-zinc-400 uppercase tracking-widest">Account Details</h3>
                        <div className="bg-white  border border-zinc-200 overflow-hidden shadow-sm">
                            <div className="p-4 flex items-center gap-4">
                                <div className="h-10 w-10 bg-purple-50  flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-zinc-400">Email Address</p>
                                    <p className="text-sm font-bold text-zinc-900">{user?.email}</p>
                                </div>
                                <button 
                                    onClick={() => setModalStep("email-request")}
                                    className="text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="space-y-3">
                        <h3 className="px-1 text-xs font-black text-zinc-400 uppercase tracking-widest">Security</h3>
                        <div className="bg-white  border border-zinc-200 overflow-hidden shadow-sm">
                            <button 
                                onClick={handleRequestPasswordReset}
                                className="w-full p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors group"
                            >
                                <div className="h-10 w-10 bg-orange-50  flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-zinc-900">Change Password</p>
                                    <p className="text-[10px] text-zinc-400">Triggers an OTP reset flow</p>
                                </div>
                                {forgotPassword.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                                )}
                            </button>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="pt-4">
                        <Button 
                            onClick={handleLogout}
                            className="w-full h-14 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-100 font-bold  flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </Button>
                        <p className="text-center text-[10px] text-zinc-400 font-medium mt-6 uppercase tracking-[0.2em]">
                            Velo Flashcards v1.0.0
                        </p>
                    </section>
                </main>

                {/* Password Confirm Modal */}
                <AlertDialog open={modalStep === "password-confirm"} onOpenChange={(open) => !open && setModalStep("none")}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reset Password</AlertDialogTitle>
                            <AlertDialogDescription>
                                Enter the code sent to your email and your new password.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>OTP Code</Label>
                                <Input 
                                    placeholder="Enter token..." 
                                    value={otpToken} 
                                    onChange={(e) => setOtpToken(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleConfirmPasswordReset}
                                disabled={confirmForgotPassword.isPending}
                            >
                                {confirmForgotPassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Email Request Modal */}
                <AlertDialog open={modalStep === "email-request"} onOpenChange={(open) => !open && setModalStep("none")}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Change Email</AlertDialogTitle>
                            <AlertDialogDescription>
                                We will send a security code to your current email ({user?.email}) to authorize updating your email address.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleRequestEmailUpdate}
                                disabled={requestUpdateEmail.isPending}
                            >
                                {requestUpdateEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Code"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Email Confirm Modal */}
                <AlertDialog open={modalStep === "email-confirm"} onOpenChange={(open) => !open && setModalStep("none")}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Email Change</AlertDialogTitle>
                            <AlertDialogDescription>
                                Enter the security code sent to your email and your new email address.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Security Code</Label>
                                <Input 
                                    placeholder="Enter code..." 
                                    value={otpToken} 
                                    onChange={(e) => setOtpToken(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Email Address</Label>
                                <Input 
                                    type="email" 
                                    placeholder="new@example.com" 
                                    value={newEmail} 
                                    onChange={(e) => setNewEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleConfirmEmailUpdate}
                                disabled={confirmUpdateEmail.isPending}
                            >
                                {confirmUpdateEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Email"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </PageTransition>
    );
}
