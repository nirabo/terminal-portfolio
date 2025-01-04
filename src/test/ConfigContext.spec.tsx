import { vi, describe, it, expect, beforeEach, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

// Create a mutable version of ImportMetaEnv for testing
type MutableImportMetaEnv = {
  -readonly [K in keyof ImportMetaEnv]: ImportMetaEnv[K];
};

// Mock the module before importing
vi.mock("../ConfigContext", async () => {
  // Create base mock environment
  const mockEnv: MutableImportMetaEnv = {
    MODE: "test",
    DEV: true,
    PROD: false,
    SSR: false,
    BASE_URL: "/",
    VITE_CONFIG_GIST_URL: "",
  };

  // Create a proxy to handle property assignments
  const envProxy = new Proxy<MutableImportMetaEnv>(mockEnv, {
    set(target: MutableImportMetaEnv, prop: string, value: unknown) {
      target[prop] = value;
      return true;
    },
  });

  // Mock import.meta
  vi.stubGlobal("import", {
    meta: {
      env: envProxy,
    },
  });

  const actual = await vi.importActual<typeof import("../ConfigContext")>(
    "../ConfigContext"
  );
  return actual;
});

// Now import the components that use import.meta.env
import { ConfigProvider, useConfig } from "../ConfigContext";

// Mock component to test the useConfig hook
const TestComponent = () => {
  const config = useConfig();
  return (
    <div>
      <div data-testid="name">{config.personal.name}</div>
      <div data-testid="title">{config.personal.jobTitle}</div>
      <div data-testid="projects">{config.personal.projects.length}</div>
      <div data-testid="education">{config.personal.education.length}</div>
    </div>
  );
};

describe("ConfigContext", () => {
  const mockGistUrl = "https://api.github.com/gists/123";
  beforeAll(() => {
    // Mock console methods to suppress expected logs
    vi.spyOn(console, "log").mockImplementation(() => {
      /* no-op */
    });
    vi.spyOn(console, "error").mockImplementation(() => {
      /* no-op */
    });
  });

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetModules();
    vi.clearAllMocks();

    // Reset fetch mock
    global.fetch = vi.fn().mockRejectedValue(new Error("Fetch not mocked"));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks(); // Restore console methods
  });

  it("loads default config when no gist URL is provided", async () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("Your Name");
      expect(screen.getByTestId("title")).toHaveTextContent("Your Job Title");
    });
  });

  it("loads and transforms gist config successfully", async () => {
    // Update env through the proxy
    (import.meta.env as MutableImportMetaEnv).VITE_CONFIG_GIST_URL =
      mockGistUrl;

    // Mock successful gist response
    const mockGistData = {
      name: "John Doe",
      title: "Software Engineer",
      summary: "Experienced developer",
      experience: [
        {
          role: "Senior Dev",
          description: "Led team projects",
          url: "https://company.com",
        },
      ],
      education: [
        {
          school: "Tech University",
          field: "Computer Science",
          graduationYear: "2020",
        },
      ],
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: JSON.stringify(mockGistData) }),
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("title")).toHaveTextContent(
        "Software Engineer"
      );
      expect(screen.getByTestId("projects")).toHaveTextContent("1"); // Converted from experience
      expect(screen.getByTestId("education")).toHaveTextContent("1");
    });
  });

  it("falls back to default config on fetch error", async () => {
    // Update env through the proxy
    (import.meta.env as MutableImportMetaEnv).VITE_CONFIG_GIST_URL =
      mockGistUrl;

    global.fetch = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error("Network error")));

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("Your Name");
      expect(screen.getByTestId("title")).toHaveTextContent("Your Job Title");
    });
  });

  it("handles malformed gist data gracefully", async () => {
    // Update env through the proxy
    (import.meta.env as MutableImportMetaEnv).VITE_CONFIG_GIST_URL =
      mockGistUrl;

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: "invalid json" }),
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("Your Name");
      expect(screen.getByTestId("title")).toHaveTextContent("Your Job Title");
    });
  });

  it("transforms partial gist data correctly", async () => {
    // Update env through the proxy
    (import.meta.env as MutableImportMetaEnv).VITE_CONFIG_GIST_URL =
      mockGistUrl;

    // Mock partial data with missing fields
    const mockPartialData = {
      name: "Jane Doe",
      // Missing title, should use default
      experience: [
        {
          role: "Developer",
          description: "Built features",
        },
      ],
      // Missing education, should use default
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ contents: JSON.stringify(mockPartialData) }),
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("name")).toHaveTextContent("Jane Doe");
      expect(screen.getByTestId("title")).toHaveTextContent("Your Job Title"); // Default
      expect(screen.getByTestId("projects")).toHaveTextContent("1"); // From experience
      expect(screen.getByTestId("education")).toHaveTextContent("1"); // Default
    });
  });
});
