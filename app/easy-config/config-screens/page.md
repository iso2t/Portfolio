---
title: "Config screens"
---

# Config screens

Configs created through `ConfigBuilder` are registered for screen support by default.

Config screens are part of the Minecraft implementation, not the standalone Java API.

Disable screen registration:

```java
import com.iso2t.easyconfig.api.ConfigBuildOptions;

ConfigBuilder.build(
    ExampleConfig.class,
    MOD_ID,
    ConfigBuildOptions.unregistered()
);
```

Set a custom tab title:

```java
ConfigBuilder.build(
    ExampleConfig.class,
    MOD_ID,
    ConfigBuildOptions.defaults().screenTitle("Gameplay")
);
```

Multiple configs registered under the same mod id appear as tabs.

NeoForge uses the native mod-list config button. Fabric uses Mod Menu when it is installed.
