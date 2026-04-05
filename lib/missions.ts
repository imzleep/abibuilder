export interface Mission {
  id: string;
  location: string;
  description: string;
  tips?: string;
  lane: number; // 0, 1, 2
  part: number; // 1, 2, 3
  column: number;
  isRecommendedToSkip?: boolean;
  isTeamMission?: boolean;
}

export interface MissionPart {
  name: string;
  lanes: Mission[][];
}

const PART_1_TRACK_1: Mission[] = [
  {
    id: "p1-l0-c0",
    location: "Farm",
    description: "Eliminate 5 militants or Team Annihilation members in Farm.",
    tips: "Killing 5 scavs is enough.",
    lane: 0,
    part: 1,
    column: 0
  },
  {
    id: "p1-l0-c1",
    location: "Farm",
    description: "Team Mission: Search 3 unsearched air drop containers in Farm.\nTeam Mission: Search 3 unsearched military supply cases in Farm.",
    tips: "You can use the interactive map to see where to find them.",
    lane: 0,
    part: 1,
    column: 1,
    isTeamMission: true
  },
  {
    id: "p1-l0-c2",
    location: "Farm",
    description: "Search 20 unsearched containers in Farm.",
    tips: "Just keep searching and you will eventually have it.",
    lane: 0,
    part: 1,
    column: 2
  },
  {
    id: "p1-l0-c3",
    location: "Farm",
    description: "Complete 3 Urgent Missions in Farm.\nSuccessfully extract from Farm 1 time.",
    tips: "You can play Normal Farm to speed up the process.",
    lane: 0,
    part: 1,
    column: 3
  },
  {
    id: "p1-l0-c4",
    location: "Armory",
    description: "Go to the Gas Station in Armory and plant false evidence.\nGo to Sluice in Armory and plant false evidence.\nGo to the Repair Facility in Armory and plant false evidence.\nSuccessfully extract from Armory 1 time.",
    tips: "Play Lockdown and go to the marked locations on your map. Then, you just need to extract.",
    lane: 0,
    part: 1,
    column: 4
  },
  {
    id: "p1-l0-c5",
    location: "Armory",
    description: "Bring Rangefinder Binoculars to the Radar Station in Armory and scout the area within the Armory's walls.\nTeam Mission: Search 1 unsearched small safe in Armory.",
    tips: "Again, this can be finished easily in Lockdown. Don't forget to bring Binoculars into the raid with you.",
    lane: 0,
    part: 1,
    column: 5,
    isTeamMission: true
  },
  {
    id: "p1-l0-c6",
    location: "Airport",
    description: "Eliminate 5 White Wolves in Airport.\nEliminate 5 Blackgold members in Airport.\nSuccessfully extract from Airport 1 time.",
    tips: "It's the inside and outside scavs. Easy to finish on Lockdown.",
    lane: 0,
    part: 1,
    column: 6
  },
  {
    id: "p1-l0-c7",
    location: "Valley",
    description: "Use Blindsight to eliminate enemies 3 times in Distorted Valley.\nUse Transcend to eliminate enemies 3 times in Distorted Valley.",
    tips: "You need to find the skills, then just kill scavs or players.",
    lane: 0,
    part: 1,
    column: 7
  },
  {
    id: "p1-l0-c8",
    location: "Northridge",
    description: "Complete 3 Urgent Missions in Northridge.\nEliminate 8 militants or Team Annihilation members in Northridge.",
    tips: "Again, you can easily do missions and kill scavs on Lockdown.",
    lane: 0,
    part: 1,
    column: 8
  },
  {
    id: "p1-l0-c9",
    location: "Northridge",
    description: "Go to Lakeside Cave in Northridge and place 1 Nom Nom Energy Drink.\nGo to Lakeside Cave in Northridge and place 1 Canned Stew.\nGo to Lakeside Cave in Northridge and place 1 Mk 2 Frag Grenade.\nSuccessfully extract from Northridge 1 time.",
    tips: "Don't forget to bring items with you. Go to the mission mark on your map and interact with the items.",
    lane: 0,
    part: 1,
    column: 9
  }
];

