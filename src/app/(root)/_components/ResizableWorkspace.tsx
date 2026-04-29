"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import EditorPanel from "./EditorPanel";
import OutputPanel from "./OutputPanel";

const LAYOUT_STORAGE_KEY = "codecraft-workspace-layout";
const DEFAULT_LAYOUT: [number, number] = [50, 50];

function getSavedLayout(): [number, number] {
  try {
    const savedLayout = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!savedLayout) return DEFAULT_LAYOUT;

    const parsedLayout = JSON.parse(savedLayout);
    if (
      Array.isArray(parsedLayout) &&
      parsedLayout.length === 2 &&
      parsedLayout.every((size) => typeof size === "number")
    ) {
      return [parsedLayout[0], parsedLayout[1]];
    }
  } catch {
    window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
  }

  return DEFAULT_LAYOUT;
}

function ResizableWorkspace() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [layout, setLayout] = useState<[number, number]>(DEFAULT_LAYOUT);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) setLayout(getSavedLayout());
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!isDesktop) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <EditorPanel />
        <OutputPanel />
      </div>
    );
  }

  return (
    <Group
      orientation="horizontal"
      defaultLayout={{ editor: layout[0], output: layout[1] }}
      onLayoutChanged={(sizes) => {
        window.localStorage.setItem(
          LAYOUT_STORAGE_KEY,
          JSON.stringify([sizes.editor ?? DEFAULT_LAYOUT[0], sizes.output ?? DEFAULT_LAYOUT[1]])
        );
      }}
      className="min-h-[720px] items-stretch"
    >
      <Panel id="editor" minSize="35%" className="min-w-0">
        <EditorPanel className="h-full" />
      </Panel>

      <Separator
        className="group relative flex w-5 shrink-0 items-stretch justify-center outline-none"
        aria-label="Resize editor and output panels"
      >
        <div className="my-6 w-px rounded-full bg-white/10 transition-colors group-hover:bg-blue-400/70 group-data-[separator=active]:bg-blue-400" />
        <div className="absolute top-1/2 flex h-10 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#181825] text-gray-500 shadow-lg transition-colors group-hover:border-blue-400/50 group-hover:text-blue-300 group-data-[separator=active]:border-blue-400/70 group-data-[separator=active]:text-blue-300">
          <GripVertical className="h-4 w-4" />
        </div>
      </Separator>

      <Panel id="output" minSize="25%" className="min-w-0">
        <OutputPanel className="h-full" />
      </Panel>
    </Group>
  );
}

export default ResizableWorkspace;
