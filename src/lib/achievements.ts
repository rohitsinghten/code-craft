export type RunAchievement = {
  id: string;
  title: string;
  description: string;
};

type AchievementState = {
  version: 1;
  runCount: number;
  errorCount: number;
  successStreakByDay: Record<string, number>;
  unlocked: string[];
};

type RunAchievementInput = {
  language: string;
  code: string;
  error: string | null;
};

const STORAGE_KEY = "codecraft-achievements-v1";

const ACHIEVEMENTS = {
  firstRun: {
    id: "first-run",
    title: "First Run",
    description: "The workspace is awake now.",
  },
  fiveBugsLater: {
    id: "five-bugs-later",
    title: "Five Bugs Later",
    description: "Character development, but with stack traces.",
  },
  pythonEra: {
    id: "python-era",
    title: "Python Era",
    description: "Indentation nation has claimed the tab.",
  },
  consoleLogEnthusiast: {
    id: "console-log-enthusiast",
    title: "Console.log Enthusiast",
    description: "The classic detective work continues.",
  },
  noErrorsToday: {
    id: "no-errors-today",
    title: "No Errors Today",
    description: "Three clean runs. Suspiciously elegant.",
  },
} satisfies Record<string, RunAchievement>;

function getInitialState(): AchievementState {
  return {
    version: 1,
    runCount: 0,
    errorCount: 0,
    successStreakByDay: {},
    unlocked: [],
  };
}

function readAchievementState(): AchievementState {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return getInitialState();

    const parsedValue = JSON.parse(storedValue) as Partial<AchievementState>;
    if (
      parsedValue.version === 1 &&
      typeof parsedValue.runCount === "number" &&
      typeof parsedValue.errorCount === "number" &&
      parsedValue.successStreakByDay &&
      typeof parsedValue.successStreakByDay === "object" &&
      Array.isArray(parsedValue.unlocked)
    ) {
      return {
        version: 1,
        runCount: parsedValue.runCount,
        errorCount: parsedValue.errorCount,
        successStreakByDay: parsedValue.successStreakByDay as Record<string, number>,
        unlocked: parsedValue.unlocked,
      };
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return getInitialState();
}

function writeAchievementState(state: AchievementState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Achievements should never block running code.
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function countConsoleLogs(code: string) {
  return code.match(/\bconsole\.log\s*\(/g)?.length ?? 0;
}

export function recordRunAchievements({
  language,
  code,
  error,
}: RunAchievementInput): RunAchievement[] {
  if (typeof window === "undefined") return [];

  const state = readAchievementState();
  const unlocked = new Set(state.unlocked);
  const achievements: RunAchievement[] = [];
  const todayKey = getTodayKey();

  const nextState: AchievementState = {
    ...state,
    runCount: state.runCount + 1,
    successStreakByDay: { ...state.successStreakByDay },
  };

  if (error) {
    nextState.errorCount += 1;
  } else {
    nextState.successStreakByDay[todayKey] =
      (nextState.successStreakByDay[todayKey] ?? 0) + 1;
  }

  const maybeUnlock = (achievement: RunAchievement) => {
    if (unlocked.has(achievement.id)) return;
    unlocked.add(achievement.id);
    achievements.push(achievement);
  };

  if (nextState.runCount === 1) maybeUnlock(ACHIEVEMENTS.firstRun);
  if (nextState.errorCount === 5) maybeUnlock(ACHIEVEMENTS.fiveBugsLater);
  if (language === "python") maybeUnlock(ACHIEVEMENTS.pythonEra);
  if (
    (language === "javascript" || language === "typescript") &&
    countConsoleLogs(code) >= 3
  ) {
    maybeUnlock(ACHIEVEMENTS.consoleLogEnthusiast);
  }
  if (!error && nextState.successStreakByDay[todayKey] === 3) {
    maybeUnlock(ACHIEVEMENTS.noErrorsToday);
  }

  nextState.unlocked = Array.from(unlocked);
  writeAchievementState(nextState);

  return achievements;
}
