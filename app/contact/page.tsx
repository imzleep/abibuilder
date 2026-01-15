import { Metadata } from "next";
import { Mail, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | ABI Builder",
    description: "Get in touch with the ABI Builder team via Discord or Email.",
};

// Simple Discord Icon component because Lucide doesn't have the brand icon
function DiscordIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 127.14 96.36"
            className={className}
            fill="currentColor"
        >
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c2.36-24.44-3.52-47.88-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
    );
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background pb-20 pt-24 flex flex-col items-center justify-center">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hi?
                        Choose your preferred way to reach out.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Discord Card */}
                    <div className="bg-[#0b0b0b] rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center gap-6 group hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5 transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-[#1e1f22] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <DiscordIcon className="w-10 h-10 text-[#5865F2]" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Discord</h2>
                            <p className="text-text-secondary">Add me and send a DM.</p>
                        </div>

                        <a
                            href="https://discord.com/users/232052258748104705"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5865F2]/20 hover:shadow-[#5865F2]/40 hover:-translate-y-1"
                        >
                            <DiscordIcon className="w-6 h-6" />
                            zleep
                        </a>
                    </div>

                    {/* Email Card */}
                    <div className="bg-[#0b0b0b] rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center gap-6 group hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300">
                        <div className="w-20 h-20 rounded-full bg-[#1e1f22] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-10 h-10 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Email</h2>
                            <p className="text-text-secondary">Send us your feedback, bug reports, or partnership inquiries.</p>
                        </div>

                        <a
                            href="mailto:contact@zleep.dev"
                            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-1"
                        >
                            <Mail className="w-5 h-5" />
                            contact@zleep.dev
                        </a>
                    </div>

                </div>

            </div>
        </main>
    );
}
