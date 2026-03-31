"use client";

import { useEffect, useState } from "react";
import { getBuildLogs } from "@/app/actions/logs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Loader2, GitCommit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface BuildLogViewerProps {
    buildId: string;
}

export default function BuildLogViewer({ buildId }: BuildLogViewerProps) {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        
        const fetchLogs = async () => {
            setLoading(true);
            const res = await getBuildLogs(buildId);
            if (res.success) {
                setLogs(res.logs || []);
            } else {
                toast.error(res.error || "Failed to load logs");
            }
            setLoading(false);
        };

        fetchLogs();
    }, [open, buildId]);

    const formatChangeValue = (val: any) => {
        if (val === null || val === undefined || val === "") return <span className="text-white/30 italic">empty</span>;
        if (Array.isArray(val)) return <span className="text-white/70">{val.join(", ")}</span>;
        if (typeof val === "object") return <span className="text-white/70">{JSON.stringify(val)}</span>;
        return <span className="text-white">{val}</span>;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full mt-4 py-3 bg-surface/50 hover:bg-surface border border-white/10 rounded-xl flex items-center justify-center gap-2 text-text-secondary hover:text-white transition-all">
                    <History className="w-4 h-4" />
                    View Change History
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-background border-white/10 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Audit History
                    </DialogTitle>
                    <DialogDescription>
                        A complete log of modifications and reviews for this build.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                            Loading logs...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-text-secondary">No history found for this build.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-white/10 ml-4 pl-6 space-y-8">
                            {logs.map((log) => (
                                <div key={log.id} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary z-10" />
                                    
                                    <div className="mb-1 flex items-center justify-between">
                                        <div className="font-bold flex items-center gap-2">
                                            <span className={log.role === 'Admin' ? 'text-red-400' : 'text-primary'}>
                                                {log.username}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-text-secondary">
                                                {log.role}
                                            </span>
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div className="text-sm mb-3">
                                        Action: <span className="font-semibold text-white uppercase">{log.action_type}</span>
                                    </div>

                                    {log.changes && Object.keys(log.changes).length > 0 && (
                                        <div className="bg-black/30 rounded-lg border border-white/5 p-3 text-sm font-mono overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-text-secondary border-b border-white/10">
                                                        <th className="pb-2 font-medium">Field</th>
                                                        <th className="pb-2 font-medium">Old Value</th>
                                                        <th className="pb-2 font-medium">New Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {Object.entries(log.changes).map(([field, diff]: [string, any]) => (
                                                        <tr key={field}>
                                                            <td className="py-2 pr-4 text-primary">{field}</td>
                                                            <td className="py-2 pr-4 line-through opacity-50">{formatChangeValue(diff.old)}</td>
                                                            <td className="py-2 text-green-400">{formatChangeValue(diff.new)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