const PART_1_TRACK_2: Mission[] = [
  {
    id: "p1-l1-c0",
    location: "Northridge",
    description: "Fully investigate the Sewage Plant in Northridge.\nFully investigate the Camp Services in Northridge.",
    tips: "You can go to Lockdown to finish this more easily. Go to the marked mission locations, search containers, kill scavs, and wait until it gives you full points.",
    lane: 1,
    part: 1,
    column: 0
  },
  {
    id: "p1-l1-c1",
    location: "Valley",
    description: "Team Mission: In Distorted Valley, resonate with 3 Echo Orbs.\nTeam Mission: In Distorted Valley, turn off 3 Tricolor Lights.",
    tips: "Echo orbs are the black orbs around the map; they emit a loud noise, so keep your ears open. Tricolor lights (traffic lights) can be found all around the map. Make sure they have black smoke on the pole so they turn on, allowing you to turn them off for the mission.",
    lane: 1,
    part: 1,
    column: 1,
    isTeamMission: true
  },
  {
    id: "p1-l1-c2",
    location: "Northridge",
    description: "Investigate the designated room in Building B or D of Northridge Hotel.\nInvestigate the window in Northridge Hotel Building C.\nTeam Mission: Eliminate militants or Team Annihilation members at the Northridge Hotel or Cable Car Station.",
    tips: "Interact with the mission rooms at the Hotel marked on your map. You can also kill scavs there for the second mission. Be careful entering the Hotel as it is a main PVP area.",
    lane: 1,
    part: 1,
    column: 2,
    isTeamMission: true
  },
  {
    id: "p1-l1-c3",
    location: "Valley",
    description: "Experience the first bell toll in Distorted Valley.\nExperience the second bell toll in Distorted Valley.\nObserve the specified location at Noan Courtyard in Distorted Valley.",
    tips: "The first and second bell tolls happen 5 and 10 minutes into the raid. They are very loud and followed by 'Anna' talking. After both bell tolls, head to the top of the courtyard; you'll find the graves at the front where you need to press F.",
    lane: 1,
    part: 1,
    column: 3
  },
  {
    id: "p1-l1-c4",
    location: "TV Station",
    description: "Team Mission: Eliminate 3 White Wolves in TV Station.\nBring out items with a loot value of 750,000 from the Dark Zone.",
    tips: "White Wolves are the scavs that spawn in the long hallway wearing a different uniform. Lockdown has 2 + the one that spawns near Editing, and Forbidden has 3 in the hallway and 1 in Editing.",
    lane: 1,
    part: 1,
    column: 4,
    isTeamMission: true
  },
  {
    id: "p1-l1-c5",
    location: "TV Station",
    description: "Search 10 unsearched document boxes or drawers in TV Station.\nSpray graffiti at the designated location at the main entrance in TV Station.",
    tips: "You can use the interactive map to find document boxes/drawers, though they are easy to find just by roaming. The interaction point at the main entrance is marked on the map; just press F.",
    lane: 1,
    part: 1,
    column: 5
  },
  {
    id: "p1-l1-c6",
    location: "Valley",
    description: "Use Sprawling or Transcend to extract 1 time in Distorted Valley.\nUse Blindsight or Reconstruct to extract 1 time in Distorted Valley.",
    tips: "You only need to have the required abilities equipped and extract with them selected. You can skip this because it takes more than 2 games.",
    lane: 1,
    part: 1,
    column: 6,
    isRecommendedToSkip: true
  },
  {
    id: "p1-l1-c7",
    location: "Farm",
    description: "Team Mission: Eliminate 3 Operators in Farm.",
    tips: "You can go to Lockdown for easier kills and bot players.",
    lane: 1,
    part: 1,
    column: 7,
    isTeamMission: true
  }
];

const PART_1_TRACK_3: Mission[] = [
  {
    id: "p1-l2-c0",
    location: "Valley",
    description: "Search 20 unsearched containers in Distorted Valley.",
    tips: "Just search every container you come across.",
    lane: 2,
    part: 1,
    column: 0
  },
  {
    id: "p1-l2-c1",
    location: "Valley",
    description: "Go to Eastern Farm in Distorted Valley and stay for 45 seconds.\nGo to Small Factory in Distorted Valley and stay for 45 seconds.\nGo to Beach Villa in Distorted Valley and stay for 45 seconds.",
    tips: "Go to the marked locations on your map and stay within the zone until the mission objective is completed.",
    lane: 2,
    part: 1,
    column: 1
  },
  {
    id: "p1-l2-c2",
    location: "Valley",
    description: "Team Mission: Destroy 5 Puppets in Distorted Valley.\nTeam Mission: In Distorted Valley, trigger the weighing of the Devotion Statue 3 times.",
    tips: "The puppets (mannequins) spawn in main POIs and move toward you while you are looking away. Devotion statues are grey pillars with a balance scale. Interact with them, add 1-2 devotions, and then weigh them by pressing the red button.",
    lane: 2,
    part: 1,
    column: 2,
    isTeamMission: true
  },
  {
    id: "p1-l2-c3",
    location: "Valley",
    description: "Team Mission: Search 5 unsearched gym bags in Distorted Valley.\nTeam Mission: Search 5 unsearched suitcases in Distorted Valley.\nSuccessfully extract from Distorted Valley 1 time.",
    tips: "You can use the interactive map or just roam around searching everywhere until you finish. It shouldn't be too hard.",
    lane: 2,
    part: 1,
    column: 3,
    isTeamMission: true
  }
];

