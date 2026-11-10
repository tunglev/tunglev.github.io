---
id: vr-spatial-sonification
title: "Spatial sonification: can the brain visualize a room using only audio/haptics encoding?"
description: "I engineered a hardware-in-the-loop research platform integrating headset tracking, room geometry, spatial audio, haptic feedback, and on-device experiment logging to investigate nonvisual spatial awareness."
date: "May 2024 - May 2025"
readTime: "5 min read + demos"
tags: ["systems", "hardware in the loop", "research", "VR"]
thumbnailBg: "#142019"
thumbnailType: "image"
thumbnailImage: "/src/assets/images/room-mapping-poster.jpg
imageCaption: "Conceptual illustration of room geometry translated into spatial audio."
order: 2
demoVideos: ["/src/assets/videos/spatial-sonification/growing-sphere.mp4", "/src/assets/videos/spatial-sonification/multi-room-demo.mp4", "/src/assets/videos/spatial-sonification/room-mapping.mp4"]
demoPosters: ["/src/assets/images/spatial-sonification/growing-sphere-poster.jpg", "/src/assets/images/spatial-sonification/multi-room-demo-poster.jpg", "/src/assets/images/spatial-sonification/room-mapping-poster.jpg"]
demoTitles: ["The growing sphere", "Exploring a virtual room", "Mapping a real room"]
demoCaptions: ["One of the encodings explored: an expanding sphere triggers spatial sounds as it reaches walls and objects. The overhead view makes the encoding visible; the adjacent view shows the headset perspective.", "A moving listener explores another room layout. Geometry and audio emitters are visualized here to help explain an experience designed around nonvisual cues.", "Quest passthrough and MRUK room geometry show the physical-space setup explored alongside the controlled virtual environments."]
---

Explore the [project research log on Notion](https://great-crate-eb2.notion.site/spatial-data-sonification-log?pvs=25) for encoding designs, experiment notes, and development history.

## The idea

A room has a shape. Sound has direction, pitch, rhythm, and timing. This project asks how to connect the two: **which audio encoding helps someone build a mental map of their surroundings without seeing them?**

**The growing sphere shown in the demos is one example within a broader exploration of spatial encodings.** The platform also supports sequential wall scans, continuous acoustic landmarks, on-demand spatial pings, and local virtual-cane cues. Comparing these approaches is central to the research question.

At UMass Amherst, I engineered the hardware-integrated experimentation system behind that question, working with Philip S. Thomas, Ravi Karkar, VP Nguyen, Paul Davis, and Ryan Boldi. My work connected tracked headset and controller input, room geometry, configurable encoding algorithms, audio and haptic output, and on-device data collection into a repeatable research workflow.

- **Hardware integration:** tracked headset and controller input coupled to spatial audio, wired headphones, and haptic feedback.
- **Configurable spatial-processing runtime:** 20+ virtual room layouts, room-scale acoustic sweeps, and local raycast-based proximity cues.
- **Research instrumentation:** deployable headset builds, configurable pretest rounds, and CSV session exports for analysis.

The engineering challenge was coordinating geometry, device input, encoding behavior, feedback, and trial configuration so that different representations of the same space could be implemented, compared, and refined on the actual headset.

## How distance becomes sound

This interactive example focuses on the **growing-sphere encoding** to illustrate one way of conveying distance through sound.

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
| Sequential wall scan | Sounds travel along walls before objects play in sequence | Room boundaries and object locations presented one at a time |
| Continuous acoustic landmarks | Walls and objects continuously emit distinct sounds | An ongoing acoustic representation of the surrounding layout |
| On-demand spatial pings | Trigger sounds from nearby objects and surfaces | An immediate snapshot of surrounding acoustic landmarks |
| Local virtual cane | Hold the trigger to probe nearby geometry | Focused proximity cues through distance-to-pitch mappings |

The sequential, continuous, and on-demand approaches are variations of **environmental sonification**. An encoding determines when and where sounds are emitted; a mapping determines how a spatial property changes the sound, such as **distance to pitch** or **elevation to pitch**. Keeping these choices configurable lets us explore different combinations.

For the local approach, I implemented raycasts associated with the two ears and used the measured distances to control pitch. This gave us a focused interaction to explore alongside the broader room-scale encodings.

## Hardware-in-the-loop research system

The experimental loop runs through **physical headset hardware**: tracked movement and controller actions determine the listener position and scan commands; the runtime queries room geometry and applies the selected encoding; headphones and haptics deliver feedback that guides the participant's next action.

| System layer | Tools and interfaces | Engineering responsibility |
| :--- | :--- | :--- |
| Hardware input and output | Meta Quest 3 tracking, controllers, wired headphones, and haptics | Connect physical movement and commands to spatial audio and tactile feedback |
| Geometry and encoding runtime | C# / Unity, MRUK scene data, raycasts, and Meta HRTFs | Query virtual or scanned geometry and translate spatial relationships into configurable sound cues |
| Experiment control | On-headset configuration and deployable APK builds | Select room layouts, encoding parameters, and pretest round counts |
| Data capture | On-device CSV session exports | Make pretest records available for inspection and offline analysis |

MRUK room-setup experiments connect the runtime to scanned physical geometry. Controlled virtual rooms provide a configurable environment for varying layouts while retaining real headset input and audio output in the loop.

### Geometry that adapts to the play area

Virtual rooms are fitted to the size and orientation of the drawn play area. I built controls for switching layouts, showing or hiding virtual walls, and adjusting scan speed and range. This made room geometry and encoding parameters configurable parts of the test environment.

### Feedback for training and exploration

The platform includes success and collision feedback through audio and haptics, passthrough visibility of the real environment, and a near-wall reveal mechanism. Virtual geometry can be visible during familiarization and hidden when exploring the sound-based interaction.

### Deployment and experiment data capture

A deployable PreTest APK supports configurable round counts and writes CSV session records on the headset for export. This gives researchers a repeatable path from device deployment and trial configuration to data collection and offline inspection, with basic sound-localization checks preceding the more complex navigation task.

## What early testing taught us

Early stationary testing suggested that **horizontal sound localization was easier than vertical localization** with the native HRTFs. That observation made explicit elevation-to-pitch mappings especially interesting: the audio representation may need to reinforce information that spatial direction alone does not convey clearly.

These were preliminary observations, not a completed navigation study. The next evaluation proposed in the research notes compares encodings using collision rates, path efficiency, and learning over repeated trials. Those measures describe the study direction, not established performance results.

## Why this matters

The long-term opportunity is an interface that gives people a useful sense of space through hearing and touch: for assistive navigation, eyes-free interaction, or awareness beyond the visual field. This prototype explores the encoding and interaction questions that such an interface depends on.

My contribution was the systems infrastructure that made this research question testable on hardware: **a configurable spatial-processing runtime, integrated headset input and feedback, repeatable trials, and exportable experiment data.**
