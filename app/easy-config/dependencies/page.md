---
title: "Dependencies"
---

# Dependencies

These examples follow the Minecraft 26.3 README. Choose artifact versions that
match your target Minecraft version and the Easy Config release you use.

Add the Maven repository:

```gradle
repositories {
    maven {
        name = "iso2t"
        url = "https://maven.iso2t.com/releases"
    }
}
```

Fabric:

```gradle
dependencies {
    implementation "com.iso2t.easyconfig:easyconfig-fabric-26.3:1.263.0.8"
}
```

NeoForge:

```gradle
dependencies {
    implementation "com.iso2t.easyconfig:easyconfig-neoforge-26.3:1.263.0.8"
}
```

API only:

```gradle
dependencies {
    implementation "com.iso2t.easyconfig:api:1.263.4.1"
}
```

The Fabric and NeoForge artifacts include the API classes in the built mod jar. Use the standalone `api` artifact only
when you want the Java config API without EasyConfig's Minecraft mod implementation or in-game screens.
