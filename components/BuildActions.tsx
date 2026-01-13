"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { deleteBuildAction } from "@/app/actions/builds";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BuildActionsProps {
    buildId: string;
    buildTitle: string;
    canEdit: boolean;
    canDelete: boolean;
}

export default function BuildActions({ buildId, buildTitle, canEdit, canDelete }: BuildActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const confirmDelete = async () => {
        setIsDeleting(true);
        setShowDeleteDialog(false);

        try {
            const res = await deleteBuildAction(buildId);
            if (res.success) {
                toast.success("Build deleted successfully.");
                router.push("/builds");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to delete build.");
                setIsDeleting(false);
            }
        } catch (err) {
            toast.error("An error occurred.");
            setIsDeleting(false);
        }
    };

    if (!canEdit && !canDelete) return null;

    return (
        <>
            <div className="flex gap-3">
                {/* Edit Button (Mods/Admins Only) */}
                {canEdit && (
                    <button
                        onClick={() => router.push(`/admin/${buildId}`)}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:text-white transition-all font-semibold flex items-center justify-center gap-2 border border-primary/20"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Build
                    </button>
                )}

                {/* Delete Button (Owner/Mods/Admins) */}
                {canDelete && (
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white transition-all font-semibold flex items-center justify-center gap-2 border border-red-500/20"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                    </button>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="glass-elevated border-white/10 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Build?</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete <span className="text-white font-semibold">{buildTitle}</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <button
                            onClick={() => setShowDeleteDialog(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 text-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
