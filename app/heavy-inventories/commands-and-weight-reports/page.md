---
title: "Commands and weight reports"
---

# Commands and weight reports

Configuration screens can be opened by any player. Reloading, exporting, and converting require operator permission or
the server console. The console cannot open a screen.

| Command                                        | Use                                                                                    |
|------------------------------------------------|----------------------------------------------------------------------------------------|
| `/heavyinventories config client`              | Open your display preferences                                                          |
| `/heavyinventories config server`              | View gameplay settings; operators can save changes                                     |
| `/heavyinventories reload`                     | Load the server TOML and recalculate weights from already-loaded datapacks and recipes |
| `/heavyinventories reload weight`              | Same as the full Heavy Inventories reload                                              |
| `/heavyinventories reload players`             | Refresh players' carried totals on the next tick                                       |
| `/heavyinventories dump <namespace>`           | Export the namespace's active weights for inspection                                   |
| `/heavyinventories convert legacy <pack_name>` | Convert old namespace weight files into a datapack ZIP                                 |

Use Minecraft's **`/reload`** to load edited datapack files. Reloading player totals or using the Heavy Inventories
reload command is not a substitute for that.

## Export a weight report

Run `/heavyinventories dump minecraft` to inspect vanilla item weights. For modded items, replace `minecraft` with their
namespace. Command completion lists loaded namespaces with items or blocks.

The command writes a JSON report under **`weight-exports`** in the server or instance directory and tells you where it
was saved. On a remote server, the file is on the server.

Use the report to check:

- The final weight assigned to an item.
- Whether it came from an explicit definition, a recipe, or the fallback.
- Which pack and resource supplied a winning definition, where recorded.

Exporting does not change gameplay. The report is a snapshot for inspection, not an installable datapack. To change a
weight, edit its [datapack definition](/heavy-inventories/weight-datapacks), run `/reload`, and export again if needed.
