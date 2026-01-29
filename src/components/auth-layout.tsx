import * as React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* Branding side */}
            <div className="relative hidden w-full flex-col items-center justify-center bg-zinc-900 p-10 text-white lg:flex lg:w-1/2">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
                
                <div className="relative z-20 flex items-center text-3xl font-bold tracking-tight">
                    <div className="mr-2 flex h-10 w-10 items-center justify-center  bg-white text-indigo-600 shadow-lg">
                        <Zap className="h-6 w-6" fill="currentColor" />
                    </div>
                    Velo Flashcard
                </div>
                
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-xl font-medium italic leading-relaxed">
                            "The fastest way to master any subject. Beautiful, intuitive, and designed for high-performance learning."
                        </p>
                        <footer className="text-sm font-semibold uppercase tracking-widest text-white/70">
                            Accelerate your growth
                        </footer>
                    </blockquote>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Form side */}
            <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        <div className="mb-6 flex justify-center lg:hidden">
                            <div className="flex h-12 w-12 items-center justify-center  bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                                <Zap className="h-7 w-7" fill="currentColor" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 underline decoration-indigo-500/30 decoration-4 underline-offset-4">
                            {title}
                        </h1>
                        <p className="text-sm font-medium text-zinc-500">
                            {description}
                        </p>
                    </div>
                    
                    <div className="grid gap-6">
                        {children}
                    </div>
                    
                    <p className="px-8 text-center text-sm font-medium text-zinc-400">
                        By clicking continue, you agree to our{" "}
                        <Link to="/terms" className="text-zinc-900 underline underline-offset-4 hover:text-indigo-600 transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-zinc-900 underline underline-offset-4 hover:text-indigo-600 transition-colors">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
