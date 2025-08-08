import { render, screen } from "@testing-library/react";
import { Column } from "../Column";
import type { ColumnData } from "../types";

function makeColumn(overrides: Partial<ColumnData> = {}): ColumnData {
  return {
    id: "col-1",
    name: "Todo",
    order: 0,
    tasks: [
      { id: "t1", title: "Task A", order: 0, columnId: "col-1" },
      { id: "t2", title: "Task B", order: 1, columnId: "col-1" },
    ],
    ...overrides,
  };
}

describe("Column", () => {
  it("renders tasks", () => {
    render(<Column column={makeColumn()} />);
    expect(screen.getByText(/Task A/)).toBeInTheDocument();
    expect(screen.getByText(/Task B/)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Column column={makeColumn({ tasks: [] })} />);
    expect(screen.getByTestId("empty-column")).toBeInTheDocument();
  });
});
