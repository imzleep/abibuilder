"use client";

import { verifyBuildAction } from "@/app/actions/admin";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ReviewControls({ buildId }: { buildId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (status: "verified" | "rejected") => {
        setLoading(true);
        try {
            const res = await verifyBuildAction(buildId, status);
            if (res.success) {
                toast.success(`Build ${status} successfully!`);
                router.push("/moderator"); // Return to list
                router.refresh();
            } else {
                toast.error(res.error);
                setLoading(false);
            }
        } catch (error) {
            toast.error("An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <button
                onClick={() => handleAction("verified")}
                disabled={loading}
                className="w-full py-4 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Check />}
                Approve & Publish
            </button>
            <button
                onClick={() => handleAction("rejected")}
                disabled={loading}
                className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
                {loading ? <Loader2 className="animate-spin" /> : <X />}
                Reject & Archive
            </button>
        </div>
    );
}
