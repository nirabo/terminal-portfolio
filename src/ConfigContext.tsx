import { createContext, useContext, useEffect, useState } from "react";

interface Config {
  personal: {
    name: string;
    jobTitle: string;
    location: string;
    description: string;
    githubRepo: string;
    version: string;
    welcomeMessage: string;
    email: string;
    education: {
      institution: string;
      degree: string;
      year: string;
    }[];
    projects: {
      title: string;
      description: string;
      url: string;
    }[];
    socials: {
      platform: string;
      url: string;
    }[];
  };
  system: {
    homedir: string;
    gui: {
      url: string;
    };
    terminal: {
      user: string;
      host: string;
    };
  };
}

const defaultConfig: Config = {
  personal: {
    name: "Your Name",
    jobTitle: "Your Job Title",
    location: "Your Location",
    description: "A brief description about yourself",
    githubRepo: "https://github.com/yourusername/your-repo",
    version: "1.0.0",
    welcomeMessage: "Welcome to my terminal portfolio",
    email: "your.email@example.com",
    education: [
      {
        institution: "Your University",
        degree: "Your Degree",
        year: "Graduation Year"
      }
    ],
    projects: [],
    socials: []
  },
  system: {
    homedir: "/home/user",
    gui: {
      url: "https://your-portfolio-website.com"
    },
    terminal: {
      user: "guest",
      host: "portfolio"
    }
  }
};

export const ConfigContext = createContext<Config>(defaultConfig);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Try to load from Gist if URL is provided
        const gistUrl = import.meta.env.VITE_CONFIG_GIST_URL;
        if (gistUrl) {
          console.log("Attempting to fetch config from Gist:", gistUrl);
          try {
            const corsProxy = 'https://api.allorigins.win/get?url=';
            const response = await fetch(corsProxy + encodeURIComponent(gistUrl));
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const text = data.contents;
            console.log("Raw response:", text);
            
            try {
              const data = JSON.parse(text);
              if (data && data.personal) {
                console.log("Successfully loaded config from Gist");
                setConfig(data);
                return;
              }
            } catch (parseError) {
              console.error("Failed to parse Gist JSON:", parseError);
              throw new Error("Invalid JSON in Gist");
            }
          } catch (fetchError) {
            console.error("Failed to fetch from Gist:", fetchError);
            throw new Error("Failed to load Gist config");
          }
        }

        // If we reach here, either no Gist URL was provided or loading failed
        // Load the template config as fallback
        console.log("Using template config as fallback");
        setConfig(defaultConfig);
      } catch (error) {
        console.error("Config loading error:", error);
        console.log("Falling back to template config");
        setConfig(defaultConfig);
      }
    };

    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
