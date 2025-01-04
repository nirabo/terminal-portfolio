import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import { ConfigContext } from "../ConfigContext";

// Mock config data for testing
const mockConfig = {
  personal: {
    name: "Test User",
    jobTitle: "Software Engineer",
    location: "Test Location",
    description: "Test description",
    githubRepo: "https://github.com/test/repo",
    version: "1.0.0",
    welcomeMessage: "Welcome to test portfolio",
    email: "guest",
    education: [
      {
        institution: "Test University",
        degree: "Test Degree",
        year: "2023"
      }
    ],
    projects: [
      {
        title: "Project 1",
        description: "Test project 1",
        url: "https://project1.com"
      },
      {
        title: "Project 2",
        description: "Test project 2",
        url: "https://project2.com"
      },
      {
        title: "Project 3",
        description: "Test project 3",
        url: "https://project3.com"
      },
      {
        title: "Project 4",
        description: "Test project 4",
        url: "https://project4.com"
      }
    ],
    socials: [
      { platform: "GitHub", url: "https://github.com/test" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/test" },
      { platform: "Twitter", url: "https://twitter.com/test" },
      { platform: "Instagram", url: "https://instagram.com/test" }
    ]
  },
  system: {
    homedir: "/home/user",
    gui: {
      url: "https://test-portfolio.com"
    },
    terminal: {
      user: "visitor",
      host: "portfolio"
    }
  }
};

afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ConfigContext.Provider value={mockConfig}>
        {children}
      </ConfigContext.Provider>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
