export type RandomizerItem = {
    name: string;
    type: 't0' | 't1' | 't2' | 't3' | 't4' | 't5';
    weight?: number;
};

export const maps: RandomizerItem[] = [
    { name: "Farm", type: "t1", weight: 15 },
    { name: "Northridge", type: "t2", weight: 20 },
    { name: "Armory", type: "t4", weight: 40 },
    { name: "TV Station", type: "t5", weight: 40 },
    { name: "Airport", type: "t3", weight: 40 },
];

export const helmets: RandomizerItem[] = [
    // TIER 1 (t0)
    { name: "T1 Motorcycle", type: "t0" },
    { name: "T1 Fireman", type: "t0" },
    { name: "T1 Safety", type: "t0" },
    // TIER 2 (t1)
    { name: "T2 R. Steel", type: "t1" },
    { name: "T2 PAS", type: "t1" },
    { name: "T2 Retro", type: "t1" },
    { name: "T2 Riot", type: "t1" },
    // TIER 3 (t2)
    { name: "T3 SH12", type: "t2" },
    { name: "T3 F70", type: "t2" },
    { name: "T3 PAS2", type: "t2" },
    // TIER 4 (t3)
    { name: "T4 IND Tac", type: "t3" },
    { name: "T4 KSS Tac", type: "t3" },
    { name: "T4 KSS2 Tac", type: "t3" },
    { name: "T4 56K Heli", type: "t3" },
    // TIER 5 (t4)
    { name: "T5 RSP H.", type: "t4" },
    { name: "T5 AN95", type: "t4" },
    { name: "T5 SH M2 Matzka", type: "t4" },
    // TIER 6 (t5)
    { name: "T6 DOD9 Blast", type: "t5" },
    { name: "T6 SH65", type: "t5" },
    { name: "T6 RST Sp.", type: "t5" },
    { name: "T6 6BNT", type: "t5" }
];

export const bodyArmors: RandomizerItem[] = [
    // TIER 1 (t0)
    { name: "T1 Bulletproof Vest", type: "t0" },
    // TIER 2 (t1)
    { name: "T2 220", type: "t1" },
    { name: "T2 Security", type: "t1" },
    // TIER 3 (t2)
    { name: "T3 H-LC Lwt", type: "t2" },
    { name: "T3 KN Assault", type: "t2" },
    { name: "T3R Sentry3", type: "t2" },
    // TIER 4 (t3)
    { name: "T4 SEK Fortress", type: "t3" },
    { name: "T4 401", type: "t3" },
    { name: "T4 Spartan B", type: "t3" },
    { name: "T4R tm1", type: "t3" },
    { name: "T4R tm2", type: "t3" },
    // TIER 5 (t4)
    { name: "T5 926 Com.", type: "t4" },
    { name: "T5 HLC Tac", type: "t4" },
    { name: "T5 bt6 heavy", type: "t4" },
    { name: "T5R Defender M4", type: "t4" },
    { name: "T5R H-Tac A9", type: "t4" },
    // TIER 6 (t5)
    { name: "T6 Marshal H.", type: "t5" },
    { name: "T6 BT101", type: "t5" },
    { name: "T6R AL Tactical", type: "t5" },
    { name: "T6R Spartan C", type: "t5" }
];

export const weapons: RandomizerItem[] = [
    // TIER 0 (t0)
    { name: "usas12", type: "t0", weight: 20 },
    { name: "ace31", type: "t0", weight: 20 },
    // TIER 1 (t1)
    { name: "MPX", type: "t1", weight: 20 },
    { name: "PP19", type: "t1", weight: 20 },
    { name: "AK-74N", type: "t1", weight: 20 },
    // TIER 2 (t2)
    { name: "sj16", type: "t2", weight: 30 },
    { name: "m16", type: "t2", weight: 30 },
    { name: "AN-94", type: "t2", weight: 30 },
    // TIER 3 (t3)
    { name: "m24", type: "t3", weight: 40 },
    { name: "vss", type: "t3", weight: 40 },
    { name: "FAL", type: "t3", weight: 40 },
    { name: "AEK", type: "t3", weight: 40 },
    // TIER 4 (t4)
    { name: "mk14", type: "t4", weight: 50 },
    { name: "m110", type: "t4", weight: 50 },
    { name: "M4A1", type: "t4", weight: 50 },
    { name: "G3", type: "t4", weight: 50 },
    { name: "T03", type: "t4", weight: 50 },
    { name: "T951", type: "t4", weight: 50 },
    // TIER 5 (t5)
    { name: "H416", type: "t5", weight: 60 },
    { name: "AK-12", type: "t5", weight: 60 },
    { name: "P-90", type: "t5", weight: 60 }
];

export const tierWeights = {
    't0': 5,
    't1': 10,
    't2': 20,
    't3': 60,
    't4': 60,
    't5': 15
};
