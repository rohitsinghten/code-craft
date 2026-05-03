import { Code2, History, Library, Palette } from "lucide-react";

export const ENTERPRISE_FEATURES = [
  {
    icon: Code2,
    label: "More Languages",
    desc: "JavaScript and Python are free; Pro unlocks TypeScript, Java, Go, Rust, C++, C#, Ruby, and Swift.",
  },
  {
    icon: Palette,
    label: "Editor Comfort",
    desc: "Keep your preferred theme, font size, and language setup ready for every session.",
  },
  {
    icon: History,
    label: "Execution History",
    desc: "Save signed-in runs with output, errors, language, and source code for later reference.",
  },
  {
    icon: Library,
    label: "Snippet Workflow",
    desc: "Share snippets, star useful examples, and fork community code back into the editor.",
  },
];

export const FEATURES = {
  editor: [
    "Unlock 8 additional languages",
    "Theme and font-size preferences",
    "Readable output and error history",
    "Mobile-friendly editor controls",
  ],
  snippets: [
    "Public snippet sharing",
    "Fork snippets into the editor",
    "Star and collect examples",
    "Quality-focused community browsing",
  ],
  workspace: [
    "Saved execution history",
    "Language-aware starter code",
    "Persistent editor drafts",
    "Priority for upcoming editor upgrades",
  ],
};
