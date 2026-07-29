---
id: vr-spatial-sonification
title: "VR Spatial Data Sonification Research"
description: "Ongoing research investigating optimal audio encoding methods for spatial information to enhance environmental awareness through sound."
date: "Spring 2024 - Present"
readTime: "5 min read"
tags: ["VR", "Spatial Audio", "Research", "Assistive Technology"]
thumbnailBg: "#0d1b2a"
thumbnailType: "code"
imageCaption: "System Architecture & Experimental Setup in VR"
order: 2
---

This is an ongoing research project I've been working on alongside Professor Philip S. Thomas, Professor Ravi Karkar, Professor VP Nguyen, Paul Davis, and Ryan Boldi at UMass. I contributed over 2,600 lines of C# code across 32 files.

### Research Objective

We're investigating what audio encoding of spatial information (for a whole room/scenario) best enables someone to be spatially aware of their surroundings. The goal is to develop methods that allow users to understand their environment purely through sound, without visual input.

### Experimental Setup

We use wired headphones in a controlled indoor environment with Meta Quest VR headsets. The testing environment consists of randomly selected preset rooms within a 12x12 foot boundary. This enables controlled testing while maintaining ecological validity.

### Audio Encoding Methods

Two primary approaches were developed, each with three variations:
1. **Growing Sphere Method** — Time-based distance indication with variations for pitch-distance mapping and pitch-elevation mapping.
2. **Environmental Sound Method** — Three approaches to wall/object sonification: sequential sound emission, constant sound emission, and on-demand echolocation-style emission.

### Key Findings

Preliminary results show that in stationary testing, subjects exhibited approximately twice the accuracy in horizontal position determination compared to vertical position identification when using Meta's native HRTFs. This reveals a significant disparity in spatial audio perception between horizontal and vertical planes.

### Impact and Applications

This research has substantial potential for assistive technology — enabling visually impaired individuals to navigate spaces independently through intuitive auditory feedback — as well as safety applications for 360-degree environmental awareness.

### Technologies

Unity (2022.3.11f1), C#, Meta Quest, Meta HRTFs, MRUK