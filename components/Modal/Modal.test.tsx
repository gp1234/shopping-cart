import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { BaseModal } from "./Modal";

const renderModal = (
  props: Partial<ComponentProps<typeof BaseModal>> = {}
) => {
  const { onClose = jest.fn(), children = <p>Are you sure?</p>, ...rest } = props;

  return {
    onClose,
    ...render(
      <BaseModal
        open
        title="Confirm action"
        onClose={onClose}
        {...rest}
      >
        {children}
      </BaseModal>
    ),
  };
};

describe("BaseModal", () => {
  it("renders the title, content, and close button when open", () => {
    renderModal();

    expect(
      screen.getByRole("heading", { name: /confirm action/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("hides the close button when showCloseButton is false", () => {
    renderModal({ showCloseButton: false });

    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it("invokes onClose when the close button is clicked", async () => {
    const user = userEvent.setup();

    const { onClose } = renderModal();

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("invokes onClose when the escape key is pressed", async () => {
    const user = userEvent.setup();

    const { onClose } = renderModal();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});
