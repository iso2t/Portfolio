---
title: "Nested sections"
---

# Nested sections

Nested classes become sections when they are config-like objects with a no-argument constructor.

```java
@Comment("Debug options")
public Debug debug = new Debug();

public static class Debug {
    @Comment(value = "Show debug output", values = false)
    public BooleanValue enabled = BooleanValue.of(false);
}
```

`@Comment` can be used on fields and nested sections.
