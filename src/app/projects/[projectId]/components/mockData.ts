import { ColumnData } from "./types";

// Centralized mock data for Phase 3; will be replaced in Phase 4 fetching from Convex.
export const mockColumns: ColumnData[] = [
  {
    id: "col-1",
    name: "Todo",
    order: 0,
    tasks: [
      {
        id: "t1",
        title: "Design login screen",
        description: "Low-fi wireframe",
        order: 0,
        columnId: "col-1",
      },
      {
        id: "t2",
        title: "Set up CI",
        description: "Add GitHub Actions",
        order: 1,
        columnId: "col-1",
      },
    ],
  },
  {
    id: "col-2",
    name: "In Progress",
    order: 1,
    tasks: [
      {
        id: "t3",
        title: "Convex schema",
        description: "Define tables",
        order: 0,
        columnId: "col-2",
      },
    ],
  },
  {
    id: "col-3",
    name: "Done",
    order: 2,
    tasks: [
      {
        id: "t4",
        title: "Project setup",
        description: "Next.js + Tailwind",
        order: 0,
        columnId: "col-3",
      },
    ],
  },
];
