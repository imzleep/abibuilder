export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string; // Opt-in image
  content: string; // Markdown or HTML representation of the body
  author: string;
  authorDisplayName?: string;
  linkOverride?: string; // If set, GuideCard will navigate to this path
}

export const guides: Guide[] = [
  {
    id: "g-1",
    slug: "3x3-missions-guide",
    title: "Complete 3x3 Missions Guide",
    description: "A comprehensive breakdown of all 3x3 safe container missions, including essential items to keep in your stash, quest paths, and optimal map strategies to unlock your case efficiently.",
    thumbnailUrl: "https://i.imgur.com/hgSpoCc.jpeg", // ABI 3x3 Missions image
    content: "Content will be populated using Imgur links and markdown soon.",
    author: "zleep",
    authorDisplayName: "Zleep",
    linkOverride: "/guides/missions",
  },
  {
    id: "g-2",
    slug: "season-5-economy-guide",
    title: "How To Earn Koen Without Playing The Game (Barter Trades)",
    description: "Learn how to maximize your koen output in Season 5. Detailed analysis of market trends and efficient bartering options.",
    thumbnailUrl: "https://i.imgur.com/eo2GNlj.jpeg",
    content: `
      <p>Welcome to the ultimate passive income guide for Arena Breakout: Infinite! I'm Mohammad, and I used a specific set of market and contact trades to make over 100 million Koen—literally without even deploying into a raid.</p>
      <p>If you have ever bankrupted yourself running high-tier gear in the Forbidden Zone (especially on brutal maps like TV Station or Armory), you know how unforgiving the economy can be. Most players think the only way to make money is by surviving high-risk raids. However, by understanding supply, demand, and contact barter trades, you can build massive wealth passively. In this comprehensive guide, I will show you the exact tips, tricks, and secret contact trades I learned to increase your Koen income with minimal effort.</p>
      
      <h2 class="text-4xl md:text-5xl font-extrabold mt-20 mb-12 text-white">The Power of Contact Trading (Arbitrage)</h2>
      <p>Before we dive into the specific items, let's talk about why this works. While everyone knows they can trade with NPC contacts, the vast majority of the player base ignores this mechanic out of laziness. Instead, they choose to buy whatever they need instantly from the flea marketplace at inflated prices.</p>
      <p>While there is nothing wrong with prioritizing convenience, it creates a massive opportunity for smart players. If you spend just 5-10 minutes each day buying barter materials to exchange for high-value items, and then sell those items on the market, you are essentially practicing "arbitrage." You will find yourself making millions of Koen a week. After the Season 4 changes to the contact interface, these trades are easier to spot than ever.</p>
      
      <div class="p-4 my-6 rounded-lg glass-elevated border-l-4 border-yellow-500">
        <strong class="text-yellow-500">IMPORTANT TIP:</strong><br />
        It is highly recommended that you hold on to each of the traded items in your stash until you have a stack of 5, and then sell them 5 at a time on the market. This strategy ensures you get the absolute most value out of your limited weekly market sell slots.
      </div>
      
      <hr class="border-white/10 my-8" />
      
      <!-- AD -->

      <h2 class="text-4xl md:text-5xl font-extrabold mt-20 mb-12 text-white">Part 1: Limited Contact Trades</h2>
      <p>These trades have global restock timers or personal limits, but they offer the highest profit margins for your time.</p>
      
      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Lyle Moreno's Medical Supplies</h3>
      <p>Lyle is your go-to guy for meds and throwables. These items are mandatory for every single raid, meaning their market demand never drops.</p>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/zVvjiYG.jpeg" alt="STO Surgical Set and EX Painkiller" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>STO Battlefield Surgical Set & EX Painkiller:</strong> These items have a longer restock time, but they both boast incredibly high profit margins. Players are always willing to pay a premium to fix broken limbs quickly.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/m2t6FG0.jpeg" alt="Regen and Endurance Boosters" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>Regen Booster & Endurance Booster:</strong> These stims are restocked 3 at a time. This volume makes them extremely profitable over the week, despite having slightly smaller individual profit margins per unit.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/bMhxkHJ.jpeg" alt="Frag and Offensive Grenades" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>M67 Frag Grenade, GHO 2 Offensive Grenade, & Mk2 Frag Grenade:</strong> Explosives are restocked 3 at a time and are almost always guaranteed to be profitable. Alternatively, you can buy these grenades strictly to use them in your own loadouts, saving yourself a fortune compared to market prices.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Deke Vinson's Limited Time Offers</h3>
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/TYmytC3.jpeg" alt="Deke Vinson Contact" class="rounded-xl border border-white/10 w-full" />
      </div>
      <p>Deke Vinson has a unique mechanic compared to other contacts. He offers a random assortment of limited-time trades each day. He provides 3 different sets of 12 items (for a total of 36 items per day) with a timer between refreshes. Because his demands are randomized, always double-check the material cost versus the current market price. Note that barter materials tend to be much cheaper during off-hours and more expensive during peak gaming hours. Buy low, sell high.</p>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/95tkVlz.jpeg" alt="O3 Heavy Tactical Helmet" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>O3 Heavy Tactical Helmet:</strong> This helmet is a staple for T4/T5 runs. It is almost always profitable to trade and sell.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/LLH665w.jpeg" alt="926 Composite Body Armor" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>926 Composite Body Armor:</strong> This armor has fantastic profit margins. It is also highly effective if you decide to keep it for your own Lockdown or Forbidden zone runs.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/qHDuK6m.jpeg" alt="Heavy Armored Rigs" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>Warrior Heavy Armored Chest Rig, H-Tac A8, H-Tac A9, & Defender M4 Rig:</strong> These are all consistently profitable and highly usable as Tier 5 armor. The Warrior and A8 rigs are especially great if you are running on a budget.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/0vwzBaz.jpeg" alt="Backpacks" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>926 Field Backpack & LUC Expanded Tactical Backpack:</strong> Storage space is everything. Trading for these is drastically cheaper than buying them on the market.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Randall Fisher's Weapon Trades</h3>
      <div class="mt-24 mb-12">
        <img src="https://i.imgur.com/oWf0q7N.jpeg" alt="P90, AR57, and AUG Trades" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>P90, AR57, & AUG:</strong> When you trade for these weapons, do not sell them whole! I highly recommend stripping the weapons down. Remove all their attachments (scopes, grips, suppressors, magazines) and sell the parts separately in stacks of 5. It takes a bit more effort, but it maximizes profit and optimizes your market slots.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <!-- AD -->

      <h2 class="text-4xl md:text-5xl font-extrabold mt-20 mb-12 text-white">Part 2: Unlimited Trades for Mass Profit</h2>
      <p>Unlimited trades are where you can print money if you have the stash space and patience.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24 mb-12">
        <img src="https://i.imgur.com/1OGcDx4.jpeg" alt="56K Helicopter Helmet" class="rounded-xl border border-white/10 w-full object-cover" />
        <img src="https://i.imgur.com/53K50DU.jpeg" alt="6B23 Body Armor" class="rounded-xl border border-white/10 w-full object-cover" />
        <img src="https://i.imgur.com/lnI72mT.jpeg" alt="TM1 Armored Rig" class="rounded-xl border border-white/10 w-full object-cover" />
      </div>
      <ul class="mb-4">
        <li><strong>56K Helicopter Helmet, 6B23 Body Armor, & TM1 Armored Rig:</strong> These three are the absolute best unlimited trades. They are commonly used in standard Tier 4 loadouts, meaning their demand is infinite.</li>
      </ul>
      <p class="mb-24"><strong>The Strategy:</strong> You can buy their required barter materials on the market for significantly cheaper than the market price of the finished item. By doing this, you can earn roughly ~20,000 Koen per item in pure profit just by trading them with Deke. Selling them in stacks of 5 lets you earn ~100,000 Koen per market slot used!</p>
      <p>The best way to execute this is to empty your inventory as much as possible, mass-buy the needed materials from the market, and trade them in bulk. Buying materials first means you will not have to confirm the transaction twice for each trade, saving you time.</p>
      
      <h2 class="text-4xl md:text-5xl font-extrabold mt-20 mb-12 text-white">Conclusion</h2>
      <p>These are the exact methods I used to earn enough money to comfortably play the game after bankrupting myself in the Forbidden TV Station. By utilizing these trades, taking advantage of lazy players, and optimizing your market slots, you too can accumulate millions of Koen without firing a single bullet.</p>
      <p>Once you have your millions, don't forget to head over to the <a href="https://abibuilder.com/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-accent font-bold">ABI Builder</a> to craft the ultimate zero-recoil weapons to dominate your next raid. Good luck, and happy trading!</p>
      
      <!-- AD -->
    `,
    author: "mohammad",
    authorDisplayName: "Mohammad",
  }
];
