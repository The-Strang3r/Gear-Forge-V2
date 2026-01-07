export const armorIcons = {
  "Netherite Helmet": "img/helmet.png",
  "Netherite Chestplate": "img/chestplate.png",
  "Netherite Leggings": "img/leggings.png",
  "Netherite Boots": "img/boots.png",
};

export const toolIcons = {
  "Netherite Sword": "img/sword.png",
  "Netherite Pickaxe": "img/pickaxe.png",
  "Netherite Axe": "img/axe.png",
  "Netherite Shovel": "img/shovel.png",
  "Netherite Hoe": "img/hoe.png",
  "Mace": "img/mace.png",
  "Trident": "img/trident.png",
  "Bow":  "img/Bow.png",
  "Spear": "img/spear.png"
};

export const armorPieces = [
  {
    name: "Netherite Helmet",
    enchantments: [
      { label: "Protection IV", group: "armor-protection" },
      { label: "Fire Protection IV", group: "armor-protection" },
      { label: "Blast Protection IV", group: "armor-protection" },
      { label: "Projectile Protection IV", group: "armor-protection" },

      "Unbreaking III",
      "Mending",
      "Respiration III",
      "Aqua Affinity I",
      "Thorns III",
    ],
  },
  {
    name: "Netherite Chestplate",
    enchantments: [
      { label: "Protection IV", group: "armor-protection" },
      { label: "Fire Protection IV", group: "armor-protection" },
      { label: "Blast Protection IV", group: "armor-protection" },
      { label: "Projectile Protection IV", group: "armor-protection" },

      "Unbreaking III",
      "Mending",
      "Thorns III",
    ],
  },
  {
    name: "Netherite Leggings",
    enchantments: [
      { label: "Protection IV", group: "armor-protection" },
      { label: "Fire Protection IV", group: "armor-protection" },
      { label: "Blast Protection IV", group: "armor-protection" },
      { label: "Projectile Protection IV", group: "armor-protection" },

      "Unbreaking III",
      "Mending",
      "Swift Sneak III",
      "Thorns III",
    ],
  },
  {
    name: "Netherite Boots",
    enchantments: [
      { label: "Protection IV", group: "armor-protection" },
      { label: "Fire Protection IV", group: "armor-protection" },
      { label: "Blast Protection IV", group: "armor-protection" },
      { label: "Projectile Protection IV", group: "armor-protection" },

      "Unbreaking III",
      "Mending",
      { label: "Depth Strider III", group: "boots-walk" },
      { label: "Frost Walker II", group: "boots-walk" },
      "Soul Speed III",
      "Feather Falling IV",
      "Thorns III",
    ],
  },
];

export const toolPieces = [
  {
    name: "Netherite Sword",
    enchantments: [
      { label: "Sharpness V", group: "sword-damage" },
      { label: "Smite V", group: "sword-damage" },
      { label: "Bane of Arthropods V", group: "sword-damage" },

      "Unbreaking III",
      "Mending",
      "Looting III",
      "Fire Aspect II",
      "Knockback II",
      "Sweeping Edge III",
    ],
  },
  {
    name: "Netherite Pickaxe",
    enchantments: [
      "Efficiency V",
      "Unbreaking III",
      "Mending",
      { label: "Fortune III", group: "pickaxe-miner" },
      { label: "Silk Touch", group: "pickaxe-miner" },
    ],
  },
  {
    name: "Netherite Axe",
    enchantments: [
      "Efficiency V",
      "Unbreaking III",
      "Mending",

      { label: "Sharpness V", group: "axe-damage" },
      { label: "Smite V", group: "axe-damage" },
      { label: "Bane of Arthropods V", group: "axe-damage" },

      { label: "Silk Touch", group: "axe-harvest" },
      { label: "Fortune III", group: "axe-harvest" },
    ],
  },
  {
    name: "Netherite Shovel",
    enchantments: [
      "Efficiency V",
      "Unbreaking III",
      "Mending",
      { label: "Silk Touch", group: "shovel-dig" },
      { label: "Fortune III", group: "shovel-dig" },
    ],
  },
  {
    name: "Netherite Hoe",
    enchantments: [
      "Efficiency V",
      "Unbreaking III",
      "Mending",
      { label: "Fortune III", group: "hoe-harvest" },
      { label: "Silk Touch", group: "hoe-harvest" },
    ],
  },
  {
      name: "Mace",
      enchantments: [
        { label: "Density V", group: "mace-damage" },
        { label: "Breach IV", group: "mace-damage" },
        { label: "Smite V", group: "mace-damage" },
        { label: "Bane of Arthropods V", group: "mace-damage" },

        "Wind Burst III",
        "Fire Aspect II",
        "Unbreaking III",
        "Mending"
      ]
    },
    {
      name: "Trident",
      enchantments: [
        "Impaling V",

        // Pairwise conflicts:
        { label: "Loyalty III", conflictsWith: ["Riptide III"] },
        { label: "Channeling", conflictsWith: ["Riptide III"] },
        { label: "Riptide III", conflictsWith: ["Loyalty III", "Channeling"] },

        "Unbreaking III",
        "Mending"
      ]
    },
    {
      name: "Bow",
      enchantments: [
        { label: "Power V", group: "bow-power" },
        { label: "Punch II", group: "bow-punch" },

        "Flame",

        { label: "Infinity", conflictsWith: ["Mending"] },
        { label: "Mending", conflictsWith: ["Infinity"] },

        "Unbreaking III"
      ]
    },
      {
        name: "Spear",
        comingSoon: true
      }
];

export const trims = ["Trim", "Spire", "Tide", "Ward", "Vex", "Wild", "Rib", "Coast", "Sentry", "Eye", "Snout", "Wayfinder"];
export const colors = ["Color", "Emerald", "Redstone", "Lapis", "Amethyst", "Quartz", "Netherite", "Diamond", "Gold", "Iron", "Copper", "Resin"];
