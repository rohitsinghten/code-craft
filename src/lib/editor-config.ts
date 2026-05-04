import { Monaco } from "@monaco-editor/react";
import { Theme } from "@/types";

type LanguageConfig = Record<
  string,
  {
    id: string;
    label: string;
    logoPath: string;
    pistonRuntime: { language: string; version: string };
    judge0LanguageId: number;
    onlineCompilerId?: string;
    monacoLanguage: string;
    defaultCode: string;
  }
>;

export const LANGUAGE_CONFIG: LanguageConfig = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    logoPath: "/javascript.png",
    pistonRuntime: { language: "javascript", version: "18.15.0" }, // api that we're gonna be using
    judge0LanguageId: 93,
    monacoLanguage: "javascript",
    defaultCode: `// Tiny Cafe Queue
const orders = [
  { name: "Ari", drink: "oat latte", patience: 2, shots: 2 },
  { name: "Bo", drink: "cold brew", patience: 5, shots: 3 },
  { name: "Cy", drink: "matcha", patience: 1, shots: 0 },
  { name: "Dee", drink: "espresso", patience: 3, shots: 1 },
];

const queue = [...orders]
  .sort((a, b) => a.patience - b.patience)
  .map(order => \`\${order.name}: \${order.drink}\`);

const highDramaOrders = orders.filter(order => order.patience <= 2);
const totalShots = orders.reduce((sum, order) => sum + order.shots, 0);

console.log("Tiny Cafe queue:", queue.join(" -> "));
console.log("Needs coffee immediately:", highDramaOrders.map(order => order.name).join(", "));
console.log("Total espresso shots:", totalShots);`,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: "/typescript.png",
    pistonRuntime: { language: "typescript", version: "5.0.3" },
    judge0LanguageId: 94,
    onlineCompilerId: "typescript-deno",
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Playlist Triage
type Track = {
  title: string;
  bpm: number;
  skipRisk: "low" | "medium" | "high";
};

const playlist: Track[] = [
  { title: "Soft Launch Synth", bpm: 88, skipRisk: "low" },
  { title: "Bug Fix Boogie", bpm: 124, skipRisk: "medium" },
  { title: "Deploy Button Disco", bpm: 132, skipRisk: "high" },
  { title: "Refactor Rain", bpm: 96, skipRisk: "low" },
];

const warmupOrder = [...playlist].sort((a, b) => a.bpm - b.bpm);
const riskyTracks = playlist.filter(track => track.skipRisk === "high");
const averageBpm = Math.round(
  playlist.reduce((sum, track) => sum + track.bpm, 0) / playlist.length
);

console.log("Warm-up order:", warmupOrder.map(track => track.title).join(" -> "));
console.log("High skip risk:", riskyTracks.map(track => track.title).join(", "));
console.log("Average BPM:", averageBpm);`,
  },
  python: {
    id: "python",
    label: "Python",
    logoPath: "/python.png",
    pistonRuntime: { language: "python", version: "3.10.0" },
    judge0LanguageId: 92,
    onlineCompilerId: "python-3.14",
    monacoLanguage: "python",
    defaultCode: `# Tiny Cafe Queue
orders = [
    {"name": "Ari", "drink": "oat latte", "patience": 2, "shots": 2},
    {"name": "Bo", "drink": "cold brew", "patience": 5, "shots": 3},
    {"name": "Cy", "drink": "matcha", "patience": 1, "shots": 0},
    {"name": "Dee", "drink": "espresso", "patience": 3, "shots": 1},
]

queue = sorted(orders, key=lambda order: order["patience"])
urgent = [order["name"] for order in orders if order["patience"] <= 2]
total_shots = sum(order["shots"] for order in orders)

