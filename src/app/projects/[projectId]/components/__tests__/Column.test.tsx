import { render, screen } from "@testing-library/react";
import { Column } from "../Column";

describe("Column", () => {
  it("renders tasks from testTasks", () => {
    render(
      <Column
        columnId="col-1"
        name="Todo"
        testTasks={[
          { _id: "t1", title: "Task A", order: 0, columnId: "col-1" },
          { _id: "t2", title: "Task B", order: 1, columnId: "col-1" },
        ]}
      />,
    );
    expect(screen.getByText(/Task A/)).toBeInTheDocument();
    expect(screen.getByText(/Task B/)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Column columnId="empty" name="Empty" testTasks={[]} />);
    expect(screen.getByTestId("empty-column")).toBeInTheDocument();
  });
});
