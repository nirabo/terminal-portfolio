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
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      
      // Try to load from Gist if URL is provided
      const gistUrl = import.meta.env.VITE_CONFIG_GIST_URL;
      if (gistUrl) {
        try {
          console.log("Attempting to fetch config from Gist:", gistUrl);
          const corsProxy = 'https://api.allorigins.win/get?url=';
          const response = await fetch(corsProxy + encodeURIComponent(gistUrl));
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          const text = data.contents;
          console.log("Raw gist content:", text);
          
          try {
            const parsedData = JSON.parse(text);
            console.log("Parsed gist data:", parsedData);
            
            // Transform the flat gist structure into our expected Config structure
            if (parsedData && typeof parsedData === 'object') {
              const transformedConfig: Config = {
                personal: {
                  name: parsedData.name || defaultConfig.personal.name,
                  jobTitle: parsedData.title || defaultConfig.personal.jobTitle,
                  location: parsedData.location || defaultConfig.personal.location,
                  description: parsedData.summary || defaultConfig.personal.description,
                  githubRepo: parsedData.githubRepo || defaultConfig.personal.githubRepo,
                  version: parsedData.version || defaultConfig.personal.version,
                  welcomeMessage: parsedData.welcomeMessage || defaultConfig.personal.welcomeMessage,
                  email: parsedData.email || defaultConfig.personal.email,
                  education: Array.isArray(parsedData.education) 
                    ? parsedData.education.map((edu: any) => ({
                        institution: edu.institution || edu.school || "",
                        degree: edu.degree || edu.field || "",
                        year: edu.year || edu.graduationYear || ""
                      }))
                    : defaultConfig.personal.education,
                  // Convert experience entries to projects if no projects exist
                  projects: Array.isArray(parsedData.projects) 
                    ? parsedData.projects.map((proj: any) => ({
                        title: proj.title || proj.name || "",
                        description: proj.description || "",
                        url: proj.url || proj.link || ""
                      }))
                    : Array.isArray(parsedData.experience)
                      ? parsedData.experience.map((exp: any) => ({
                          title: exp.role || exp.title || "",
                          description: exp.description || exp.summary || "",
                          url: exp.url || exp.link || ""
                        }))
                      : defaultConfig.personal.projects,
                  // Initialize empty socials array if none provided
                  socials: Array.isArray(parsedData.socials)
                    ? parsedData.socials.map((social: any) => ({
                        platform: social.platform || social.name || "",
                        url: social.url || social.link || ""
                      }))
                    : []
                },
                system: {
                  homedir: parsedData.homedir || defaultConfig.system.homedir,
                  gui: {
                    url: parsedData.guiUrl || defaultConfig.system.gui.url
                  },
                  terminal: {
                    user: parsedData.terminalUser || defaultConfig.system.terminal.user,
                    host: parsedData.terminalHost || defaultConfig.system.terminal.host
                  }
                }
              };
              
              console.log("Successfully transformed and loaded config:", transformedConfig);
              setConfig(transformedConfig);
              setIsLoading(false);
              return;
            }
            
            console.error("Invalid data structure in gist");
            throw new Error("Invalid data structure in gist");
          } catch (parseError) {
            console.error("Failed to parse gist content:", parseError);
            throw parseError;
          }
        } catch (error) {
          console.error("Failed to load Gist config:", error);
          // Don't throw here, let it fall through to use default config
        }
      }

      // Only reach here if no Gist URL or loading failed
      console.log("Using template config as fallback");
      setConfig(defaultConfig);
      setIsLoading(false);
    };

    loadConfig();
  }, []);

  if (isLoading || !config) {
    return null; // Or return a loading spinner component
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
