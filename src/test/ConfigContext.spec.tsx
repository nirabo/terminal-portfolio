import { render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider, useConfig } from '../ConfigContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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

describe('ConfigContext', () => {
  const mockGistUrl = 'https://api.github.com/gists/123';
  beforeEach(() => {
    // Reset mocks and spies
    vi.restoreAllMocks();
    vi.resetModules();
    
    // Mock fetch to return error by default
    global.fetch = vi.fn().mockRejectedValue(new Error('Fetch not mocked'));
    
    // Mock Vite's import.meta.env
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONFIG_GIST_URL: undefined,
        MODE: 'test',
        DEV: true
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('loads default config when no gist URL is provided', async () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('Your Name');
      expect(screen.getByTestId('title')).toHaveTextContent('Your Job Title');
    });
  });

  it('loads and transforms gist config successfully', async () => {
    // Update env mock with gist URL
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONFIG_GIST_URL: mockGistUrl
      }
    });

    // Mock successful gist response
    const mockGistData = {
      name: 'John Doe',
      title: 'Software Engineer',
      summary: 'Experienced developer',
      experience: [
        {
          role: 'Senior Dev',
          description: 'Led team projects',
          url: 'https://company.com'
        }
      ],
      education: [
        {
          school: 'Tech University',
          field: 'Computer Science',
          graduationYear: '2020'
        }
      ]
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: JSON.stringify(mockGistData) })
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('title')).toHaveTextContent('Software Engineer');
      expect(screen.getByTestId('projects')).toHaveTextContent('1'); // Converted from experience
      expect(screen.getByTestId('education')).toHaveTextContent('1');
    });
  });

  it('falls back to default config on fetch error', async () => {
    // Update env mock with gist URL
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONFIG_GIST_URL: mockGistUrl
      }
    });

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('Your Name');
      expect(screen.getByTestId('title')).toHaveTextContent('Your Job Title');
    });
  });

  it('handles malformed gist data gracefully', async () => {
    // Update env mock with gist URL
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONFIG_GIST_URL: mockGistUrl
      }
    });

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: 'invalid json' })
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('Your Name');
      expect(screen.getByTestId('title')).toHaveTextContent('Your Job Title');
    });
  });

  it('transforms partial gist data correctly', async () => {
    // Update env mock with gist URL
    vi.stubGlobal('import.meta', {
      env: {
        VITE_CONFIG_GIST_URL: mockGistUrl
      }
    });

    // Mock partial data with missing fields
    const mockPartialData = {
      name: 'Jane Doe',
      // Missing title, should use default
      experience: [
        {
          role: 'Developer',
          description: 'Built features'
        }
      ]
      // Missing education, should use default
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: JSON.stringify(mockPartialData) })
      })
    );

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('name')).toHaveTextContent('Jane Doe');
      expect(screen.getByTestId('title')).toHaveTextContent('Your Job Title'); // Default
      expect(screen.getByTestId('projects')).toHaveTextContent('1'); // From experience
      expect(screen.getByTestId('education')).toHaveTextContent('1'); // Default
    });
  });
});
