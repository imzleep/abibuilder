
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ABI Meta Builds - Best Weapon Loadouts",
    description: "Discover the current meta for Arena Breakout: Infinite. Filter by weapon, streamer, or playstyle (budget, zero recoil). Vote for the best builds.",
    keywords: [
        "abi meta builds",
        "arena breakout meta builds",
        "best abi weapons",
        "h416 meta build",
        "fal meta build",
        "sj16 meta build",
        "abi best guns",
        "streamer builds",
        "h416 meta", "m4a1 best build", "fal meta recoil", "ak74n budget build",
        "sj16 one tap", "mp5 meta", "mpx meta", "p90 meta run", "t03 meta",
        "meta guns arena breakout infinite", "abi tier list"
    ],
    openGraph: {
        title: "ABI Meta Builds - Arena Breakout Infinite Best Loadouts",
        description: "Find the best weapon configurations voted by the community.",
        url: "https://abibuilder.com/builds",
        images: [{ url: "/logo.png", width: 1200, height: 630, alt: "ABI Meta Builds" }]
    }
};

export default function BuildsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
