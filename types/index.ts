export interface WeaponBuild {
  id: string;
  title: string; // Build Name
  weaponName: string;
  weaponImage: string;
  price: number;
  buildCode: string;
  stats: {
    v_recoil_control: number; // Vertical Recoil Control (0-100, higher is better)
    h_recoil_control: number; // Horizontal Recoil Control (0-100, higher is better)
    ergonomics: number; // Ergonomics (0-100, higher is better)
    weapon_stability: number; // Weapon Stability (0-100, higher is better)
    accuracy: number; // Accuracy (0-100, higher is better)
    hipfire_stability: number; // Hip-Fire Stability (0-100, higher is better)
    effective_range: number; // Effective Range (meters)
    muzzle_velocity: number; // Muzzle Velocity (m/s)
  };
  tags: string[];
  upvotes: number;
  downvotes: number;
  author: string;
  created_at: string;
  is_bookmarked?: boolean;
  can_delete?: boolean;
  can_edit?: boolean;
  short_code?: string;
}

export interface FilterOptions {
  priceRange: [number, number];
  weaponTypes: string[];
  tags: string[];
  sortBy: 'popular' | 'recent' | 'price-low' | 'price-high';
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  discord_id?: string;
}
