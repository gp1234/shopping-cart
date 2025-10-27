import { act, render, screen, waitFor } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { UserRoles } from "@/data/users";

const replaceMock = jest.fn();
const usePathnameMock = jest.fn<string, []>();

const routerMock = {
  replace: replaceMock,
};

jest.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => usePathnameMock(),
}));

type StoreState = {
  token: string | null;
  user: {
    id: string;
    email: string;
    role: UserRoles;
    tier?: string;
  } | null;
};

jest.mock("@/lib/store/userStore", () => {
  const store: StoreState = {
    token: null,
    user: null,
  };

  let hydrationCallback: (() => void) | null = null;
  let hasHydratedFlag = true;

  const persist = {
    onFinishHydration: jest.fn((callback: () => void) => {
      hydrationCallback = callback;
      return () => {};
    }),
    hasHydrated: jest.fn(() => hasHydratedFlag),
  };

  const useUserStore = Object.assign(
    jest.fn((selector: (state: StoreState) => unknown) => selector(store)),
    { persist }
  );

  return {
    __esModule: true,
    useUserStore,
    __store: store,
    __persist: persist,
    __getHydrationCallback: () => hydrationCallback,
    __setHydrationFlag: (value: boolean) => {
      hasHydratedFlag = value;
    },
    __getHydrationFlag: () => hasHydratedFlag,
  };
});

const userStoreModule = jest.requireMock("@/lib/store/userStore") as {
  useUserStore: jest.Mock & {
    persist: { onFinishHydration: jest.Mock; hasHydrated: jest.Mock };
  };
  __store: StoreState;
  __persist: { onFinishHydration: jest.Mock; hasHydrated: jest.Mock };
  __getHydrationCallback: () => (() => void) | null;
  __setHydrationFlag: (value: boolean) => void;
  __getHydrationFlag: () => boolean;
};

const useUserStoreMock = userStoreModule.useUserStore;
const storeState = userStoreModule.__store;
const persistMock = userStoreModule.__persist;
const getHydrationCallback = userStoreModule.__getHydrationCallback;
const setHydrationFlag = userStoreModule.__setHydrationFlag;

const renderProtectedRoute = () =>
  render(
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );

beforeEach(() => {
  replaceMock.mockClear();
  usePathnameMock.mockReset();
  useUserStoreMock.mockClear();
  persistMock.onFinishHydration.mockClear();
  persistMock.hasHydrated.mockClear();
  storeState.token = null;
  storeState.user = null;
  setHydrationFlag(true);
});

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated and authorized", async () => {
    storeState.token = "token";
    storeState.user = {
      id: "1",
      email: "user@example.com",
      role: UserRoles.USER,
      tier: "1",
    };
    usePathnameMock.mockReturnValue("/products");

    renderProtectedRoute();

    await waitFor(() =>
      expect(screen.getByText("Protected content")).toBeInTheDocument()
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders admin routes when the user role allows access", async () => {
    storeState.token = "token";
    storeState.user = {
      id: "99",
      email: "admin@example.com",
      role: UserRoles.ADMIN,
    };
    usePathnameMock.mockReturnValue("/dashboard");

    renderProtectedRoute();

    await waitFor(() =>
      expect(screen.getByText("Protected content")).toBeInTheDocument()
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to login when no token is present after hydration", async () => {
    storeState.token = null;
    storeState.user = null;
    usePathnameMock.mockReturnValue("/products");

    renderProtectedRoute();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects unauthorized users to their role route", async () => {
    storeState.token = "token";
    storeState.user = {
      id: "2",
      email: "user@example.com",
      role: UserRoles.USER,
      tier: "1",
    };
    usePathnameMock.mockReturnValue("/dashboard");

    renderProtectedRoute();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/products"));
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("does not redirect until hydration is complete", async () => {
    setHydrationFlag(false);
    storeState.token = null;
    usePathnameMock.mockReturnValue("/products");

    renderProtectedRoute();

    expect(replaceMock).not.toHaveBeenCalled();

    setHydrationFlag(true);
    await waitFor(() =>
      expect(persistMock.onFinishHydration).toHaveBeenCalled()
    );

    const hydrationCallback = getHydrationCallback();
    await act(async () => {
      hydrationCallback?.();
    });

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/login"));
  });
});