const PART_2_TRACK_1: Mission[] = [
  {
    id: "p2-l0-c0",
    location: "Multiple",
    description: "Go to the Grain Trade Center in Farm and stay for 60 seconds.\nGo to the Communication Station in Northridge and stay for 60 seconds.",
    tips: "You can see the exact locations marked on your map.",
    lane: 0,
    part: 2,
    column: 0
  },
  {
    id: "p2-l0-c1",
    location: "Farm",
    description: "In Lockdown or Forbidden Zone, extract from Farm with 300,000 worth of loot in a single raid.\nIn Lockdown or Forbidden Zone, successfully extract from Farm 1 time while overloaded.",
    tips: "Overloaded means your weight indicator is yellow. Good luck!",
    lane: 0,
    part: 2,
    column: 1
  },
  {
    id: "p2-l0-c2",
    location: "ALL",
    description: "Bring out items with a total loot value of 1,000,000 from the Dark Zone (cumulative).",
    tips: "Keep looting and extracting to reach the goal!",
    lane: 0,
    part: 2,
    column: 2
  },
  {
    id: "p2-l0-c3",
    location: "Airport",
    description: "Go to the designated entrance of the Medical Area in Airport and place a marker.\nGo to the second designated entrance of the Medical Area in Airport and place a marker.\nGo to the third designated entrance of the Medical Area in Airport and place a marker.",
    tips: "You can finish this on Lockdown to complete it faster. You'll see the objectives marked on your map.",
    lane: 0,
    part: 2,
    column: 3
  },
  {
    id: "p2-l0-c4",
    location: "Airport",
    description: "Team Mission: Eliminate 10 White Wolves inside the Control Area in Airport.\nSearch 30 unsearched containers in Airport.",
    tips: "The Control Area corresponds to the entire inner circle of the map.",
    lane: 0,
    part: 2,
    column: 4,
    isTeamMission: true
  },
  {
    id: "p2-l0-c5",
    location: "TV Station",
    description: "Go to the Freight Elevator in TV Station and activate the Locator.\nGo to the Parking Lot in TV Station and activate the Locator.",
    tips: "Head to the places marked on your map and interact using F.",
    lane: 0,
    part: 2,
    column: 5
  },
  {
    id: "p2-l0-c6",
    location: "Multiple",
    description: "Successfully extract from TV Station 1 time.\nSuccessfully extract from Airport 1 time.",
    tips: "You can play in Lockdown mode as usual for easier progress.",
    lane: 0,
    part: 2,
    column: 6
  },
  {
    id: "p2-l0-c7",
    location: "Armory",
    description: "Carry a Signal Jammer into Armory.\nEliminate 10 Guard Corps members in Armory while carrying the Signal Jammer.\nPlace 1 Signal Jammer at the Staging Area Sentry Tower in Armory.",
    tips: "Don't forget to bring the Signal Jammer with you into the raid. Guard Corps are the scavs found inside and around the doors.",
    lane: 0,
    part: 2,
    column: 7
  },
  {
    id: "p2-l0-c8",
    location: "Multiple",
    description: "Team Mission: Eliminate 3 Blackgold, White Wolves, or Team Annihilation members with grenades in Airport or TV Station.\nTeam Mission: Eliminate 3 Blackgold, White Wolves, or Team Annihilation members with Molotov cocktails in Airport or TV Station.\nTeam Mission: Affect 3 enemies with flashbangs in Airport or TV Station.",
    tips: "Completing this in TV Station is significantly easier than in Airport. Go to Lockdown with plenty of utility.",
    lane: 0,
    part: 2,
    column: 8,
    isTeamMission: true
  },
  {
    id: "p2-l0-c9",
    location: "ALL",
    description: "Bring out 180 rounds of Class 3 or higher ammo from the Dark Zone.\nBring out 5 optical sights, laser pointers, or weapon-mounted lights from the Dark Zone.",
    tips: "Head to Forbidden TV Station or Airport to find these items on scavs easily.",
    lane: 0,
    part: 2,
    column: 9
  }
];

