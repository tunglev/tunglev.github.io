---
id: vr-spatial-sonification
title: "Spatial sonification: hear the room"
description: "What if you could hear the shape of a room? I built a Unity / Meta Quest research platform that translates 3D geometry into spatial audio and haptic cues for eyes-free exploration."
date: "May 2024 - May 2025"
readTime: "5 min read + demos"
tags: ["Unity", "C#", "Meta Quest 3", "spatial audio", "HCI research"]
thumbnailBg: "#142019"
thumbnailType: "image"
thumbnailImage: "/src/assets/images/spatial-sonification-cover.svg"
imageCaption: "Conceptual illustration of room geometry translated into spatial audio."
order: 0
demoVideos: ["/src/assets/videos/spatial-sonification/growing-sphere.mp4", "/src/assets/videos/spatial-sonification/multi-room-demo.mp4", "/src/assets/videos/spatial-sonification/room-mapping.mp4"]
demoPosters: ["/src/assets/images/spatial-sonification/growing-sphere-poster.jpg", "/src/assets/images/spatial-sonification/multi-room-demo-poster.jpg", "/src/assets/images/spatial-sonification/room-mapping-poster.jpg"]
demoTitles: ["The growing sphere", "Exploring a virtual room", "Mapping a real room"]
demoCaptions: ["An expanding sphere triggers spatial sounds as it reaches walls and objects. The overhead view makes the encoding visible; the adjacent view shows the headset perspective.", "A moving listener explores another room layout. Geometry and audio emitters are visualized here to help explain an experience designed around nonvisual cues.", "Quest passthrough and MRUK room geometry show the physical-space setup explored alongside the controlled virtual environments."]
---

## The idea

A room has a shape. Sound has direction, pitch, rhythm, and timing. This project asks how to connect the two: **which audio encoding helps someone build a mental map of their surroundings without seeing them?**

At UMass Amherst, I developed the Unity/C# experimentation platform behind that question, working with Philip S. Thomas, Ravi Karkar, VP Nguyen, Paul Davis, and Ryan Boldi. My work connected room geometry, interactive audio encodings, headset controls, and repeatable trial workflows in one configurable environment.

- **20+ virtual room layouts** for exploring unfamiliar spaces and varying the geometry between trials.
- **Global and local spatial cues:** room-scale acoustic sweeps alongside a more focused virtual-cane interaction.
- **Experiment tooling on the headset:** configurable pretest rounds, audio and haptic feedback, and CSV session exports.

The challenge was bigger than making a wall play a sound. It was making different representations of the same space easy to implement, compare, and refine.

## How distance becomes sound

Imagine sending an invisible sphere outward from your head. Each wall or object plays a sound when the sphere reaches it. **Nearby surfaces speak first; distant surfaces answer later.** Spatialized audio supplies direction, while the delay provides a distance cue.

Move the scan radius below to see which surfaces have been reached, or replay the full sweep.

```sonification
growing-sphere
```

The initial prototype used a sphere growing at 0.5 meters per second. I also implemented variations that map **distance to pitch** or **elevation to pitch**, allowing us to explore whether an additional cue makes the spatial information easier to interpret.

## Two scales of awareness

Understanding a room's overall layout and detecting the obstacle immediately in front of you are related but different problems. The platform supports both.

| Approach | Interaction | Information conveyed |
| :--- | :--- | :--- |
| Growing sphere | Trigger an outward acoustic scan | Direction and distance through spatial sound and arrival time |
| Environmental sound | Sequential, continuous, or on-demand wall and object sounds | A surrounding arrangement of acoustic landmarks |
| Local virtual cane | Hold the trigger to probe nearby geometry | Focused proximity cues through distance-to-pitch mappings |

For the local approach, I implemented raycasts associated with the two ears and used the measured distances to control pitch. This gave us a focused interaction to explore alongside the broader room-scale encodings.

## Building the research platform

The system runs in **Unity on Meta Quest 3**, using C#, spatial audio with Meta's head-related transfer functions (HRTFs), and controller input. MRUK room setup experiments connect the concept to scanned physical geometry; controlled virtual rooms make layouts easier to vary and compare.

### Geometry that adapts to the play area

Virtual rooms are fitted to the size and orientation of the drawn play area. I built controls for switching layouts, showing or hiding virtual walls, and adjusting scan speed and range. These controls made the prototype useful as an experimental instrument rather than a single fixed demo.

### Feedback for training and exploration

The platform includes success and collision feedback through audio and haptics, passthrough visibility of the real environment, and a near-wall reveal mechanism. Virtual geometry can be visible during familiarization and hidden when exploring the sound-based interaction.

### A repeatable pretest workflow

A deployable PreTest APK supports configurable round counts and CSV session exports from the headset. This separates basic sound-localization checks from the more complex navigation task and gives researchers a practical way to collect and inspect sessions.

## What early testing taught us

Early stationary testing suggested that **horizontal sound localization was easier than vertical localization** with the native HRTFs. That observation made explicit elevation-to-pitch mappings especially interesting: the audio representation may need to reinforce information that spatial direction alone does not convey clearly.

These were preliminary observations, not a completed navigation study. The next evaluation proposed in the research notes compares encodings using collision rates, path efficiency, and learning over repeated trials. Those measures describe the study direction, not established performance results.

## Why this matters

The long-term opportunity is an interface that gives people a useful sense of space through hearing and touch: for assistive navigation, eyes-free interaction, or awareness beyond the visual field. This prototype explores the encoding and interaction questions that such an interface depends on.

For me, the most interesting engineering work was turning an open research question into something people could actually experience: **put on the headset, enter an unfamiliar room, and start learning its shape through sound.**
