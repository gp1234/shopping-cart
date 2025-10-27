import { render, screen } from "@testing-library/react";
import VirtualizedTable from "./VirtualizedTable";

const useMediaQueryMock = jest.fn();
const useThemeMock = jest.fn(() => ({
  breakpoints: { down: () => "@media (max-width: 960px)" },
}));

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: (query: unknown) => useMediaQueryMock(query),
    useTheme: () => useThemeMock(),
  };
});

const useVirtualizerMock = jest.fn((options: any) => {
  const size =
    typeof options?.estimateSize === "function"
      ? options.estimateSize()
      : 56;
  const items = Array.from({ length: options.count }, (_, index) => ({
    index,
    key: index,
    start: index * size,
    size,
  }));

  return {
    getVirtualItems: () => items,
    getTotalSize: () => items.length * size,
  };
});

jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: (options: any) => useVirtualizerMock(options),
}));

const columns = [
  { key: "name", label: "Name", flex: 1 },
  { key: "price", label: "Price", hideOnMobile: true },
];

const data = [
  { id: 1, name: "Item A", price: "€10" },
  { id: 2, name: "Item B", price: "€15" },
];

beforeEach(() => {
  useMediaQueryMock.mockReset();
  useVirtualizerMock.mockClear();
  useThemeMock.mockClear();
});

describe("VirtualizedTable", () => {
  it("renders headers and visible rows", () => {
    useMediaQueryMock.mockReturnValue(false);

    render(<VirtualizedTable data={data} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByText("€10")).toBeInTheDocument();
    expect(screen.getByText("€15")).toBeInTheDocument();
    expect(useVirtualizerMock).toHaveBeenCalledWith(
      expect.objectContaining({ count: data.length })
    );
  });

  it("hides mobile-only columns when viewport is mobile", () => {
    useMediaQueryMock.mockReturnValue(true);

    render(<VirtualizedTable data={data} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Price")).not.toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.queryByText("€10")).not.toBeInTheDocument();
  });

  it("renders actions column when renderActions is provided", () => {
    useMediaQueryMock.mockReturnValue(false);
    const renderActions = jest.fn((item: (typeof data)[number]) => (
      <button type="button">View {item.name}</button>
    ));

    render(
      <VirtualizedTable
        data={data}
        columns={columns}
        renderActions={renderActions}
      />
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Item A" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View Item B" })
    ).toBeInTheDocument();
    expect(renderActions).toHaveBeenCalledTimes(data.length);
  });
});
