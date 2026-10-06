---
title: "HUD integration"
---

# HUD integration

Use the client API when your HUD needs to move or replace HI's ring or weight readout. The integration belongs in your
mod. HI doesn't need to recognize your mod by name.

Register through a `HeavyInventoriesClientPlugin`, annotated with `@HIPlugin(HIPlugin.Side.CLIENT)`. Fabric also needs
the `heavyinventories_client` entrypoint from [getting started](/heavy-inventories/api/getting-started). Keep these classes out of your
common initializer and dedicated-server code.

## Owners and decorations

The HUD has two independently controlled elements: `HudElement.RING` and `HudElement.NUMBERS`.

An **owner** supplies the element's layout and rendering. Only one owner wins for each element. Choose ownership when
moving, hiding, or replacing the element.

A **decoration** draws before or after the selected element. Several decorations can run together, in registration-ID
order within each phase. Choose a decoration for a background, border, or extra marker that should follow whichever
owner the player selects. Decorations don't change the layout or XP position.

All layout, rendering, and decoration callbacks run on the **client render thread**. They receive GUI-scaled
coordinates, not physical window pixels.

## Move the ring and keep its artwork

This complete client plugin moves the ring to the top-left, puts a small dark background behind it, and leaves the XP
number at its vanilla position. It doesn't override `render`, so HI draws its normal ring, fill, and colors at the new
position.

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.client.ClientPluginRegistration;
import com.iso2t.heavyinventories.api.client.HeavyInventoriesClientPlugin;
import com.iso2t.heavyinventories.api.client.HudBounds;
import com.iso2t.heavyinventories.api.client.HudContext;
import com.iso2t.heavyinventories.api.client.HudElement;
import com.iso2t.heavyinventories.api.client.HudIntegration;
import com.iso2t.heavyinventories.api.client.HudLayout;
import com.iso2t.heavyinventories.api.client.HudRegistration;
import com.iso2t.heavyinventories.api.plugin.HIPlugin;
import net.minecraft.resources.Identifier;

@HIPlugin(HIPlugin.Side.CLIENT)
public final class ExpeditionHudPlugin implements HeavyInventoriesClientPlugin {
    @Override
    public Identifier id() {
        return Identifier.fromNamespaceAndPath("expedition", "hud");
    }

    @Override
    public void register(ClientPluginRegistration registration) {
        var hud = registration.hud();
        hud.owner(
            Identifier.fromNamespaceAndPath("expedition", "ring"),
            HudElement.RING, 0, new HudIntegration() {
                @Override
                public HudLayout layout(
                    HudContext context, HudElement element, HudLayout original
                ) {
                    return new HudLayout(new HudBounds(12, 12, 16, 16), true, 0);
                }
            }
        );
        hud.decorate(
            Identifier.fromNamespaceAndPath("expedition", "ring_background"),
            HudElement.RING, HudRegistration.Phase.BEFORE,
            (graphics, context, layout) -> {
                var bounds = layout.bounds();
                graphics.fill(
                    bounds.x() - 2, bounds.y() - 2,
                    bounds.x() + bounds.width() + 2,
                    bounds.y() + bounds.height() + 2, 0x88000000
                );
            }
        );
    }
}
```

The background is an independent decoration: it follows the selected ring owner, including HI's built-in renderer. If a
background should appear only with your own renderer, draw it inside that owner's `render` method instead.

## Layout and XP positioning

`HudLayout` contains `bounds`, `visible`, and `xpOffset`. Bounds describe a top-left position and occupied width/height
in GUI pixels. Width and height cannot be negative; off-screen positions are allowed.

The normal ring is **16 by 16 pixels**. Changing bounds alone doesn't resize its artwork. The built-in numeric readout
starts at the top of its bounds and aligns to the right edge. If moving numbers, preserve the original width and height
unless you also replace their drawing.

Only the ring layout controls XP displacement. Positive `xpOffset` moves the XP number upward; zero leaves it in its
vanilla position. The numeric layout must use zero. HI uses the ring's resolved layout for both drawing and XP
positioning, so don't move XP again from another callback.

To hide an element, return `new HudLayout(original.bounds(), false, 0)`. A hidden layout must have zero XP offset. An
empty `render` method suppresses artwork but does not hide the layout, its decorations, or its XP offset.

HI calls a selected owner's layout at most once per element per GUI frame. `HudContext.ring()` and `numbers()` contain
HI's original proposed layouts, not another owner's resolved layout. The `layout` passed to rendering is your selected
result. Use `screenWidth()` and `screenHeight()` for positioning relative to the current scaled GUI.

## Replace the ring with a bar

Use this class as the integration argument to your ring's `hud.owner` registration instead of the anonymous layout
above. It occupies a 72 by 6 area and draws a bounded fill while retaining the actual unclamped load ratio for threshold
selection.

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.client.HudBounds;
import com.iso2t.heavyinventories.api.client.HudContext;
import com.iso2t.heavyinventories.api.client.HudDrawing;
import com.iso2t.heavyinventories.api.client.HudElement;
import com.iso2t.heavyinventories.api.client.HudIntegration;
import com.iso2t.heavyinventories.api.client.HudLayout;
import net.minecraft.client.gui.GuiGraphicsExtractor;

public final class LoadBar implements HudIntegration {
	@Override
	public HudLayout layout (HudContext context, HudElement element, HudLayout original) {
		return new HudLayout(new HudBounds(12, 12, 72, 6), true, 0);
	}

	@Override
	public void render (GuiGraphicsExtractor graphics, HudContext context, HudLayout layout, HudDrawing drawing) {
		var bounds = layout.bounds();
		int x = bounds.x();
		int y = bounds.y();
		graphics.fill(x, y, x + bounds.width(), y + bounds.height(), 0xCC202020);
		var ratio = context.player().orElseThrow().loadRatio();
		if (ratio.isEmpty()) {
			for (int offset = 0; offset < bounds.width(); offset += 8) {
				graphics.fill(x + offset, y, x + offset + 4, y + bounds.height(), 0xFFFFAA00);
			}
			return;
		}
		double load = ratio.orElseThrow();
		int color = load >= 1 ? 0xFFFF5555 : load >= 0.9 ? 0xFFFFFF55 : 0xFF55FF55;
		int width = (int) Math.round(Math.clamp(load, 0, 1) * bounds.width());
		graphics.fill(x, y, x + width, y + bounds.height(), color);
	}
}
```

