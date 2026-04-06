import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ABI Builder",
    description: "Privacy Policy for ABI Builder - Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background pb-20 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-text-secondary italic">
                        Last updated: April 6, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-10 text-text-secondary leading-relaxed">
                    <section>
                        <p className="text-lg">
                            At ABI Builder (
                            <a href="https://abibuilder.com" className="text-primary hover:underline font-medium">
                                https://abibuilder.com
                            </a>
                            ), we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            <span className="text-primary">1.</span> Information We Collect
                        </h2>
                        <div className="bg-surface/50 border border-white/5 rounded-2xl p-6">
                            <p>
                                <span className="text-white font-semibold">Automatically Collected Information:</span> When you visit our website, certain technical data such as your IP address, browser type, device characteristics, and timestamps may be collected automatically for security and analytics purposes.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            <span className="text-primary">2.</span> Cookies and Third-Party Advertising
                        </h2>
                        <div className="space-y-4">
                            <p>
                                We use cookies to enhance your experience. Furthermore, we use <span className="text-white font-medium">Google AdSense</span> to display ads on our site.
                            </p>
                            <p>
                                Google, as a third-party vendor, uses cookies to serve ads on our site.
                            </p>
                            <p>
                                Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
                            </p>
                            <p className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                                <span className="text-primary font-bold mr-2">Tip:</span>
                                Users may opt out of personalized advertising by visiting{" "}
                                <a 
                                    href="https://myadcenter.google.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-semibold"
                                >
                                    Google&apos;s Ads Settings
                                </a>.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            <span className="text-primary">3.</span> How We Use Your Information
                        </h2>
                        <p>
                            We use the information we collect to operate and maintain ABI Builder, improve the user experience, and comply with legal obligations.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            <span className="text-primary">4.</span> Sharing Your Information
                        </h2>
                        <p>
                            We do not sell your personal information to third parties. We may share information with trusted third-party vendors (e.g., hosting services, analytics, and advertising partners like Google) who assist us in operating our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                            <span className="text-primary">5.</span> Contact Us
                        </h2>
                        <p>
                            If you have questions or comments about this policy, you may email us at:{" "}
                            <a href="mailto:contact@zleep.dev" className="text-primary hover:underline font-bold">
                                contact@zleep.dev
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

