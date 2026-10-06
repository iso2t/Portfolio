---
title: "Manual control"
---

# Manual control

Use `ConfigManager` directly when you need a custom path or lifecycle:

```java
import com.iso2t.easyconfig.api.files.FileTypes;
import com.iso2t.easyconfig.api.manager.ConfigManager;

ConfigManager<ExampleConfig> manager = new ConfigManager<>(
    ExampleConfig.class,
    configPath,
    FileTypes.JSON5
);

ExampleConfig config = manager.loadAndSave();
manager.save(config);
```

For validation across multiple fields, call `load()`, validate the returned object,
then call `save(config)`. Scalar wrapper values are checked against their types and
ranges during loading; invalid values fail instead of being replaced silently.
Saves replace the file after serialization succeeds.

Useful methods:

- `load()`
- `loadAndSave()`
- `save(config)`
- `loadInto(config)`
- `loadAndSaveInto(config)`
- `schema(config)`