The amber stripes mean incomplete weight; they don't represent a measured load. This example uses fixed vanilla-style
colors. To preserve the player's HI color choices and native artwork, use the drawing helpers instead.

The owner intentionally omits `drawing.drawDefault()`, so HI doesn't also draw its ring. Replacing only the ring leaves
the numeric element available for incomplete-weight feedback, even in Ring mode. If you replace the numbers too,
preserve a useful incomplete-state message in your own renderer.

## Drawing helpers

| Helper                              | Use                                                                   |
|-------------------------------------|-----------------------------------------------------------------------|
| `drawDefault()`                     | Draw the owned element once at its resolved layout                    |
| `ring(graphics, x, y, snapshot)`    | Draw HI's native ring with its fill and colors at a top-left position |
| `numbers(graphics, x, y, snapshot)` | Draw the local-format readout right-aligned at x, starting at y       |

The helpers don't invoke owners or decorations again. They are available only during the current owner render callback,
on its thread, with its supplied graphics object. Do not store them for another HUD event or frame. Calling
`drawDefault()` twice is an error; drawing a helper plus a separate normal element can also create a duplicate display,
so decide which owner is responsible for each drawing.

## Player choice and competing owners

Client settings expose **Ring renderer** and **Weight readout renderer**. Their TOML fields are `ringowner` and
`numbersowner`.

| Selection                                    | Result                                                     |
|----------------------------------------------|------------------------------------------------------------|
| Blank                                        | Highest-priority owner; ties use ascending registration ID |
| A registration ID, such as `expedition:ring` | That exact owner                                           |
| `heavyinventories:default`                   | HI's built-in layout and drawing                           |
| Missing or disabled selected owner           | HI's built-in layout and drawing                           |

The selection uses the **owner registration ID**, not the plugin ID. An automatically selected owner that fails also
falls back to HI; the next integration is not silently promoted. Losing owners don't lay out or render that element.
Decorations remain independent of owner selection.

Priority coordinates registered HI owners. It doesn't detect another mod's HUD overlap or move unrelated elements. Both
loaders expose HI layer IDs `heavyinventories:weight_ring` and `heavyinventories:weight` for loader-side ordering needs.

## Visibility and failure handling

HI still respects overlay-off, F1, Creative/Spectator, open screens, and unavailable synchronized state. Owners cannot
use `visible = true` to bypass those rules. The player's Ring/Numbers/Both mode also applies. `ringEnabled()` and
`numbersEnabled()` describe that preference; incomplete-weight feedback may make the numeric layout visible in Ring mode
anyway.

HI isolates pose and scissor stacks around callbacks. Don't pop a scissor owned by the caller, and restore any other
graphics state you change. Don't retain graphics or frame context for later rendering.

A runtime or linkage failure disables the failing owner or decoration until the game restarts and logs it once. A layout
failure uses HI's layout immediately. A render failure restores the default on subsequent frames; already-submitted
drawing in the failed frame cannot be removed. See [testing an integration](/heavy-inventories/api/testing) for GUI scale, visibility,
failure, and ownership checks.
