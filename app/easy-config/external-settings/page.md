---
title: "Screens for external settings"
---

# Screens for external settings

Controls are generated from annotated classes. `@Translation` supplies a label key,
an optional tooltip key, and an optional prefix for lowercase enum value names.
Nested classes create sections; typed value wrappers supply defaults and bounds.

```java
@Config(name = "flight", side = Side.CLIENT)
public class FlightConfig {
    @Translation(value = "my_mod.lift", tooltip = "my_mod.lift.tooltip")
    public final FloatValue lift = FloatValue.of(.15f, 0f, 1f);
}

var tab = new ConfigScreenTab<>(title, ConfigIntrospector.inspect(draft),
        this::saveSettings, () -> ConfigIntrospector.inspect(loadDraft()));
var screen = new ConfigScreen(parent, title, List.of(tab));
```

Use an independent draft when changes must wait for Save. The save callback receives
the current draft; reload replaces it. `validation(config -> Optional<Component>)`
can reject relationships between fields, and `editable(() -> allowed)` disables
editing and saving for read-only views. File storage and networking remain with the
consumer when using these callbacks. Normal `ConfigBuilder` registration continues
to use EasyConfig's file-backed manager.