print("Tiny Cafe queue:", " -> ".join(order["name"] for order in queue))
print("Needs coffee immediately:", ", ".join(urgent))
print(f"Total espresso shots: {total_shots}")`,
  },
  java: {
    id: "java",
    label: "Java",
    logoPath: "/java.png",
    pistonRuntime: { language: "java", version: "15.0.2" },
    judge0LanguageId: 91,
    onlineCompilerId: "openjdk-25",
    monacoLanguage: "java",
    defaultCode: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class Main {
  static class Order {
    String name;
    String drink;
    int patience;
    int shots;

    Order(String name, String drink, int patience, int shots) {
      this.name = name;
      this.drink = drink;
      this.patience = patience;
      this.shots = shots;
    }
  }

  public static void main(String[] args) {
    List<Order> orders = Arrays.asList(
      new Order("Ari", "oat latte", 2, 2),
      new Order("Bo", "cold brew", 5, 3),
      new Order("Cy", "matcha", 1, 0),
      new Order("Dee", "espresso", 3, 1)
    );

    orders.sort(Comparator.comparingInt(order -> order.patience));

    List<String> queue = new ArrayList<>();
    List<String> urgent = new ArrayList<>();
    int totalShots = 0;

    for (Order order : orders) {
      queue.add(order.name + ": " + order.drink);
      totalShots += order.shots;
      if (order.patience <= 2) urgent.add(order.name);
    }

    System.out.println("Tiny Cafe queue: " + String.join(" -> ", queue));
    System.out.println("Needs coffee immediately: " + String.join(", ", urgent));
    System.out.println("Total espresso shots: " + totalShots);
  }
}`,
  },
  go: {
    id: "go",
    label: "Go",
    logoPath: "/go.png",
    pistonRuntime: { language: "go", version: "1.16.2" },
    judge0LanguageId: 106,
    onlineCompilerId: "go-1.26",
    monacoLanguage: "go",
    defaultCode: `package main

import (
  "fmt"
  "sort"
  "strings"
)

type Order struct {
  Name     string
  Drink    string
  Patience int
  Shots    int
}

func main() {
  orders := []Order{
    {"Ari", "oat latte", 2, 2},
    {"Bo", "cold brew", 5, 3},
    {"Cy", "matcha", 1, 0},
    {"Dee", "espresso", 3, 1},
  }

  sort.Slice(orders, func(i, j int) bool {
    return orders[i].Patience < orders[j].Patience
  })

  queue := []string{}
  urgent := []string{}
  totalShots := 0

  for _, order := range orders {
    queue = append(queue, order.Name+": "+order.Drink)
    totalShots += order.Shots
    if order.Patience <= 2 {
      urgent = append(urgent, order.Name)
    }
  }

  fmt.Println("Tiny Cafe queue:", strings.Join(queue, " -> "))
  fmt.Println("Needs coffee immediately:", strings.Join(urgent, ", "))
  fmt.Println("Total espresso shots:", totalShots)
}`,
  },
  rust: {
    id: "rust",
    label: "Rust",
    logoPath: "/rust.png",
    pistonRuntime: { language: "rust", version: "1.68.2" },
    judge0LanguageId: 108,
    onlineCompilerId: "rust-1.93",
    monacoLanguage: "rust",
    defaultCode: `struct Order {
    name: &'static str,
    drink: &'static str,
    patience: u8,
    shots: u8,
}

fn main() {
    let mut orders = vec![
        Order { name: "Ari", drink: "oat latte", patience: 2, shots: 2 },
        Order { name: "Bo", drink: "cold brew", patience: 5, shots: 3 },
        Order { name: "Cy", drink: "matcha", patience: 1, shots: 0 },
        Order { name: "Dee", drink: "espresso", patience: 3, shots: 1 },
    ];

    orders.sort_by_key(|order| order.patience);

    let queue: Vec<String> = orders
        .iter()
        .map(|order| format!("{}: {}", order.name, order.drink))
        .collect();
    let urgent: Vec<&str> = orders
        .iter()
        .filter(|order| order.patience <= 2)
        .map(|order| order.name)
        .collect();
    let total_shots: u8 = orders.iter().map(|order| order.shots).sum();

    println!("Tiny Cafe queue: {}", queue.join(" -> "));
    println!("Needs coffee immediately: {}", urgent.join(", "));
    println!("Total espresso shots: {}", total_shots);
}`,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    logoPath: "/cpp.png",
    pistonRuntime: { language: "cpp", version: "10.2.0" },
    judge0LanguageId: 105,
    onlineCompilerId: "g++-15",
    monacoLanguage: "cpp",
    defaultCode: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Order {
    std::string name;
    std::string drink;
    int patience;
    int shots;
};

std::string join(const std::vector<std::string>& items, const std::string& separator) {
    std::string result;
    for (size_t i = 0; i < items.size(); ++i) {
        result += items[i];
        if (i + 1 < items.size()) result += separator;
    }
    return result;
}

int main() {
    std::vector<Order> orders = {
        {"Ari", "oat latte", 2, 2},
        {"Bo", "cold brew", 5, 3},
        {"Cy", "matcha", 1, 0},
        {"Dee", "espresso", 3, 1},
    };

    std::sort(orders.begin(), orders.end(), [](const Order& a, const Order& b) {
        return a.patience < b.patience;
    });

    std::vector<std::string> queue;
    std::vector<std::string> urgent;
    int totalShots = 0;

    for (const Order& order : orders) {
        queue.push_back(order.name + ": " + order.drink);
        totalShots += order.shots;
        if (order.patience <= 2) urgent.push_back(order.name);
    }

    std::cout << "Tiny Cafe queue: " << join(queue, " -> ") << std::endl;
    std::cout << "Needs coffee immediately: " << join(urgent, ", ") << std::endl;
    std::cout << "Total espresso shots: " << totalShots << std::endl;

    return 0;
}`,
  },
  csharp: {
    id: "csharp",
    label: "C#",
    logoPath: "/csharp.png",
    pistonRuntime: { language: "csharp", version: "6.12.0" },
    judge0LanguageId: 51,
    onlineCompilerId: "dotnet-csharp-9",
    monacoLanguage: "csharp",
    defaultCode: `using System;
using System.Linq;

class Order {
    public string Name { get; set; }
    public string Drink { get; set; }
    public int Patience { get; set; }
    public int Shots { get; set; }
}

class Program {
    static void Main() {
        var orders = new[] {
            new Order { Name = "Ari", Drink = "oat latte", Patience = 2, Shots = 2 },
            new Order { Name = "Bo", Drink = "cold brew", Patience = 5, Shots = 3 },
            new Order { Name = "Cy", Drink = "matcha", Patience = 1, Shots = 0 },
            new Order { Name = "Dee", Drink = "espresso", Patience = 3, Shots = 1 },
        };

        var queue = orders
            .OrderBy(order => order.Patience)
            .Select(order => order.Name + ": " + order.Drink);
        var urgent = orders
            .Where(order => order.Patience <= 2)
            .Select(order => order.Name);
        var totalShots = orders.Sum(order => order.Shots);

        Console.WriteLine("Tiny Cafe queue: " + string.Join(" -> ", queue));
        Console.WriteLine("Needs coffee immediately: " + string.Join(", ", urgent));
        Console.WriteLine("Total espresso shots: " + totalShots);
    }
}`,
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    logoPath: "/ruby.png",
    pistonRuntime: { language: "ruby", version: "3.0.1" },
    judge0LanguageId: 72,
    onlineCompilerId: "ruby-4.0",
    monacoLanguage: "ruby",
    defaultCode: `# Tiny Cafe Queue
orders = [
  { name: "Ari", drink: "oat latte", patience: 2, shots: 2 },
  { name: "Bo", drink: "cold brew", patience: 5, shots: 3 },
  { name: "Cy", drink: "matcha", patience: 1, shots: 0 },
  { name: "Dee", drink: "espresso", patience: 3, shots: 1 }
]

queue = orders.sort_by { |order| order[:patience] }
urgent = orders.select { |order| order[:patience] <= 2 }.map { |order| order[:name] }
total_shots = orders.sum { |order| order[:shots] }

puts "Tiny Cafe queue: #{queue.map { |order| "#{order[:name]}: #{order[:drink]}" }.join(" -> ")}"
puts "Needs coffee immediately: #{urgent.join(", ")}"
puts "Total espresso shots: #{total_shots}"`,
  },
  swift: {
    id: "swift",
    label: "Swift",
    logoPath: "/swift.png",
    pistonRuntime: { language: "swift", version: "5.3.3" },
    judge0LanguageId: 83,
    monacoLanguage: "swift",
    defaultCode: `struct Order {
    let name: String
    let drink: String
    let patience: Int
    let shots: Int
}

let orders = [
    Order(name: "Ari", drink: "oat latte", patience: 2, shots: 2),
    Order(name: "Bo", drink: "cold brew", patience: 5, shots: 3),
    Order(name: "Cy", drink: "matcha", patience: 1, shots: 0),
    Order(name: "Dee", drink: "espresso", patience: 3, shots: 1)
]

let queue = orders
    .sorted { $0.patience < $1.patience }
    .map { "\\($0.name): \\($0.drink)" }
let urgent = orders
    .filter { $0.patience <= 2 }
    .map { $0.name }
let totalShots = orders.reduce(0) { total, order in total + order.shots }

print("Tiny Cafe queue: \\(queue.joined(separator: " -> "))")
print("Needs coffee immediately: \\(urgent.joined(separator: ", "))")
print("Total espresso shots: \\(totalShots)")`,
  },
};

export const MAX_CODE_LENGTH = 20_000;
export const MAX_SNIPPET_TITLE_LENGTH = 120;
export const MAX_COMMENT_LENGTH = 4_000;
export const EXECUTION_TIMEOUT_MS = 12_000;
export const FREE_LANGUAGE_IDS = ["javascript", "python"] as const;
export const EXECUTION_RATE_LIMIT = {
  maxRequests: 20,
  windowMs: 60_000,
};

export type LanguageId = keyof typeof LANGUAGE_CONFIG;
export type FreeLanguageId = (typeof FREE_LANGUAGE_IDS)[number];

export const isSupportedLanguage = (language: string): language is LanguageId =>
  Object.prototype.hasOwnProperty.call(LANGUAGE_CONFIG, language);

export const isFreeLanguage = (language: string): language is FreeLanguageId =>
  (FREE_LANGUAGE_IDS as readonly string[]).includes(language);

export const getLanguageConfig = (language: string) =>
  isSupportedLanguage(language) ? LANGUAGE_CONFIG[language] : null;

export const THEMES: Theme[] = [
  { id: "vs-dark", label: "VS Dark", color: "#1e1e1e" },
  { id: "vs-light", label: "VS Light", color: "#ffffff" },
  { id: "github-dark", label: "GitHub Dark", color: "#0d1117" },
  { id: "monokai", label: "Monokai", color: "#272822" },
  { id: "solarized-dark", label: "Solarized Dark", color: "#002b36" },
];

export const THEME_DEFINITONS = {
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6e7681" },
      { token: "string", foreground: "a5d6ff" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "class", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
      { token: "operator", foreground: "ff7b72" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editorLineNumber.foreground": "#6e7681",
      "editorIndentGuide.background": "#21262d",
      "editor.selectionBackground": "#264f78",
      "editor.inactiveSelectionBackground": "#264f7855",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715E" },
      { token: "string", foreground: "E6DB74" },
      { token: "keyword", foreground: "F92672" },
      { token: "number", foreground: "AE81FF" },
      { token: "type", foreground: "66D9EF" },
      { token: "class", foreground: "A6E22E" },
      { token: "function", foreground: "A6E22E" },
      { token: "variable", foreground: "F8F8F2" },
      { token: "operator", foreground: "F92672" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#75715E",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
      "editorCursor.foreground": "#F8F8F2",
      "editor.selectionHighlightBackground": "#49483E",
    },
  },
  "solarized-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75" },
      { token: "string", foreground: "2aa198" },
      { token: "keyword", foreground: "859900" },
      { token: "number", foreground: "d33682" },
      { token: "type", foreground: "b58900" },
      { token: "class", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
      { token: "variable", foreground: "b58900" },
      { token: "operator", foreground: "859900" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editorLineNumber.foreground": "#586e75",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
      "editorCursor.foreground": "#839496",
      "editor.selectionHighlightBackground": "#073642",
    },
  },
};

// Helper function to define themes in Monaco
export const defineMonacoThemes = (monaco: Monaco) => {
  Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
    monaco.editor.defineTheme(themeName, {
      base: themeData.base,
      inherit: themeData.inherit,
      rules: themeData.rules.map((rule) => ({
        ...rule,
        foreground: rule.foreground,
      })),
      colors: themeData.colors,
    });
  });
};
