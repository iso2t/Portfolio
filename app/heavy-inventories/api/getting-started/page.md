---
title: "Getting started with the API"
---

# Getting started with the API

An HI plugin is a class in your mod that implements `HeavyInventoriesPlugin` or `HeavyInventoriesClientPlugin`. HI
creates it and calls `register` once during initialization. You don't call HI's initializer or construct its
implementation classes.

## Add the API to your project

The Maven repository is `https://maven.iso2t.com/releases`, named `iso2t`. The API uses
`com.iso2t.heavyinventories:api:<api_version>`, following the same convention as EasyConfig.
For this branch, both the API and mod versions are **4.263.0.0-rc.2**, for **Minecraft 26.3 / Java 25**.
The API has its own `api_version` property, so future API and mod versions need not match.

Once this candidate has been published, add the repository and a compile-only dependency in the module containing
your shared integration code. In a Groovy Gradle build:

```groovy
repositories {
    maven {
        name = 'iso2t'
        url = 'https://maven.iso2t.com/releases'
        content { includeGroup 'com.iso2t.heavyinventories' }
    }
}

dependencies {
    compileOnly 'com.iso2t.heavyinventories:api:4.263.0.0-rc.2'
}
```

These are the configured coordinates; configuring publishing does not upload the candidate. Before its first
publication, build HI locally with `gradlew.bat build publishToMavenLocal` (or `./gradlew` on Linux/macOS) and add
`mavenLocal()` to the consuming project's repositories. That lets you test the same coordinates without a remote upload.
Alternatively, use `compileOnly files('libs/heavyinventories-api-4.263.0.0-rc.2.jar')` with a copy from
`api/build/libs`.

Your development project must already supply Minecraft 26.3 classes. The standalone API has Minecraft types in its
signatures; it is not a general Java library that can run without Minecraft.

## Add HI to the development runtime

Use the loader artifact matching your Minecraft version. For the 26.3 Loom and ModDevGradle setups, add this dependency
to the appropriate loader module. These loader jars already include the API classes:

```groovy
// Fabric module
dependencies {
    implementation('com.iso2t.heavyinventories:heavyinventories-fabric-26.3:4.263.0.0-rc.2') {
        transitive = false
    }
}
```

```groovy
// NeoForge module
dependencies {
    implementation('com.iso2t.heavyinventories:heavyinventories-neoforge-26.3:4.263.0.0-rc.2') {
        transitive = false
    }
}
```

Add the `iso2t` repository in those modules too. With these non-transitive dependencies, configure Fabric API and
EasyConfig explicitly as described in [installation](/heavy-inventories/installation). Alternatively, put the built HI loader jar and
its dependencies in your development run's `mods` directory. Use your project's configured run directory, which may
be named `run` or `runs/client`, and set up a dedicated-server run when testing gameplay integrations.

Use the standalone API in shared code and the actual HI mod in loader runs. Don't add both artifacts as runtime
libraries. **Do not put the API jar in `mods`, shade it, or include it in a jar-in-jar dependency.** Sources and
Javadoc classifiers are available for IDE navigation but are not installable mods.

## Write a common plugin

This example gives a player 125 additional pounds of capacity while wearing a netherite chestplate. It is a complete
plugin class:

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.plugin.HIPlugin;
import com.iso2t.heavyinventories.api.plugin.HeavyInventoriesPlugin;
import com.iso2t.heavyinventories.api.plugin.PluginRegistration;
import net.minecraft.resources.Identifier;
import net.minecraft.world.entity.EquipmentSlot;
import net.minecraft.world.item.Items;

@HIPlugin
public final class ExpeditionPlugin implements HeavyInventoriesPlugin {
	@Override
	public Identifier id () {
		return Identifier.fromNamespaceAndPath("expedition", "weights");
	}

	@Override
	public void register (PluginRegistration registration) {
		registration.capacity(Identifier.fromNamespaceAndPath("expedition", "chestplate_capacity"), player -> player.getItemBySlot(EquipmentSlot.CHEST).is(Items.NETHERITE_CHESTPLATE) ? 125 : 0);
	}
}
```

The examples use a mod ID of `expedition`. Replace it with **your actual mod ID**, including in plugin IDs, registration
IDs, and slot IDs. HI verifies that the plugin belongs to the mod whose jar contains it. Each plugin needs a public
no-argument constructor; the implicit constructor above satisfies that requirement.

## Register it with your loader

### Fabric

Add the class name to the `heavyinventories` entrypoint in your mod's existing `fabric.mod.json`. A client plugin goes
in `heavyinventories_client`. This fragment shows the common plugin above and the client plugin
from [HUD integration](/heavy-inventories/api/hud):

```json
{
  "entrypoints": {
    "heavyinventories": [
      "example.expedition.compat.hi.ExpeditionPlugin"
    ],
    "heavyinventories_client": [
      "example.expedition.compat.hi.ExpeditionHudPlugin"
    ]
  }
}
```

Merge these keys with your existing metadata and entrypoints. Omit the client entry if you aren't adding that class. Use
fully qualified class names, not method or field entrypoints. `@HIPlugin` alone does not register a Fabric plugin.

### NeoForge

HI discovers classes marked with `@HIPlugin` in loaded mod jars. No additional event-bus subscription is needed. Mark
client plugins with `@HIPlugin(HIPlugin.Side.CLIENT)` so HI excludes them before class loading on a dedicated server.
The HUD guide includes a complete example.

The same annotated classes can be used on both loaders. A class listed in a Fabric client entrypoint must also have the
client side if it carries an HI annotation.

## Keep HI optional

If your mod should work without HI, keep all HI imports, implemented interfaces, and static initialization in the
integration classes. Don't instantiate those classes or reference their API-typed fields from your normal mod
initializer. HI will discover them when it is installed.

Leave HI out of required loader dependencies in that case. If your mod cannot work without HI, declare it as required in
each loader's metadata. Version constraints belong in that metadata; use the HI build you actually tested.

For an integration that additionally depends on another mod, add `requires = "other_mod_id"` to its `@HIPlugin`
annotation. Multiple required mod IDs can be supplied as an array. HI checks that every listed mod is installed before
loading the integration class on either loader. Fabric still needs the named entrypoint. `requires` checks presence, not
versions.

## What belongs in register

Register providers, HUD hooks, and listeners, and obtain query services through `registration.weights()`. You may retain
those services for later calls on their documented thread. A world is not ready during registration, so don't query
players or calculate inventory weights here.

Don't retain the registrar, register on another thread, or register again after joining a world. Registrations are fixed
when `register` returns and last for the game process.

Plugin IDs must be unique. Hook IDs must be unique within their category across plugins and use the plugin's namespace.
Two container registrations also cannot claim the same item. A failed common registration stops startup rather than
leaving partial gameplay behavior installed. A failed client registration disables that plugin; duplicate client plugin
IDs disable all plugins sharing that ID.

Continue with [weight queries](/heavy-inventories/api/weight-queries), [inventories and capacity](/heavy-inventories/api/inventories-and-capacity),
or [HUD integration](/heavy-inventories/api/hud).
