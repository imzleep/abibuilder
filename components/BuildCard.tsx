"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, Bookmark, Copy, Trash2, Loader2 } from "lucide-react";
import { WeaponBuild } from "@/types";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import { handleVote, toggleBookmarkAction } from "@/app/actions/interaction";
import { deleteBuildAction } from "@/app/actions/builds";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BuildCardProps {
  build: WeaponBuild & { user_vote?: 'up' | 'down' | null };
  onVote?: (buildId: string, type: 'up' | 'down') => void;
  onBookmark?: (buildId: string) => void;
  onCopy?: (buildId: string) => void;
  onDelete?: (buildId: string) => void;
}

export default function BuildCard({ build, onVote, onBookmark, onCopy, onDelete }: BuildCardProps) {
  const router = useRouter();
  // Use local state for optimistic UI updates
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(build.user_vote || null);
  const [isBookmarked, setIsBookmarked] = useState(build.is_bookmarked || false);
  const [upvotes, setUpvotes] = useState(build.upvotes || 0);
  const [downvotes, setDownvotes] = useState(build.downvotes || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onHandleVote = async (type: 'up' | 'down') => {
    // ... (existing logic)
    const previousVote = userVote;
    const previousUp = upvotes;
    const previousDown = downvotes;

    if (userVote === type) {
      setUserVote(null);
      if (type === 'up') setUpvotes(p => p - 1);
      else setDownvotes(p => p - 1);
    } else {
      setUserVote(type);
      if (type === 'up') {
        setUpvotes(p => p + 1);
        if (previousVote === 'down') setDownvotes(p => p - 1);
      } else {
        setDownvotes(p => p + 1);
        if (previousVote === 'up') setUpvotes(p => p - 1);
      }
    }

    try {
      const res = await handleVote(build.id, type);
      if (!res.success) throw new Error(res.error);
      if (onVote) onVote(build.id, type);
    } catch (err) {
      setUserVote(previousVote);
      setUpvotes(previousUp);
      setDownvotes(previousDown);
      toast.error("You must be logged in to vote.");
    }
  };

  const onHandleBookmark = async () => {
    const prev = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      const res = await toggleBookmarkAction(build.id);
      if (!res.success) throw new Error(res.error);
      if (onBookmark) onBookmark(build.id);
      toast.success(prev ? "Removed from bookmarks" : "Bookmarked!");
    } catch (err) {
      setIsBookmarked(prev);
      toast.error("Login required to bookmark.");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(build.buildCode);
    toast.success("Build code copied!");
    onCopy?.(build.id);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteDialog(false); // Close immediately or wait? Better close, show loader on button is handled by isDeleting if I left it? 
    // Actually isDeleting is useful for the Trash Icon loading state.

    try {
      const res = await deleteBuildAction(build.id);
      if (res.success) {
        toast.success("Build deleted successfully.");
        if (onDelete) {
          onDelete(build.id);
        } else {
          router.refresh();
        }
      } else {
        toast.error(res.error || "Failed to delete build.");
        setIsDeleting(false); // Revert loading if failed
      }
    } catch (err) {
      toast.error("An error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative glass-elevated rounded-xl overflow-hidden transition-all duration-300 animate-fade-in hover:border-primary/30">
        <div className="relative p-4">
          {/* Image Section */}
          <div className="relative mb-3 rounded-lg overflow-hidden bg-surface aspect-[4/3]">
            <img
              src={build.weaponImage || "https://placehold.co/400x300/1a1a1a/666?text=No+Image"}
              alt={build.weaponName}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />

            {/* Price Badge */}
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg glass-elevated font-bold text-sm text-primary border border-primary/30">
              {formatPrice(build.price)}
            </div>
          </div>

          {/* Title & Author */}
          <h3 className="font-display font-bold text-lg mb-1 leading-tight group-hover:text-primary transition-colors truncate">
            {build.title}
          </h3>

          <p className="text-text-secondary text-xs mb-3">
            by <span className="text-primary font-medium">{build.author}</span>
          </p>

          {/* Build Code */}
          <div className="mb-4 p-2.5 glass-elevated rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text-secondary mb-0.5 uppercase tracking-wider font-semibold">Build Code</div>
                <div className="font-mono text-xs font-bold text-primary truncate tracking-wide">{build.buildCode}</div>
              </div>
              <button
                onClick={handleCopyCode}
                className="ml-2 p-1.5 rounded-lg glass hover:bg-primary/20 transition-all duration-300 active:scale-95"
                title="Copy build code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stats Grid - 8 Stats */}
          <div className="grid grid-cols-4 gap-1.5 mb-3 text-xs">
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">V.Rec</div>
              <div className="font-bold text-white text-[10px]">{build.stats.v_recoil_control}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">H.Rec</div>
              <div className="font-bold text-white text-[10px]">{build.stats.h_recoil_control}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Ergo</div>
              <div className="font-bold text-white text-[10px]">{build.stats.ergonomics}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Stab</div>
              <div className="font-bold text-white text-[10px]">{build.stats.weapon_stability}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Acc</div>
              <div className="font-bold text-white text-[10px]">{build.stats.accuracy}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Hip</div>
              <div className="font-bold text-white text-[10px]">{build.stats.hipfire_stability}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Range</div>
              <div className="font-bold text-white text-[10px]">{build.stats.effective_range}</div>
            </div>
            <div className="glass-elevated rounded-md p-1.5 text-center">
              <div className="text-text-secondary text-[8px] uppercase">Vel</div>
              <div className="font-bold text-white text-[10px]">{build.stats.muzzle_velocity}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {build.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-medium border",
                  tag === "Streamer Build"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                    : "glass border-white/10 text-text-secondary"
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer - Voting, Bookmark & Delete */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            {/* Upvote/Downvote */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onHandleVote('up')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all duration-300",
                  userVote === 'up'
                    ? 'bg-success/20 text-success border border-success/50'
                    : 'glass hover:bg-success/10'
                )}
              >
                <ArrowBigUp className="w-4 h-4" fill={userVote === 'up' ? 'currentColor' : 'none'} />
                <span className="font-bold text-xs">{formatNumber(upvotes)}</span>
              </button>

              <button
                onClick={() => onHandleVote('down')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all duration-300",
                  userVote === 'down'
                    ? 'bg-danger/20 text-danger border border-danger/50'
                    : 'glass hover:bg-danger/10'
                )}
              >
                <ArrowBigDown className="w-4 h-4" fill={userVote === 'down' ? 'currentColor' : 'none'} />
                <span className="font-bold text-xs">{formatNumber(downvotes)}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete Button (Conditional) */}
              {build.can_delete && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                  className="p-2 rounded-lg glass hover:bg-red-500/20 hover:text-red-500 transition-all"
                  title="Delete Build"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              )}

              {/* Bookmark */}
              <button
                onClick={onHandleBookmark}
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isBookmarked
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "glass hover:bg-primary/10"
                )}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass-elevated border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Build?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="text-white font-semibold">{build.title}</span>?
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
