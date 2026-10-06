---
title: "Importing old weights"
---

# Importing old weights

If you have older namespace files such as `weights/minecraft.json`, you can convert their explicit weights into a
datapack. The old `weights` folder is no longer used directly for gameplay.

1. Put your old namespace JSON files in the `weights` folder at the root of the server or Minecraft instance.
2. Run `/heavyinventories convert legacy my_weights` as an operator or from the server console.
3. Find `weight-packs/my_weights.zip` in that same server or instance directory.
4. Copy the ZIP into the world's `datapacks` folder.
5. Run `/reload` and check `/datapack list enabled`. If needed, enable it with
   `/datapack enable "file/my_weights.zip" last`.
6. Check the resulting weights in game or with a [weight report](/heavy-inventories/commands-and-weight-reports).

Conversion creates the ZIP; it doesn't install or enable it. Your original files remain in place.

Choose a pack name of 1–64 lowercase letters, digits, underscores, or hyphens. Existing output ZIPs aren't overwritten,
so use a different name when converting again.

Only explicit weights are converted. Entries without a weight are skipped, and old density settings aren't imported.
Item IDs for absent mods are retained in the pack.

If conversion fails, correct the reported input and try again. Weight reports from the current dump command are not
legacy weight files and cannot be used as conversion input.