const PART_2_TRACK_2: Mission[] = [
  {
    id: "p2-l1-c0",
    location: "Airport",
    description: "Complete 3 Urgent Missions in Airport.\nSuccessfully extract from Airport 2 times.",
    tips: "This is a relatively easy objective on Lockdown mode.",
    lane: 1,
    part: 2,
    column: 0
  },
  {
    id: "p2-l1-c1",
    location: "ALL",
    description: "Successfully extract 3 times from Lockdown Zone or higher difficulty raids.\nBring out 15 miscellaneous items categorized as building materials, energy items, or instruments from the Dark Zone.",
    tips: "The second objective can be completed easily on any map by focusing on toolboxes. Relevant items will be marked with an exclamation mark (!). All missions in this track are relatively easy, so you can choose which one to skip based on your preference.",
    lane: 1,
    part: 2,
    column: 1,
    isRecommendedToSkip: true
  },
  {
    id: "p2-l1-c2",
    location: "TV Station",
    description: "Fully investigate TV Station.\nTeam Mission: Search 5 unsearched weapon cases in TV Station.",
    tips: "Keep searching and neutralizing scavs until you've reached the required investigation points. Weapon cases are typically found along the edges of the map.",
    lane: 1,
    part: 2,
    column: 2,
    isTeamMission: true
  },
  {
    id: "p2-l1-c3",
    location: "ALL",
    description: "Team Mission: Eliminate 3 Team Annihilation members in any raid.\nBring out 2 primary weapons from the Dark Zone.",
    tips: "Team Annihilation members are the new white-hooded scavs primarily found in Distorted Valley. You can extract with scav primary weapons to complete the second objective safely.",
    lane: 1,
    part: 2,
    column: 3,
    isTeamMission: true
  },
  {
    id: "p2-l1-c4",
    location: "Farm",
    description: "Complete 3 raids in Farm.\nTeam Mission: Eliminate 1 boss in Farm.",
    tips: "This is best attempted in Normal mode. Look for on-screen notifications for Ajax (check Motel, Loading Area, and Barn). Hecate spawns in Grain Trade Center and Small Hall without a spawn message.",
    lane: 1,
    part: 2,
    column: 4,
    isTeamMission: true
  },
  {
    id: "p2-l1-c5",
    location: "ALL",
    description: "Bring out items with a total loot value of 1,500,000 from the Dark Zone.",
    tips: "Keep looting and extracting to accumulate the target value!",
    lane: 1,
    part: 2,
    column: 5
  }
];

const PART_2_TRACK_3: Mission[] = [
  {
    id: "p2-l2-c0",
    location: "Multiple",
    description: "Eliminate 3 Blackgold, White Wolves, or Team Annihilation members in Airport while dehydrated.\nEliminate 3 Blackgold, White Wolves, or Team Annihilation members in TV Station while having the stimulated, regeneration, or strength boost status.",
    tips: "For the Airport objective, bring the 'Sauce' food item to dehydrate instantly. For the TV Station objective, it is recommended to use all three stims to ensure the status requirement is met.",
    lane: 2,
    part: 2,
    column: 0
  },
  {
    id: "p2-l2-c1",
    location: "Northridge",
    description: "Complete 4 Urgent Missions in Northridge.\nSearch 30 unsearched containers in Northridge.",
    tips: "This should be easy to complete on Lockdown mode. All missions in this track are relatively easy, so you can choose which one to skip based on your preference.",
    lane: 2,
    part: 2,
    column: 1,
    isRecommendedToSkip: true
  },
  {
    id: "p2-l2-c2",
    location: "Armory",
    description: "Retrieve intel from the Control Area on the second floor in Armory.\nSuccessfully extract from the F Control Room in Armory 1 time.",
    tips: "Again, play on Lockdown mode. You will see the locations marked on your map.",
    lane: 2,
    part: 2,
    column: 2
  },
  {
    id: "p2-l2-c3",
    location: "Armory",
    description: "Go to the Eastern Blockade in Armory and set up a roadblock.\nGo to the West Highway in Armory and set up a roadblock.",
    tips: "Interact with the mission locations that are marked on your map.",
    lane: 2,
    part: 2,
    column: 3
  },
  {
    id: "p2-l2-c4",
    location: "Farm",
    description: "Team Mission: Eliminate 5 Operators in Farm.\nInvestigate the Wheatfield Farmhouse in Farm.\nInvestigate the Villa or Grain Trade Center in Farm.",
    tips: "Locating objects while on Lockdown mode is recommended. For investigation missions, keep searching and neutralizing scavs until the objective is completed.",
    lane: 2,
    part: 2,
    column: 4,
    isTeamMission: true
  },
  {
    id: "p2-l2-c5",
    location: "Farm",
    description: "Fully investigate Farm.\nBring out 15 miscellaneous items categorized as flammable, medical items, or paper from the Dark Zone.",
    tips: "Continue playing for the investigation mission. Scavs and drawers often carry the items needed for these missions; they will be marked with an exclamation mark (!).",
    lane: 2,
    part: 2,
    column: 5
  }
];

