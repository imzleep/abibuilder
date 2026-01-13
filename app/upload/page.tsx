"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createBuildAction, getWeaponsAction } from "@/app/actions/builds";
import { getStreamersAction } from "@/app/actions/admin";
import { compressImage } from "@/lib/image-compression";
import { createClient } from "@/lib/supabase/client";

// Category mapping for display
const categoryLabels: Record<string, string> = {
  "assault-rifle": "Assault Rifle",
  "smg": "SMG",
  "carbine": "Carbine",
  "marksman-rifle": "Marksman Rifle",
  "bolt-action-rifle": "Bolt-Action Rifle",
  "shotgun": "Shotgun",
  "lmg": "LMG",
  "pistol": "Pistol",
};


const availableTags = ["META", "Budget", "Zero Recoil", "Hip Fire Build", "Troll Build"];

export default function UploadBuildPage() {
  const router = useRouter();
  const [buildName, setBuildName] = useState("");
  const [weaponType, setWeaponType] = useState("");
  const [weaponName, setWeaponName] = useState("");
  const [selectedWeaponId, setSelectedWeaponId] = useState(""); // Track ID
  const [fetchedWeapons, setFetchedWeapons] = useState<{ id: string; label: string; value: string; category: string }[]>([]);

  // Derived state to replace old weaponData
  const availableCategories = Array.from(new Set(fetchedWeapons.map(w => w.category))).filter(Boolean);
  const availableWeapons = weaponType
    ? fetchedWeapons.filter(w => categoryLabels[w.category] === weaponType || w.category === weaponType)
    : [];

  useEffect(() => {
    getWeaponsAction().then(data => {
      // Defensive deduplication
      const uniqueData = data.filter((weapon, index, self) =>
        index === self.findIndex((w) => w.label === weapon.label)
      );
      setFetchedWeapons(uniqueData);
    });
  }, []);

  const [buildCode, setBuildCode] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [buildImage, setBuildImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Stats (number inputs)
  const [vRecoil, setVRecoil] = useState("");
  const [hRecoil, setHRecoil] = useState("");
  const [ergonomics, setErgonomics] = useState("");
  const [stability, setStability] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [hipfire, setHipfire] = useState("");
  const [range, setRange] = useState("");
  const [velocity, setVelocity] = useState("");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setUploading(true);
    try {
      // 1. Client-side Compression (WebP, Max 1920px, High Quality)
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        format: 'image/webp'
      });

      // 2. Upload to Supabase
      const supabase = createClient();
      const fileName = `builds/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('build-images')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('build-images')
        .getPublicUrl(fileName);

      setBuildImage(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buildName || !weaponType || !weaponName || !buildCode || !avgPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // MANDATORY Image Check
    if (!buildImage) {
      toast.error("Build Screenshot is REQUIRED! Please upload an official screenshot.");
      return;
    }

    const payload = {
      buildName,
      weaponName,
      weaponId: selectedWeaponId, // Send ID
      buildCode,
      avgPrice,
      description,
      imageUrl: buildImage, // Add image URL
      tags: selectedTags,
      stats: {
        v_recoil_control: parseInt(vRecoil) || 0,
        h_recoil_control: parseInt(hRecoil) || 0,
        ergonomics: parseInt(ergonomics) || 0,
        weapon_stability: parseInt(stability) || 0,
        accuracy: parseInt(accuracy) || 0,
        hipfire_stability: parseInt(hipfire) || 0,
        effective_range: parseInt(range) || 0,
        muzzle_velocity: parseInt(velocity) || 0,
      },
      authorId: selectedAuthorId || undefined, // Send if selected
    };

    const result = await createBuildAction(payload);

    if (result.success) {
      toast.success("Build submitted! It is now pending admin approval and will be published shortly.");
      router.push("/builds");
    } else {
      toast.error(result.error || "Failed to upload build. Check logs.");
    }
  };

  // const availableWeapons = weaponType ? weaponData[weaponType as keyof typeof weaponData] || [] : [];

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [streamers, setStreamers] = useState<any[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");

  // Check Auth & Admin on Mount
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        // Check Admin
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
        if (profile?.is_admin) {
          setIsAdmin(true);
          // Fetch Streamers
          const streamerList = await getStreamersAction();
          setStreamers(streamerList);
        }
      } else {
        toast.error("You must be logged in to upload a build");
        router.push("/login"); // Redirect if not logged in
      }
    };
    init();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar is in layout */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">
            Upload <span className="text-gradient">Build</span>
          </h1>
          <p className="text-text-secondary">
            Share your weapon build with the community
          </p>
        </div>

        {/* Login Notice - Only show if NOT logged in */}
        {!user && (
          <div className="mb-4 p-4 rounded-xl glass border border-primary/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Login Required</p>
              <p className="text-sm text-text-secondary">
                You need to be logged in to upload builds. Click the Login button in the navbar to continue.
              </p>
            </div>
          </div>
        )}

        {/* WARNING Notice */}
        <div className="mb-8 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-danger mb-1">IMPORTANT RULE</p>
            <p className="text-sm text-text-secondary">
              Uploading an official screenshot showing your build stats and parts is <strong>MANDATORY</strong>.
              <br />
              Users uploading invalid or fake images will be <strong>banned from sharing builds</strong>.
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 1. Build Verification (Image Upload) */}
          <div className="glass-elevated rounded-2xl p-6 space-y-6">
            <h2 className="font-display font-bold text-2xl mb-4">Build Screenshot</h2>

            {/* Image Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold mb-2">
                Official Screenshot (Required)
              </label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                <div className={`border-2 border-dashed border-white/10 rounded-xl p-8 transition-colors ${buildImage ? 'bg-black/20' : 'hover:border-primary/50 hover:bg-white/5'}`}>
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-text-secondary">Optimizing & Uploading...</p>
                    </div>
                  ) : buildImage ? (
                    <div className="relative">
                      <img src={buildImage} alt="Build Preview" className="w-full max-h-[400px] object-contain rounded-lg shadow-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                        <p className="text-white font-bold flex items-center gap-2">
                          <Upload className="w-5 h-5" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4 text-primary">
                        <Upload className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Click to upload screenshot</h3>
                      <p className="text-text-secondary text-sm max-w-sm">
                        Max 1920px. Your image will be automatically optimized.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Basic Info Section */}
          <div className="glass-elevated rounded-2xl p-6 space-y-6">
            <h2 className="font-display font-bold text-2xl mb-4">Basic Information</h2>

            {/* Admin: Post as Streamer */}
            {isAdmin && streamers.length > 0 && (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 mb-6">
                <label className="block text-sm font-bold text-accent mb-2">
                  Admin: Post as Streamer calling
                </label>
                <select
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-accent/50 focus:outline-none transition-colors"
                >
                  <option value="" className="bg-surface">Post as Myself ({user?.email})</option>
                  {streamers.map(s => (
                    <option key={s.id} value={s.id} className="bg-surface">
                      {s.username} (Streamer)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Build Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Build Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="e.g., M4A1 Tactical Beast"
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Weapon Type & Weapon Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Weapon Type <span className="text-danger">*</span>
                </label>
                <select
                  value={weaponType}
                  onChange={(e) => {
                    setWeaponType(e.target.value);
                    setWeaponName(""); // Reset weapon name when type changes
                    setSelectedWeaponId("");
                  }}
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                >
                  <option value="" className="bg-surface">Select weapon type</option>
                  {availableCategories.map((cat) => {
                    const label = categoryLabels[cat] || cat;
                    return (
                      <option key={cat} value={label} className="bg-surface">
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Weapon Name <span className="text-danger">*</span>
                </label>
                <select
                  value={weaponName}
                  onChange={(e) => {
                    const selected = availableWeapons.find(w => w.label === e.target.value);
                    setWeaponName(e.target.value);
                    setSelectedWeaponId(selected?.id || "");
                  }}
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                  disabled={!weaponType}
                >
                  <option value="" className="bg-surface">
                    {weaponType ? "Select weapon" : "Select type first"}
                  </option>
                  {availableWeapons.map((weapon) => (
                    <option key={weapon.id || weapon.value} value={weapon.label} className="bg-surface">
                      {weapon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Build Code & Average Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Build Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={buildCode}
                  onChange={(e) => setBuildCode(e.target.value)}
                  placeholder="e.g., 3frMCofJxygGfP4A4"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Average Price ($) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  placeholder="e.g., 45000"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your build, attachments, and playstyle..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="glass-elevated rounded-2xl p-6 space-y-6">
            <h2 className="font-display font-bold text-2xl mb-4">Weapon Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* V Recoil Control */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  V Recoil Control (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={vRecoil}
                  onChange={(e) => setVRecoil(e.target.value)}
                  placeholder="85"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* H Recoil Control */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  H Recoil Control (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hRecoil}
                  onChange={(e) => setHRecoil(e.target.value)}
                  placeholder="82"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Ergonomics */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ergonomics (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ergonomics}
                  onChange={(e) => setErgonomics(e.target.value)}
                  placeholder="75"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Weapon Stability */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Weapon Stability (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stability}
                  onChange={(e) => setStability(e.target.value)}
                  placeholder="88"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Accuracy */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Accuracy (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={accuracy}
                  onChange={(e) => setAccuracy(e.target.value)}
                  placeholder="90"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Hip-Fire Stability */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hip-Fire Stability (0-100) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hipfire}
                  onChange={(e) => setHipfire(e.target.value)}
                  placeholder="65"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Effective Range */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Effective Range (m) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Muzzle Velocity */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Muzzle Velocity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  placeholder="880"
                  className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="glass-elevated rounded-2xl p-6 space-y-6">
            <h2 className="font-display font-bold text-2xl mb-4">Tags</h2>

            <div>
              <p className="text-sm text-text-secondary mb-3">Select tags that describe your build:</p>
              <div className="flex flex-wrap gap-3">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedTags.includes(tag)
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'glass hover:border-primary/50'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-3">
                Note: "Streamer" tag can only be added by admins. Select tags that best describe your build.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Build
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-4 rounded-xl glass hover:border-primary/50 transition-all duration-300 font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
