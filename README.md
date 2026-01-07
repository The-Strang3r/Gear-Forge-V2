# Minecraft Armor & Tool Enchant Planner

A web-based planner for **Minecraft Java Edition (1.21.x+)** that helps players plan optimal enchantments for armor and tools while respecting **real anvil mechanics**, **incompatibilities**, and the **“Too Expensive!”** limit.

Built for practical use on survival servers like **Onemainworld**, with future-version items clearly marked.

---

## ✨ Features

### 🛡️ Armor & ⚒️ Tools Support
- Netherite armor with trims, colors, and full enchant support
- Tools including:
  - Sword, Pickaxe, Axe, Shovel, Hoe
  - **Bow**
  - **Trident**
  - **Mace**
- **Spear** placeholder (future version support)

### ⚙️ Accurate Anvil Math
- Uses **real Java anvil rules**
- Correct handling of:
  - Prior work penalties
  - Book vs item combinations
  - Max enchant levels
  - Treasure enchant costs
- Enforces the **< 40 levels per operation** rule
- Flags impossible setups with **“Too Expensive!”**

### 🧠 Smart Conflict Handling
- Mutually exclusive enchant groups (e.g. Protection types, Fortune vs Silk Touch)
- Pairwise conflicts where applicable:
  - Riptide ↔ Loyalty / Channeling
  - Infinity ↔ Mending
- Conflicting options automatically **gray out** in the UI

### 📊 XP Cost Summary
- Shows:
  - Optimal total XP cost
  - Naive (worst-case) cost
  - Levels saved by optimal combining
- Per-item breakdown

### 📋 Enchant Plan Generator
- Click **Enchant!** to see a step-by-step anvil plan
- Copyable plan for in-game use

### 🎨 UI & UX
- Light / Dark theme toggle
- Responsive layout
- Armor view (2-column grid)
- Tools view (3-column grid)
- Persistent state via localStorage
- Smooth transitions and animations

### 🚧 Version Gating
- Tools not yet available on the server (e.g. **Spear**) are shown as:
  - Disabled
  - Labeled **“Coming soon to Onemainworld!”**
  - Excluded from all logic (XP, conflicts, planner)
