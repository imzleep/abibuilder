
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ABI Randomizer - Arena Breakout Infinite Generator",
    description: "The ultimate ABI Randomizer. Generate random loadouts, zero to hero runs, and randomized gear for Arena Breakout Infinite. Challenge your skills with RNG builds.",
    keywords: [
        "abirandomizer",
        "arena breakout randomizer",
        "arena breakout infinite randomizer",
        "gear randomizer",
        "loadout randomizer",
        "abi randomizer",
        "zero to hero randomizer",
        "tarkov randomizer clone"
    ],
    openGraph: {
        title: "ABI Randomizer - Arena Breakout Infinite Loadout Generator",
        description: "Spin the wheel for your next Arena Breakout Infinite raid. Random weapons, armor, and maps.",
        url: "https://abibuilder.com/randomizer",
        images: [{ url: "/logo.png", width: 1200, height: 630, alt: "ABI Randomizer" }]
    }
};

export default function RandomizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
