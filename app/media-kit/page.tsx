import { Metadata } from "next";
import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";


export const metadata: Metadata = {
    title: "Media Kit & Brand Assets | ABI Builder",
    description: "Download official ABI Builder logos, streamer overlays, and panels. Access our brand colors and assets for content creators.",
};

export default function MediaKitPage() {
    return (
        <main className="min-h-screen bg-background pb-20 pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                        Media <span className="text-primary">Kit</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Official brand assets, logos, and streamer resources for content creators.
                        Feel free to use these in your videos, streams, and social media.
                    </p>
                </div>

                {/* Community Note */}
                <div className="mb-20 p-8 rounded-2xl bg-white/5 border border-white/10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="relative z-10 w-full">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Content Creators & Streamers
                        </h3>
                        <div className="space-y-4">
                            <p className="text-text-secondary text-xl max-w-3xl leading-relaxed italic">
                                "I built this for the community. Thanks a lot for making more people learn about the site. Thank you for your amazing interest and hype!"
                            </p>
                            <p className="text-white font-bold font-display text-lg">— Zleep</p>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent skew-x-12 transform translate-x-10 pointer-events-none" />
                </div>

                {/* Assets Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Brand Assets</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Logo Card */}
                        <div className="glass-elevated rounded-2xl p-6 border border-white/5 flex flex-col gap-6 group hover:border-primary/30 transition-colors">
                            <div className="relative aspect-video bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-8">
                                <Image src="/logo.png" alt="Logo" width={200} height={100} className="object-contain group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="text-center w-full mt-auto">
                                <h3 className="text-lg font-bold text-white mb-2">Main Logo</h3>
                                <a href="/logo.png" download className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-primary hover:text-black text-white rounded-lg font-medium transition-all">
                                    <Download className="w-4 h-4" /> Download PNG
                                </a>
                            </div>
                        </div>

                        {/* Panel Card */}
                        <div className="glass-elevated rounded-2xl p-6 border border-white/5 flex flex-col gap-6 group hover:border-primary/30 transition-colors">
                            <div className="relative aspect-video bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                <Image src="/media-kit/panel.png" alt="Panel" width={320} height={160} className="object-contain w-3/4 group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="text-center w-full mt-auto">
                                <h3 className="text-lg font-bold text-white mb-2">Twitch Panel</h3>
                                <a href="/media-kit/panel.png" download className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-primary hover:text-black text-white rounded-lg font-medium transition-all">
                                    <Download className="w-4 h-4" /> Download Panel
                                </a>
                            </div>
                        </div>

                        {/* Overlay Card */}
                        <div className="glass-elevated rounded-2xl p-6 border border-white/5 flex flex-col gap-6 group hover:border-primary/30 transition-colors">
                            <div className="relative aspect-video bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                <Image src="/media-kit/overlay.png" alt="Overlay" width={400} height={225} className="object-contain w-full p-2 group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="text-center w-full mt-auto">
                                <h3 className="text-lg font-bold text-white mb-2">Stream Overlay</h3>
                                <a href="/media-kit/overlay.png" download className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-primary hover:text-black text-white rounded-lg font-medium transition-all">
                                    <Download className="w-4 h-4" /> Download Overlay
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
