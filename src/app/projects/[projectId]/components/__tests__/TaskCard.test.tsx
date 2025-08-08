import { render, screen, cleanup } from "@testing-library/react";
import { TaskCard } from "../TaskCard";
import type { Task } from "../types";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "t1",
    title: "Sample Task",
    description: "Some description",
    order: 0,
    columnId: "col-1",
    ...overrides,
  };
}

describe("TaskCard", () => {
  afterEach(() => cleanup());
  it("renders title and description", () => {
    render(<TaskCard task={makeTask()} />);
    expect(screen.getByText(/Sample Task/)).toBeInTheDocument();
    expect(screen.getByText(/Some description/)).toBeInTheDocument();
  });

  it("hides description when absent", () => {
    render(<TaskCard task={makeTask({ description: undefined })} />);
    const cards = screen.getAllByTestId("task-card");
    expect(cards).toHaveLength(1);
    expect(screen.queryByText(/Some description/)).not.toBeInTheDocument();
  });
});
