export type Weapon = {
    id: string;
    name: string;
    category: string;
    created_at: string;
};

export type Build = {
    id: string;
    user_id: string;
    weapon_id: string;
    title: string;
    build_code: string; // User entered code
    stats: {
        ergonomics: number;
        vertical_recoil: number;
        horizontal_recoil: number;
        accuracy: number;
        range: number;
        weapon_stability: number;
        hip_fire_stability: number;
        muzzle_velocity: number;
    };
    share_code: string; // Generated ID (legacy/internal)
    vote_score: number;
    status: "pending" | "verified" | "rejected";
    created_at: string;
    weapon?: Weapon; // Joined
};
