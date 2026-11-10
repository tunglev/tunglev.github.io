# Spatial sonification: notes to myself

The project is published from `src/content/projects/vr-spatial-sonification.md` at `/project/vr-spatial-sonification`. This note is outside the public content directory and is not displayed on the website.

## Already included

- Three original demos at the beginning of the page, selected through a video reel. The Unity captures are cropped to emphasize the room and headset views. All three retain their original audio.
- Web-optimized video files and JPEG posters. Videos load on demand instead of downloading all three when the page opens.
- An original SVG thumbnail showing a conceptual room and acoustic sweep.
- An interactive growing-sphere illustration in “How distance becomes sound.” Its distances and times are explanatory examples, not study measurements.

## Graphics worth adding later

1. **At the top: a 15–25 second narrated demo.** Show the person wearing Quest and wired headphones, then cut to the virtual room. Use short captions: “Scan,” “Listen,” and “Find the obstacle.” Keep the stereo spatial audio intact. Replace the first reel entry after recording; the current clip is a working prototype capture.
2. **After “Two scales of awareness”: a matched comparison.** Record the same virtual room with the growing-sphere and local virtual-cane encodings. Use identical geometry and camera position so readers can compare the sound strategies without learning a new scene each time.
3. **After “Geometry that adapts to the play area”: a room-layout contact sheet.** Capture four to six actual room presets with the same overhead camera. Mark the listener start and target. This would demonstrate the environment variation more directly than another abstract diagram.
4. **After “Deployment and experiment data capture”: a clean headset UI screenshot.** Show the round-count configuration and an anonymized example CSV schema. Remove participant identifiers before adding any real session data.
5. **In “What early testing taught us”: add a measured results chart only when data are available.** Use angular error by horizontal/vertical condition, with participant count, units, uncertainty, and methodology. The supplied notes do not include enough evidence for a reliable quantitative chart.

## Content to verify before adding stronger claims

- The source notes cover May 2024 through May 2025, so that is the date range shown. Update only if there is later work to include.
- The earlier portfolio draft mentions 2,600+ C# lines across 32 files. This is not foregrounded because implementation counts are less useful than demonstrated capabilities and were not independently checked against the project source.
- The preliminary “roughly twice the horizontal accuracy” observation has no supplied sample size or raw results. The page describes its direction without presenting an unsupported effect-size chart.
- Navigation study outcomes, deployment with visually impaired users, publications, and clinical or accessibility validation are not established in the supplied material. Add these only if supporting information becomes available.

## Updating demos

Keep assets in `src/assets/videos/spatial-sonification/` and posters in `src/assets/images/spatial-sonification/`. The project Markdown frontmatter has parallel `demoVideos`, `demoPosters`, `demoTitles`, and `demoCaptions` lists; keep their ordering aligned. Captions and titles should avoid commas because the existing lightweight frontmatter parser splits list items on commas. Use H.264 MP4 with AAC audio, `yuv420p`, and fast-start metadata. Preserve stereo audio for spatial cues.
