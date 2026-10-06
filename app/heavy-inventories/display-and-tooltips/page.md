---
title: "Display and tooltips"
---

# Display and tooltips

Open `/heavyinventories config client` to change your display. These preferences only affect your game; they don't
change the server's weights or rules.

## Weight ring

The default display is a ring behind your XP level. It fills from the bottom as your load increases and remains visible
even at XP level zero.

| Color  | Load                  |
|--------|-----------------------|
| Green  | Below 90% of capacity |
| Yellow | 90% to below 100%     |
| Red    | 100% or more          |

Use **Ring vertical offset** to move the ring and XP number upward together. It accepts whole numbers from 0 to 64 and
defaults to 7. Try 12 if a long XP number feels cramped. Zero puts the XP number at its vanilla height, where the ring
may overlap the bar.

The XP bar itself doesn't move. Hiding the ring restores the XP number's normal position.

## Numbers or both

Change **Weight display** to Numbers for a readout at the bottom right, or Ring and numbers to keep the ring as well.
The readout shows carried weight, capacity, percentage, and encumbrance status.

The three text color settings apply to this numeric readout. Turn off **Enable GUI Overlay** to hide the weight HUD.
Hiding Minecraft's HUD with F1 hides it too.

## HUD integrations

If another mod supplies an HI HUD integration, **Ring renderer** and **Weight readout renderer** choose who draws each
element. Leave a field blank for automatic selection, enter the integration's registration ID to select it, or use
`heavyinventories:default` for HI's built-in display. The two elements can use different owners.

An unavailable or failed owner falls back to HI. These settings choose registered HI integrations; they don't move
another mod's unrelated HUD. Your selected Ring/Numbers/Both mode and overlay visibility still apply.

## Tooltips

Hover over one item to see its weight. Hover over a stack to see the weight of the **whole stack**.

Hold Shift for more detail:

- On a stack, see the weight of one item.
- If the stack isn't full, see what a maximum-sized stack would weigh.

Container tooltips include their contents. Displayed values are rounded for readability, but totals use the full
weights. For example, a weight of 0.053125 displays as 0.05; smaller values such as 0.0053125 display as 0.005.

## Units

Choose pounds, kilograms, or None. Kilograms converts the displayed numbers; None shows the stored numbers without a
unit label. Weights are stored in pounds, and changing this preference doesn't affect your capacity percentage or
movement.

Your preferences are saved in `config/heavyinventories-client.toml`.
