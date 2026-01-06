import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkButton } from "./BookmarkButton";
import { MessageSquare, ThumbsUp } from "lucide-react";
// removed unused Build import

interface BuildCardProps {
    build: {
        id: string;
        title: string;
        stats: {
            ergonomics: number;
            vertical_recoil: number;
            horizontal_recoil: number;
            accuracy: number;
            range: number;
        };
        weapons?: { name: string };
        profiles?: { display_name?: string; avatar_url?: string };
        vote_score?: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bookmarks?: boolean[] | any[]; // keeping loose array but typing content slightly better
    };
    // removed unused currentUserId
}

export function BuildCard({ build }: BuildCardProps) {
    const isBookmarked = build.bookmarks && build.bookmarks.length > 0;

    return (
        <Link href={`/build/${build.id}`} className="block group">
            <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg bg-card">
                {/* Header: Title & Weapon */}
                <CardHeader className="p-4 pb-2 space-y-1">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-background text-xs font-normal text-muted-foreground">
                            {build.weapons?.name || "Unknown Weapon"}
                        </Badge>
                        {/* Bookmark */}
                        <BookmarkButton buildId={build.id} initialBookmarked={!!isBookmarked} />
                    </div>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {build.title}
                    </h3>
                </CardHeader>

                {/* Content: Stats Preview */}
                <CardContent className="p-4 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Recoil</span>
                            <span className="text-foreground font-medium">
                                {build.stats.vertical_recoil}/{build.stats.horizontal_recoil}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Ergo</span>
                            <span className="text-foreground font-medium">{build.stats.ergonomics}</span>
                        </div>
                    </div>
                </CardContent>

                {/* Footer: Author & Interaction */}
                <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={build.profiles?.avatar_url} />
                            <AvatarFallback className="text-[10px]">
                                {build.profiles?.display_name?.slice(0, 2).toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {build.profiles?.display_name || "User"}
                        </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{build.vote_score || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>0</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
