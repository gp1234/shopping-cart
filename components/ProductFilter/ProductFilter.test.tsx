import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductFilter from "./ProductFilter";

const replaceMock = jest.fn();
const useRouterMock = jest.fn(() => ({ replace: replaceMock }));
const useSearchParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => useRouterMock(),
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@/lib/hooks/useDebounce", () => ({
  useDebounce: <T,>(value: T) => value,
}));

const createSearchParams = (params: Record<string, string> = {}) => ({
  get: (key: string) => params[key] ?? null,
});

const products = [
  {
    id: 1,
    name: "Smartphone",
    category: "Electronics",
    price: 200,
    description: "",
  },
  {
    id: 2,
    name: "Laptop",
    category: "Electronics",
    price: 400,
    description: "",
  },
  {
    id: 3,
    name: "Headphones",
    category: "Accessories",
    price: 80,
    description: "",
  },
];

const renderFilter = (
  params: Record<string, string> = {}
) => {
  const setFiltered = jest.fn();

  useSearchParamsMock.mockReturnValue(createSearchParams(params));
  useRouterMock.mockReturnValue({ replace: replaceMock });

  const utils = render(
    <ProductFilter products={products} setFiltered={setFiltered} />
  );

  return {
    setFiltered,
    ...utils,
  };
};

beforeEach(() => {
  replaceMock.mockClear();
  useRouterMock.mockClear();
  useSearchParamsMock.mockReset();
});

describe("ProductFilter", () => {
  it("initializes state from search params and filters products accordingly", async () => {
    const { setFiltered } = renderFilter({
      q: "phone",
      category: "Electronics",
      min: "50",
      max: "300",
    });

    expect(screen.getByRole("textbox", { name: /search/i })).toHaveValue(
      "phone"
    );
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent("Electronics");

    await waitFor(() =>
      expect(setFiltered).toHaveBeenLastCalledWith([products[0]])
    );

    expect(replaceMock).toHaveBeenLastCalledWith(
      "?q=phone&category=Electronics&min=50&max=300",
      { scroll: false }
    );
  });

  it("filters products when the search query changes", async () => {
    const { setFiltered } = renderFilter();

    await waitFor(() => expect(setFiltered).toHaveBeenCalled());
    setFiltered.mockClear();
    replaceMock.mockClear();

    const user = userEvent.setup();
    const searchInput = screen.getByRole("textbox", { name: /search/i });
    await user.clear(searchInput);
    await user.type(searchInput, "lap");

    await waitFor(() =>
      expect(setFiltered).toHaveBeenCalledWith([products[1]])
    );

    expect(replaceMock).toHaveBeenLastCalledWith("?q=lap", { scroll: false });
  });

  it("updates results and url when category changes", async () => {
    const { setFiltered } = renderFilter();

    await waitFor(() => expect(setFiltered).toHaveBeenCalled());
    setFiltered.mockClear();
    replaceMock.mockClear();

    const user = userEvent.setup();
    const category = screen.getByRole("combobox", { name: /category/i });

    await user.click(category);
    await user.click(screen.getByRole("option", { name: "Accessories" }));

    await waitFor(() =>
      expect(setFiltered).toHaveBeenCalledWith([products[2]])
    );

    expect(replaceMock).toHaveBeenLastCalledWith("?category=Accessories", {
      scroll: false,
    });
  });
});
