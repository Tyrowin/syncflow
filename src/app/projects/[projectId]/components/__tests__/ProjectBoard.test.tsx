import { render, screen, cleanup } from "@testing-library/react";
import { ProjectBoard } from "../ProjectBoard";

describe("ProjectBoard", () => {
  afterEach(() => cleanup());
  it("renders heading and columns", () => {
    render(<ProjectBoard />);
    expect(screen.getByRole("heading", { level: 2, name: /Board/i })).toBeInTheDocument();
    // There should be 3 columns based on mock data
    const columns = screen.getAllByTestId("column");
    expect(columns).toHaveLength(3);
  });

  it("has add task buttons per column", () => {
    render(<ProjectBoard />);
    const addButtons = screen.getAllByRole("button", { name: /Add task to/i });
    expect(addButtons).toHaveLength(3);
  });
});
