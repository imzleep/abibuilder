"use client";

import { useState } from "react";
import { Weapon } from "@/types/database";
import { WeaponSelector } from "./WeaponSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveBuildAction } from "@/app/actions/builds";
import { toast } from "sonner";
import { Loader2, Hash, Zap, Target, Move, Gauge } from "lucide-react";

interface BuilderFormProps {
    weapons: Weapon[];
}

export function BuilderForm({ weapons }: BuilderFormProps) {
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [title, setTitle] = useState("");
    const [buildCode, setBuildCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Stats (Default values)
    const [stats, setStats] = useState({
        vertical_recoil: 0,
        horizontal_recoil: 0,
        ergonomics: 0,
        weapon_stability: 0,
        accuracy: 0,
        hip_fire_stability: 0,
        range: 0,
        muzzle_velocity: 0,
    });

    const handleStatChange = (key: keyof typeof stats, value: string) => {
        const numValue = parseFloat(value) || 0;
        setStats((prev) => ({ ...prev, [key]: numValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWeapon) {
            toast.error("Please select a weapon first.");
            return;
        }
        if (!title.trim()) {
            toast.error("Please give your build a title.");
            return;
        }
        if (!buildCode.trim()) {
            toast.error("Please enter the Build Code.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await saveBuildAction({
                weapon_id: selectedWeapon.id,
                title,
                build_code: buildCode,
                stats,
            });

            if (result.success) {
                toast.success("Build saved successfully!");
                setTitle("");
                setBuildCode("");
                setStats({
                    vertical_recoil: 0,
                    horizontal_recoil: 0,
                    ergonomics: 0,
                    weapon_stability: 0,
                    accuracy: 0,
                    hip_fire_stability: 0,
                    range: 0,
                    muzzle_velocity: 0,
                });
                setSelectedWeapon(null);
            } else {
                toast.error(result.error || "Failed to save build.");
            }
        } catch {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Weapon Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1 glass-card border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Target className="h-5 w-5" />
                            Weapon & Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <WeaponSelector
                            weapons={weapons}
                            selectedWeaponId={selectedWeapon?.id || null}
                            onSelect={setSelectedWeapon}
                        />

                        {selectedWeapon && (
                            <div className="space-y-4 pt-4 border-t border-dashed border-border/50 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-muted-foreground">Build Title</Label>
                                    <Input
                                        id="title"
                                        className="bg-muted/50 border-input/50"
                                        placeholder="e.g. Meta M4A1 Laser"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-muted-foreground">Build Code</Label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="code"
                                            className="pl-9 bg-muted/50 border-input/50 font-mono text-primary"
                                            placeholder="A1B2-C3D4"
                                            value={buildCode}
                                            onChange={(e) => setBuildCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Stats Input */}
                {selectedWeapon && (
                    <Card className="lg:col-span-2 glass-card border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Gauge className="h-5 w-5" />
                                Stats Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatInput label="Vertical Recoil" value={stats.vertical_recoil} onChange={(v) => handleStatChange("vertical_recoil", v)} icon={<Move className="h-4 w-4 rotate-90" />} />
                                <StatInput label="Horizontal Recoil" value={stats.horizontal_recoil} onChange={(v) => handleStatChange("horizontal_recoil", v)} icon={<Move className="h-4 w-4" />} />

                                <StatInput label="Ergonomics" value={stats.ergonomics} onChange={(v) => handleStatChange("ergonomics", v)} icon={<Zap className="h-4 w-4" />} />
                                <StatInput label="Weapon Stability" value={stats.weapon_stability} onChange={(v) => handleStatChange("weapon_stability", v)} />

                                <StatInput label="Accuracy" value={stats.accuracy} onChange={(v) => handleStatChange("accuracy", v)} />
                                <StatInput label="Hip-Fire Stability" value={stats.hip_fire_stability} onChange={(v) => handleStatChange("hip_fire_stability", v)} />

                                <StatInput label="Effective Range" value={stats.range} onChange={(v) => handleStatChange("range", v)} suffix="m" />
                                <StatInput label="Muzzle Velocity" value={stats.muzzle_velocity} onChange={(v) => handleStatChange("muzzle_velocity", v)} suffix="m/s" />
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Saving..." : "PUBLISH BUILD"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </form>
    );
}

function StatInput({
    label,
    value,
    onChange,
    icon,
    suffix
}: {
    label: string;
    value: number;
    onChange: (val: string) => void;
    icon?: React.ReactNode;
    suffix?: string;
}) {
    return (
        <div className="space-y-2 group">
            <Label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2 group-focus-within:text-primary transition-colors">
                {icon}
                {label}
            </Label>
            <div className="relative">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-background/30 border-input/30 focus:border-primary/50 text-lg font-mono tracking-tight"
                />
                {suffix && (
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}
