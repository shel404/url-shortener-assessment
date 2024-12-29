import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { URLShortener } from "./URLShortener";

// Mock the clipboard API
const mockClipboard = {
  writeText: vi.fn(),
  readText: vi.fn(),
};
Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock fetch
global.fetch = vi.fn();

describe("URLShortener", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboard.readText.mockResolvedValue("");
  });

  it("renders the component correctly", () => {
    render(<URLShortener />);

    expect(screen.getByText("✨ URL Shortener")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste your long url/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /shorten/i })
    ).toBeInTheDocument();
  });

  it("successfully shortens a valid URL", async () => {
    const mockShortUrl = "abc123";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ shortUrl: mockShortUrl }),
    });

    render(<URLShortener />);

    const input = screen.getByPlaceholderText(/paste your long url/i);
    const submitButton = screen.getByRole("button", { name: /shorten/i });

    await userEvent.type(input, "https://google.com");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/your shortened url is ready/i)
      ).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockShortUrl))).toBeInTheDocument();
    });
  });

  it("copies shortened URL to clipboard", async () => {
    const mockShortUrl = "abc123";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ shortUrl: mockShortUrl }),
    });

    render(<URLShortener />);

    const input = screen.getByPlaceholderText(/paste your long url/i);
    await userEvent.type(input, "https://google.com");
    fireEvent.click(screen.getByRole("button", { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /copy/i }));

    expect(mockClipboard.writeText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  it("automatically fills URL from clipboard", async () => {
    const clipboardUrl = "https://google.com";
    mockClipboard.readText.mockResolvedValueOnce(clipboardUrl);

    render(<URLShortener />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(
        /paste your long url/i
      ) as HTMLInputElement;
      expect(input.value).toBe(clipboardUrl);
    });
  });

  it("handles API errors gracefully", async () => {
    const errorMessage = "API Error";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    render(<URLShortener />);

    const input = screen.getByPlaceholderText(/paste your long url/i);
    await userEvent.type(input, "https://google.com");
    fireEvent.click(screen.getByRole("button", { name: /shorten/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows browser validation for invalid URL", async () => {
    render(<URLShortener />);

    const input = screen.getByPlaceholderText(
      /paste your long url/i
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /shorten/i });

    await userEvent.type(input, "invalid-url");
    fireEvent.click(submitButton);

    expect(input.validity.valid).toBe(false);
    expect(input.validationMessage).toBeTruthy();
  });
});
