import Script from "next/script";
interface GoogleAdSenseProps {
    publisherId: string;
}

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
    // Only render if a publisher ID is provided.
    if (!publisherId) return null;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
