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
    thumbnailUrl: "/guide_images/hgSpoCc.png", // ABI 3x3 Missions image
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
    thumbnailUrl: "/guide_images/eo2GNlj.jpeg",
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
        <img src="/guide_images/zVvjiYG.png" alt="STO Surgical Set and EX Painkiller" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>STO Battlefield Surgical Set & EX Painkiller:</strong> These items have a longer restock time, but they both boast incredibly high profit margins. Players are always willing to pay a premium to fix broken limbs quickly.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/m2t6FG0.png" alt="Regen and Endurance Boosters" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>Regen Booster & Endurance Booster:</strong> These stims are restocked 3 at a time. This volume makes them extremely profitable over the week, despite having slightly smaller individual profit margins per unit.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/bMhxkHJ.png" alt="Frag and Offensive Grenades" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>M67 Frag Grenade, GHO 2 Offensive Grenade, & Mk2 Frag Grenade:</strong> Explosives are restocked 3 at a time and are almost always guaranteed to be profitable. Alternatively, you can buy these grenades strictly to use them in your own loadouts, saving yourself a fortune compared to market prices.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Deke Vinson's Limited Time Offers</h3>
      <div class="mt-24 mb-12">
        <img src="/guide_images/TYmytC3.png" alt="Deke Vinson Contact" class="rounded-xl border border-white/10 w-full" />
      </div>
      <p>Deke Vinson has a unique mechanic compared to other contacts. He offers a random assortment of limited-time trades each day. He provides 3 different sets of 12 items (for a total of 36 items per day) with a timer between refreshes. Because his demands are randomized, always double-check the material cost versus the current market price. Note that barter materials tend to be much cheaper during off-hours and more expensive during peak gaming hours. Buy low, sell high.</p>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/95tkVlz.png" alt="O3 Heavy Tactical Helmet" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>O3 Heavy Tactical Helmet:</strong> This helmet is a staple for T4/T5 runs. It is almost always profitable to trade and sell.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/LLH665w.png" alt="926 Composite Body Armor" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>926 Composite Body Armor:</strong> This armor has fantastic profit margins. It is also highly effective if you decide to keep it for your own Lockdown or Forbidden zone runs.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/qHDuK6m.png" alt="Heavy Armored Rigs" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>Warrior Heavy Armored Chest Rig, H-Tac A8, H-Tac A9, & Defender M4 Rig:</strong> These are all consistently profitable and highly usable as Tier 5 armor. The Warrior and A8 rigs are especially great if you are running on a budget.</li>
      </ul>
      
      <div class="mt-24 mb-12">
        <img src="/guide_images/0vwzBaz.png" alt="Backpacks" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>926 Field Backpack & LUC Expanded Tactical Backpack:</strong> Storage space is everything. Trading for these is drastically cheaper than buying them on the market.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Randall Fisher's Weapon Trades</h3>
      <div class="mt-24 mb-12">
        <img src="/guide_images/oWf0q7N.png" alt="P90, AR57, and AUG Trades" class="rounded-xl border border-white/10 w-full" />
      </div>
      <ul class="mb-24">
        <li><strong>P90, AR57, & AUG:</strong> When you trade for these weapons, do not sell them whole! I highly recommend stripping the weapons down. Remove all their attachments (scopes, grips, suppressors, magazines) and sell the parts separately in stacks of 5. It takes a bit more effort, but it maximizes profit and optimizes your market slots.</li>
      </ul>
      
      <hr class="border-white/10 my-8" />
      
      <!-- AD -->

      <h2 class="text-4xl md:text-5xl font-extrabold mt-20 mb-12 text-white">Part 2: Unlimited Trades for Mass Profit</h2>
      <p>Unlimited trades are where you can print money if you have the stash space and patience.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24 mb-12">
        <img src="/guide_images/1OGcDx4.png" alt="56K Helicopter Helmet" class="rounded-xl border border-white/10 w-full object-cover" />
        <img src="/guide_images/53K50DU.png" alt="6B23 Body Armor" class="rounded-xl border border-white/10 w-full object-cover" />
        <img src="/guide_images/lnI72mT.png" alt="TM1 Armored Rig" class="rounded-xl border border-white/10 w-full object-cover" />
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
  },
  {
    id: "g-3",
    slug: "ammo-resets-guide",
    title: "The Professional’s Guide to Ammo Resets in Arena Breakout Infinite (ABI)",
    description: "While most players gamble their gear in the Dark Zone, elite \"Ammo Traders\" generate millions of Koen daily through calculated market manipulation. This comprehensive guide combines advanced timing strategies with inventory \"hacks\" to turn you into a market mogul.",
    thumbnailUrl: "/guide_images/ammos.png",
    content: `
      <p>In the high-stakes world of Arena Breakout Infinite (ABI), true wealth isn't just found on the bodies of your enemies; it’s built within the market menus. While most players gamble their gear in the Dark Zone, elite "Ammo Traders" generate millions of Koen daily through calculated market manipulation. This comprehensive guide combines advanced timing strategies with inventory "hacks" to turn you into a market mogul.</p>

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">1. The Core Philosophy: Buying the Dip</h2>
      <p>The ABI market is driven by Market Resets. During these periods, the game refreshes the supply of high-tier ammunition (like 995 rounds), causing prices to plummet briefly. Your goal is to buy at the "floor" (the lowest price) and sell at the "ceiling" (the peak price).</p>

      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">The Master Reset Schedule</h3>
      <p>To succeed, you must track the Sydney (AEST) Time zone.</p>
      <ul class="mb-8">
        <li><strong>The 15:50 (3:50 PM) Reset:</strong> An "Uncertain Reset." It is influenced by active player counts. It might not happen every day, but you should always be watching.</li>
        <li><strong>The 18:50 – 19:30 Window:</strong> This is the First Guaranteed Reset. Once this hits, the "Hourly Rule" begins.</li>
        <li><strong>The Hourly Intervals:</strong> After the first guaranteed reset, the market will refresh every hour (e.g., 20:30, 21:30, 22:30) for at least four consecutive cycles.</li>
        <li><strong>The 7th Reset:</strong> A final, non-guaranteed reset that occurs late in the cycle.</li>
      </ul>
      <p>Shoutout to Mr. DeanPo you can check reset timers in his discord here: <a href="https://discord.com/invite/deanpo" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-accent font-bold">https://discord.com/invite/deanpo</a></p>

      <!-- AD -->

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">2. The "Market Mogul" Loadouts: Maximizing Transport Efficiency</h2>
      <p>To trade at the highest level, you need to move thousands of rounds at once. Whether you are doing a "Buy-Cancel" mail trick or simply organizing your massive profits, having the right gear is essential. Below are the specialized loadout codes for the RAL Heavy Military Backpack and the 926 Premium Chest Rig, optimized for different ammo types.</p>

      <div class="mt-24 mb-12">
        <img src="/guide_images/ammoloadout.png" alt="Ammo Loadout Codes" class="rounded-xl border border-white/10 w-full" />
      </div>

      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">The Setup</h3>
      <p>For these builds, we utilize the two largest storage options in the game:</p>
      <ul>
        <li><strong>926 Premium Field Chest Rig:</strong> The king of rigs with 24 slots.</li>
        <li><strong>RAL Heavy Military Backpack:</strong> The ultimate hauler with 50 slots.</li>
      </ul>
      <div class="p-4 my-6 rounded-lg glass-elevated border-l-4 border-yellow-500">
        <strong class="text-yellow-500">IMPORTANT TIP:</strong><br />
        As of the season 5 update, RAL Heavy Military Backpacks have to be crafted and will require you to upgrade your workbench to do so. If your workbench level is not high enough, you can use a LUC Expanded Tactical Backpack instead. (45 slots)
      </div>

      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">📋 Ammo Loadout Codes (Import Ready)</h3>
      <p>In order to use these codes, you will need to go to your storage and find the preset build option under your character. You will find the option to enter a build code inside.</p>
      <ul>
        <li><strong>M995 2x3:</strong> Equipment-3fcapxBFXpJCOf4w4</li>
        <li><strong>M995 3x3:</strong> Equipment-3fcapxBFXpJCOf4l4</li>
        <li><strong>DVC12 2x3:</strong> Equipment-3fcapxBFXpJCOf4c4</li>
        <li><strong>DVC12 3x3:</strong> Equipment-3fcapxBFXpJCOf4e4</li>
        <li><strong>BS 2x3:</strong> Equipment-3fyaiaeOnaH9wf4z4</li>
      </ul>

      <!-- AD -->

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">3. Advanced Efficiency: The "Red Row" Strategy</h2>

      <div class="mt-24 mb-12">
        <img src="/guide_images/notenoughmoney.png" alt="Not Enough Money Red Row" class="rounded-xl border border-white/10 w-full" />
      </div>
      <p><em>(shoutout to l1as_tv <a href="https://www.youtube.com/@L1AS_TV" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-accent font-bold">https://www.youtube.com/@L1AS_TV</a>)</em></p>

      <p>Sitting and staring at numbers is exhausting. Professional traders use their Liquid Cash as a visual alarm.</p>
      <p>By keeping your liquid cash at a specific threshold—typically 33 to 34 Million Koen—you create a "Red Row" indicator. When the ammo price is high, a second row of ammo appears. This row has a red error message, which is where the name of this strategy comes from.</p>
      <p><strong>The Magic Moment:</strong> The second that the second row disappears and turns into a normal purchase button, you know a reset has happened. You don't even need to read the numbers; the UI tells you the price has dropped below your threshold. This allows you to watch YouTube or browse the web on a second monitor while simply glancing at the red alerts.</p>

      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">Storing Excess Wealth</h3>
      <p>If you have too much cash (e.g., 50M+), you need to "hide" it to keep your threshold at 33M.</p>

      <div class="mt-24 mb-12">
        <img src="/guide_images/braceletandpen.png" alt="Golden Pens and Jade Bracelets" class="rounded-xl border border-white/10 w-full" />
      </div>

      <ul>
        <li><strong>Golden Pens & Jade Bracelets:</strong> Buy these items when their market price is close to their vendor sell price. This "freezes" your cash into assets that don't take up much space and can be liquidated instantly.</li>
        <li><strong>Unclaimed Mail:</strong> Keep your profits from the previous day in your mailbox. Do not "Claim All" until you actually need the liquid cash for a buying spree.</li>
      </ul>

      <!-- AD -->

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">4. The Stash Space Hack: The Mail Trick</h2>

      <div class="mt-24 mb-12">
        <img src="/guide_images/ammomail.png" alt="Ammo Mail Trick" class="rounded-xl border border-white/10 w-full" />
      </div>
      <p><em>(Shoutout to <a href="https://www.youtube.com/@L1AS_TV" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-accent font-bold">https://www.youtube.com/@L1AS_TV</a>)</em></p>

      <p>One of the biggest bottlenecks in trading is stash space. High-tier ammo stacks of 120 can quickly fill up even the largest inventories. Here is the professional "Mail Trick" to bypass stash limits:</p>
      <ol class="list-decimal list-inside space-y-2 mb-8">
        <li><strong>Fill your Stash:</strong> Ensure your stash is almost full, leaving only 2 or 3 empty slots.</li>
        <li><strong>Initiate Purchase:</strong> Buy a massive amount of ammo (e.g., 8-10 stacks).</li>
        <li><strong>The Buy-Cancel Flow:</strong> Press "Buy," and immediately press "Cancel" right after.</li>
        <li><strong>Check Mail:</strong> Because your stash didn't have enough room for the full order, the game automatically sends the entire purchase to your In-game Mail.</li>
      </ol>
      <p>This allows you to store thousands of rounds in your mailbox for days, taking up zero stash space and removing the need for expensive magazine backpacks or rigs.</p>

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">5. The Selling Phase: Market Undercutting</h2>
      <p>Buying is only half the battle. You must sell when the market is "dry" (no resets occurring). The golden window for selling is between 03:00 AM and 16:00 PM Sydney Time.</p>

      <h3 class="text-3xl font-bold mt-16 mb-6 text-primary">The 50-Koen Rule</h3>
      <p>To ensure your stock moves instantly, you must undercut the market. If the current lowest price is 6700 Koen, list yours at 6,650. Being the top listing is more important than an extra 50 Koen per round, as it prevents your capital from being locked up during the next reset.</p>

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">6. The Financial Breakdown (Case Study)</h2>
      <p>Let’s look at the math for a standard trade of 5200 rounds of 995 ammunition:</p>
      <ul>
        <li><strong>Purchase Price (Floor):</strong> ~5,800 Koen/round (~30.1M Total)</li>
        <li><strong>Sale Price (Ceiling):</strong> ~7,000 Koen/round (~36.4M Total)</li>
        <li><strong>The Tax Factor:</strong> Every 120-round stack costs roughly 60,000 Koen in taxes and handling fees.</li>
        <li><strong>Total Tax (43 Stacks):</strong> ~2.6 Million Koen.</li>
        <li><strong>Net Profit:</strong> ~4 Million Koen per cycle.</li>
      </ul>
      <p>If you hit four resets a night, you are looking at 16 Million Koen in pure profit for less than 30 minutes of actual "work."</p>

      <h2 class="text-4xl font-extrabold mt-16 mb-8 text-white">7. Summary Checklist for Success</h2>
      <ul>
        <li><strong>Convert your clock:</strong> Always know the current Sydney time.</li>
        <li><strong>Thresholding:</strong> Keep your cash at 33M to use the "Red Row" visual cue.</li>
        <li><strong>Mail Storage:</strong> Use the Buy-Cancel trick to keep your stash empty and your mail full of ammo.</li>
        <li><strong>Don't Overstay:</strong> If a reset is approaching, stop selling. The price will crash, and you’ll lose money on the listing fee.</li>
        <li><strong>Patience:</strong> The best traders are the ones who can wait for the price peak.</li>
      </ul>
      <p>By mastering these "out-of-raid" mechanics, you ensure that you can always afford the best gear, the best thermal optics, and the most expensive ammo when you finally decide to step back into the Dark Zone. Happy trading!</p>

      <!-- AD -->
    `,
    author: "mohammad",
    authorDisplayName: "Mohammad",
  }
];