const PART_3_TRACK_1: Mission[] = [
  {
    id: "p3-l0-c0",
    location: "TV Station",
    description: "Complete 3 raids in TV Station.\nTeam Mission: Eliminate 1 boss in TV Station.",
    tips: "Finding the boss can be quite difficult, especially on Lockdown. Make sure to save your skip since there are harder objectives in the future.",
    lane: 0,
    part: 3,
    column: 0
  },
  {
    id: "p3-l0-c1",
    location: "Airport",
    description: "Eliminate or assist in eliminating a total of 5 Operators in Airport.\nTeam Mission: Search car trunks 5 times in Airport.",
    tips: "Good luck with the PvP! You can find car trunk locations on the interactive map. If playing with a teammate, ensure you damage the enemy at least once or twice to receive the assist credit.",
    lane: 0,
    part: 3,
    column: 1,
    isTeamMission: true
  },
  {
    id: "p3-l0-c2",
    location: "Armory",
    description: "Team Mission: Search 4 unsearched military computers in the Armory Interior.\nTeam Mission: Search 3 unsearched winter coats in the Armory Interior.",
    tips: "This is relatively easy to complete on Lockdown mode. Just rush inside the main facility.",
    lane: 0,
    part: 3,
    column: 2,
    isTeamMission: true
  },
  {
    id: "p3-l0-c3",
    location: "Multiple",
    description: "Go to the Parking Lot in Northridge and place 1 Propane Tank.\nGo to the Radar Station in Armory and place 1 T-147 Individual Communication Device.",
    tips: "Have fun running the simulation on Lockdown. Locations are marked on your map; don't forget to bring the required items with you.",
    lane: 0,
    part: 3,
    column: 3
  },
  {
    id: "p3-l0-c4",
    location: "ALL",
    description: "Bring out 20 miscellaneous items categorized as household items, computer parts, or tools from the Dark Zone.\nDeliver 5 purple or higher-quality household items from the Dark Zone.",
    tips: "Required items will be marked with an exclamation mark (!). The second objective is easier to complete by checking drawers, safes, and jackets.",
    lane: 0,
    part: 3,
    column: 4
  },
  {
    id: "p3-l0-c5",
    location: "ALL",
    description: "Bring out 3 body armors from the Dark Zone.\nBring out 5 helmets from the Dark Zone.\nBring out 3 headsets from the Dark Zone.",
    tips: "You can use scav gear to complete this easily on Lockdown mode.",
    lane: 0,
    part: 3,
    column: 5
  },
  {
    id: "p3-l0-c6",
    location: "TV Station",
    description: "Team Mission: Eliminate 10 Blackgold or White Wolves members with a T192 Short Assault Rifle in TV Station.\nBring out 5 purple or higher-quality electronics from TV Station.",
    tips: "Trust me, unless you really want to challenge yourself, just skip this one for your sanity.",
    lane: 0,
    part: 3,
    column: 6,
    isRecommendedToSkip: true,
    isTeamMission: true
  },
  {
    id: "p3-l0-c7",
    location: "ALL",
    description: "Bring out 5 gold or higher quality flammable or household miscellaneous items from the Dark Zone.\nDeliver 30 electronics brought out from the Dark Zone.\nEarn 1,500,000 Koen from the Market.",
    tips: "For the first objective, completing the urgent mission in the 'Freight Area' on Airport guarantees a Deluxe Tea Set. I recommend saving electronics beforehand to make this easier; if not, scavs, drawers, and safes are your best bet. This is a long and challenging objective; if you have an extra skip available, this is an excellent choice to use it on.",
    lane: 0,
    part: 3,
    column: 7,
    isRecommendedToSkip: true
  }
];

