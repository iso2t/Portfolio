---
title: "Config files"
---

# Config files

Config file names come from `@Config`.

```java
@Config(name = "example", side = Side.CLIENT)
```

generates:

```text
example-client.json5
```

Side suffixes:

- `Side.COMMON`: no suffix
- `Side.CLIENT`: `-client`
- `Side.SERVER`: `-server`

JSON5 is the default format:

```java
ConfigBuilder.build(ExampleConfig.class, MOD_ID);
```

You can pass a file type explicitly:

```java
import com.iso2t.easyconfig.api.files.FileTypes;

ConfigBuilder.build(ExampleConfig.class, MOD_ID, FileTypes.JSON5);
ConfigBuilder.build(ExampleConfig.class, MOD_ID, FileTypes.TOML);
```
