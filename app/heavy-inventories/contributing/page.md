---
title: "Contributing"
---

# Contributing

Code, translations, documentation corrections, and reproducible bug reports are welcome
in [iso2t/Heavy-Inventories](https://github.com/iso2t/Heavy-Inventories).

## Build the mod

For the Minecraft 26.3 branch, use **JDK 25** and the Gradle wrapper included in the repository. Import the project as a
Gradle project in your IDE.

Run `gradlew.bat clean build` from the repository root on Windows, or `./gradlew clean build` on Linux or macOS.

The build compiles both loaders, runs the common unit tests, and checks the packaged jars. It doesn't start Minecraft.
Find installable jars in `fabric/build/libs` and `neoforge/build/libs`; don't install the sources, javadoc, or
test-harness jars.

## Test a change

Use `:fabric:runClient` or `:neoforge:runClient` with the Gradle wrapper for a normal development client. Use the
corresponding `runServer` task for a server.

Gameplay changes should be checked on both loaders. For anything involving settings, weight updates, or multiplayer
behavior, test a separate client and server as well as singleplayer.

The repository's [runtime test guide](https://github.com/iso2t/Heavy-Inventories/blob/26.3/tests/README.md) covers the
opt-in gameplay scenarios and log checks. Use disposable worlds: those tests change inventories, settings, permissions,
and fixture datapacks. Dedicated test servers require you to accept Minecraft's EULA.

When editing the developer wiki, run `:tests:compileWikiExamplesJava` with the wiki checked out. It compiles the actual
Java examples against the API jar and Minecraft. Keep examples as complete classes with imports, and update the sidebar
when adding a page.

## Translations

Language files live under `common/src/main/resources/assets/heavyinventories/lang`. Use the English file to find the
current entries. Preserve translation keys and formatting arguments, and check the translated text in tooltips and
settings screens for fit.

## Before opening a pull request

Describe what changes for someone using the mod and how you checked it. Include the Minecraft and loader versions for a
compatibility fix. Keep player-visible release notes in the Unreleased changelog; internal cleanup doesn't need a
release note.

For bugs, include the shortest steps that reproduce the problem, your mod list, and the relevant log. Review logs for
private information before attaching them.
The [repository contributor guide](https://github.com/iso2t/Heavy-Inventories/blob/26.3/docs/CONTRIBUTING.md) has
additional build and release conventions.