const PART_3_TRACK_2: Mission[] = [
  {
    id: "p3-l1-c0",
    location: "ALL",
    description: "Team Mission: Search 3 unsearched large medical cases in the Dark Zone.\nSearch 5 unsearched containers such as computers in the Dark Zone.",
    tips: "You can find two of these in the library; one at the top near the shop and the second at the bottom by the couches.",
    lane: 1,
    part: 3,
    column: 0,
    isTeamMission: true
  },
  {
    id: "p3-l1-c1",
    location: "Airport",
    description: "Team Mission: Search 6 unsearched safes in Airport.",
    tips: "This can be easily completed on both Forbidden and Lockdown modes.",
    lane: 1,
    part: 3,
    column: 1,
    isTeamMission: true
  },
  {
    id: "p3-l1-c2",
    location: "Armory",
    description: "Eliminate or assist in eliminating a total of 5 Operators in Armory.\nTeam Mission: Search 5 unsearched toolboxes in Armory.",
    tips: "There are plenty of toolboxes everywhere, so good luck with the PvP! If playing with a teammate, remember to damage the enemy at least once or twice to receive the assist credit.",
    lane: 1,
    part: 3,
    column: 2,
    isTeamMission: true
  },
  {
    id: "p3-l1-c3",
    location: "ALL",
    description: "Bring out items with a total loot value of 3,000,000 from the Dark Zone.\nBring out items with a loot value of 500,000 from a single raid in the Dark Zone 3 times.",
    tips: "Keep looting and extracting to accumulate that high value. You can never have enough loot!",
    lane: 1,
    part: 3,
    column: 3
  }
];

const PART_3_TRACK_3: Mission[] = [
  {
    id: "p3-l2-c0",
    location: "ALL",
    description: "In Lockdown or Forbidden Zone, eliminate 15 militants or Team Annihilation members on any map other than Farm.\nTeam Mission: In Lockdown or Forbidden Zone, search 10 unsearched clothing containers on any map.",
    tips: "Choose any map you prefer to eliminate scavs. The same applies to searching for clothing containers.",
    lane: 2,
    part: 3,
    column: 0,
    isTeamMission: true
  },
  {
    id: "p3-l2-c1",
    location: "Multiple",
    description: "Eliminate 10 militants or Team Annihilation members with a FAMAS Assault Rifle in Farm.\nEliminate 2 Operators with a FAMAS Assault Rifle in any raid.",
    tips: "The FAMAS is a powerful weapon; you can find optimized meta builds right here on ABI Builder to make this easier!",
    lane: 2,
    part: 3,
    column: 1
  },
  {
    id: "p3-l2-c2",
    location: "Northridge",
    description: "Go to the Sewage Plant in Northridge and stay for 60 seconds.\nGo to Camp Services in Northridge and stay for 60 seconds.\nGo to Cable Car Station in Northridge and stay for 60 seconds.\nGo to the Northridge Hotel in Northridge and stay for 60 seconds.",
    tips: "Another series of location-based objectives in Northridge. Ensure you stay within the designated zones until the timer for each objective is completed.",
    lane: 2,
    part: 3,
    column: 2
  },
  {
    id: "p3-l2-c3",
    location: "Multiple",
    description: "Pick up 15 food or beverage items in TV Station.\nPlace supplies at the Freight Center in Airport.",
    tips: "These objectives should not take long to complete. Remember to check scavs for food and beverage items.",
    lane: 2,
    part: 3,
    column: 3
  }
];

export async function getMissions(): Promise<MissionPart[]> {
  return [
    {
      name: 'PART 1',
      lanes: [
        PART_1_TRACK_1,
        PART_1_TRACK_2,
        PART_1_TRACK_3
      ]
    },
    {
      name: 'PART 2',
      lanes: [
        PART_2_TRACK_1,
        PART_2_TRACK_2,
        PART_2_TRACK_3
      ]
    },
    {
      name: 'PART 3',
      lanes: [
        PART_3_TRACK_1,
        PART_3_TRACK_2,
        PART_3_TRACK_3
      ]
    },
  ];
}
