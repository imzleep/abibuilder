"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Weapon } from "@/types/database";

interface WeaponSelectorProps {
    weapons: Weapon[];
    selectedWeaponId: string | null;
    onSelect: (weapon: Weapon) => void;
}

export function WeaponSelector({
    weapons,
    selectedWeaponId,
    onSelect,
}: WeaponSelectorProps) {
    const [open, setOpen] = React.useState(false);

    const selectedWeapon = weapons.find((w) => w.id === selectedWeaponId);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedWeapon ? selectedWeapon.name : "Select weapon..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="bottom" align="start">
                <Command>
                    <CommandInput placeholder="Search weapon..." />
                    <CommandList>
                        <CommandEmpty>No weapon found.</CommandEmpty>
                        <CommandGroup>
                            {weapons.map((weapon) => (
                                <CommandItem
                                    key={weapon.id}
                                    value={weapon.name}
                                    onSelect={() => {
                                        onSelect(weapon);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedWeaponId === weapon.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {weapon.name}
                                    <span className="ml-auto text-xs text-muted-foreground">{weapon.category}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
