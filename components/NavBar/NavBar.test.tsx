import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "./NavBar";
import { UserRoles } from "@/data/users";

const pushMock = jest.fn();
const replaceMock = jest.fn();
const backMock = jest.fn();
const prefetchMock = jest.fn();

const useRouterMock = jest.fn(() => ({
  push: pushMock,
  replace: replaceMock,
  back: backMock,
  prefetch: prefetchMock,
}));

const usePathnameMock = jest.fn();
const useMediaQueryMock = jest.fn<boolean, [unknown]>();

const logoutMock = jest.fn();
let storeState = {
  user: null as
    | null
    | {
        id: string;
        email: string;
        role: string;
        tier: string;
      },
  logout: logoutMock,
};

const useUserStoreMock = jest.fn((selector: any) => selector(storeState));

jest.mock("next/navigation", () => ({
  useRouter: () => useRouterMock(),
  usePathname: () => usePathnameMock(),
}));

jest.mock("@/lib/store/userStore", () => ({
  useUserStore: (selector: any) => useUserStoreMock(selector),
}));

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: (query: unknown) => useMediaQueryMock(query),
  };
});

const renderNavBar = () => render(<NavBar />);

beforeEach(() => {
  pushMock.mockClear();
  replaceMock.mockClear();
  backMock.mockClear();
  prefetchMock.mockClear();
  useRouterMock.mockClear();
  usePathnameMock.mockReset();
  useMediaQueryMock.mockReset();
  logoutMock.mockClear();

  storeState = {
    user: null,
    logout: logoutMock,
  };

  useUserStoreMock.mockImplementation((selector: any) => selector(storeState));
});

describe("NavBar", () => {
  it("renders referral and checkout buttons for user on desktop", () => {
    storeState.user = {
      id: "1",
      email: "user@example.com",
      role: UserRoles.USER,
      tier: "gold",
    };
    usePathnameMock.mockReturnValue("/");
    useMediaQueryMock.mockReturnValue(false);

    renderNavBar();

    expect(
      screen.getByRole("link", { name: /make a referral/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("hides referral button when already on referral page", () => {
    storeState.user = {
      id: "1",
      email: "user@example.com",
      role: UserRoles.USER,
      tier: "gold",
    };
    usePathnameMock.mockReturnValue("/referral");
    useMediaQueryMock.mockReturnValue(false);

    renderNavBar();

    expect(
      screen.queryByRole("link", { name: /make a referral/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /checkout/i })).toBeInTheDocument();
  });

  it("does not render referral or checkout for admin users", () => {
    storeState.user = {
      id: "2",
      email: "admin@example.com",
      role: UserRoles.ADMIN,
      tier: "gold",
    };
    usePathnameMock.mockReturnValue("/");
    useMediaQueryMock.mockReturnValue(false);

    renderNavBar();

    expect(
      screen.queryByRole("link", { name: /make a referral/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /checkout/i })
    ).not.toBeInTheDocument();
  });

  it("logs the user out and navigates to login", async () => {
    const user = userEvent.setup();

    storeState.user = {
      id: "1",
      email: "user@example.com",
      role: UserRoles.USER,
      tier: "gold",
    };
    usePathnameMock.mockReturnValue("/");
    useMediaQueryMock.mockReturnValue(false);

    renderNavBar();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
