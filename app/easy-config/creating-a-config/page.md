---
title: "Creating a config"
---

# Creating a config

```java
import com.iso2t.easyconfig.api.Side;
import com.iso2t.easyconfig.api.annotations.Comment;
import com.iso2t.easyconfig.api.annotations.Ignore;
import com.iso2t.easyconfig.api.annotations.Config;
import com.iso2t.easyconfig.api.value.wrappers.BooleanValue;
import com.iso2t.easyconfig.api.value.wrappers.EnumValue;
import com.iso2t.easyconfig.api.value.wrappers.IntegerValue;

@Config(name = "example", side = Side.COMMON)
public class ExampleConfig {
    @Comment(value = "Enable the feature", values = false)
    public BooleanValue enabled = BooleanValue.of(true);

    @Comment("Maximum entries to process")
    public IntegerValue maxEntries = IntegerValue.of(64, 1, 256);
	
    @Ignore // Ignored by the config builder
    public IntegerValue maxAttempts = IntegerValue.of(10);

    @Comment("Feature mode")
    public EnumValue<Mode> mode = EnumValue.of(Mode.NORMAL);

    public enum Mode {
        QUIET,
        NORMAL,
        AGGRESSIVE
    }
}
```

Build the config during mod initialization:

```java
import com.iso2t.easyconfig.api.ConfigBuilder;

public final class ExampleMod {
    public static final String MOD_ID = "examplemod";
    public static ExampleConfig CONFIG;

    public static void init() {
        CONFIG = ConfigBuilder.build(ExampleConfig.class, MOD_ID);
    }
}
```

This loads the config, writes missing values, and saves comments. When using the Fabric or NeoForge artifact, it also
registers the config screen.

Screen registration is handled by the EasyConfig mod artifacts. If you use the standalone Java API outside Minecraft,
configure the config directory through `ConfigPlatform`.

```java
import com.iso2t.easyconfig.api.ConfigPlatform;
import java.nio.file.Path;

ConfigPlatform.configure(Path.of("config"), modId -> {});
```
