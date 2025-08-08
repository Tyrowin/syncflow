import { render, screen, cleanup } from "@testing-library/react";
import { ProjectBoard } from "../ProjectBoard";
import type { Id } from "@/convex";

type TestColumn = {
  _id: Id<"columns"> | string;
  _creationTime: number;
  name: string;
  order: number;
  projectId: Id<"projects"> | string;
};
const sampleColumns: TestColumn[] = [
  { _id: "col1", name: "Todo", order: 0, projectId: "proj1", _creationTime: Date.now() },
  { _id: "col2", name: "In Progress", order: 1, projectId: "proj1", _creationTime: Date.now() },
  { _id: "col3", name: "Done", order: 2, projectId: "proj1", _creationTime: Date.now() },
];

describe("ProjectBoard", () => {
  afterEach(() => cleanup());
  it("renders heading and columns", () => {
    render(
      <ProjectBoard
        projectId="proj1"
        testColumns={sampleColumns}
        testTasksByColumn={{ col1: [], col2: [], col3: [] }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: /Board/i })).toBeInTheDocument();
    // There should be 3 columns based on mock data
    const columns = screen.getAllByTestId("column");
    expect(columns).toHaveLength(3);
  });

  it("has add task buttons per column", () => {
    render(
      <ProjectBoard
        projectId="proj1"
        testColumns={sampleColumns}
        testTasksByColumn={{ col1: [], col2: [], col3: [] }}
      />,
    );
    const addButtons = screen.getAllByRole("button", { name: /Add task to/i });
    expect(addButtons).toHaveLength(3);
  });
});
