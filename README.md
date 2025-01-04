# Terminal Portfolio Website

A terminal-style portfolio website built with React, TypeScript and Styled-Components. Features multiple themes and keyboard shortcuts for enhanced functionality.

## Personalization

The portfolio is fully configurable through a JSON configuration file. You can customize both personal information and system settings:

### Configuration Options

```json
{
  "personal": {
    "name": "Your name",
    "jobTitle": "Your role",
    "location": "Your location",
    "description": "Brief bio",
    "email": "your.email@example.com",
    "education": [...],
    "projects": [...],
    "socials": [...]
  },
  "system": {
    "homedir": "/home/username",
    "gui": {
      "url": "https://your-portfolio-website.com"
    },
    "terminal": {
      "user": "guest",
      "host": "portfolio"
    }
  }
}
```

### Setting Up Your Configuration

1. Option 1 - Using a GitHub Gist (Recommended):
   - Go to https://gist.github.com
   - Create a new public Gist named `config.json`
   - Copy the contents from `config.template.json` and update with your information
   - Save the Gist and copy the raw URL (click the "Raw" button)
   - Create a `.env` file in the root directory:
     ```bash
     echo "VITE_CONFIG_GIST_URL=<your-gist-raw-url>" > .env
     ```
   
   Note: Make sure to use the "Raw" URL from your Gist (click the "Raw" button and copy the URL).
   The app will automatically handle fetching the configuration using a CORS proxy.

2. Option 2 - Using Local Config:
   - Copy `config.template.json` to create your own configuration:
     ```bash
     cp config.template.json config.json
     ```
   - Update the values in `config.json` with your information

### System Customization

The `system` section in the config allows you to customize:
- Terminal appearance (`user@host` display)
- Home directory path (shown in pwd command)
- GUI website URL (opened by 'gui' command)

## Features

- Responsive Design 📱💻
- Multiple themes 🎨
- Autocomplete feature ✨ (TAB | Ctrl + i)
- Go previous and next command ⬆️⬇️
- View command history 📖
- PWA and Offline Support 🔥
- Well-tested ✅

## Tech Stack

**Frontend** - [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)  
**Styling** - [Styled-Components](https://styled-components.com/)  
**UI/UX** - [Figma](https://figma.com/)  
**State Management** - [ContextAPI](https://reactjs.org/docs/context.html)  
**Testing** - [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)  
**Deployment** - [Netlify](https://app.netlify.com/)

## Multiple Themes

Currently, this website supports 6 themes. Type `themes` in the terminal for more info.

## Running Locally

Fork or clone this repository to create your own terminal portfolio:

```bash
# Clone the repository
git clone https://github.com/yourusername/terminal-portfolio.git

# Navigate to project directory
cd terminal-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The portfolio will first try to load configuration from the Gist URL if provided,
otherwise it will fall back to using the local configuration.

## Credits

This project was inspired by:
- [term m4tt72](https://term.m4tt72.com/)
- [Forrest](https://fkcodes.com/)

## Docker Setup

You can run this application using Docker in both development and production modes.

### Prerequisites

- Docker
- Docker Compose

### Development

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration

3. Start the development container:
   ```bash
   docker compose up dev
   ```

The development server will be available at http://localhost:3000

### Production

1. Build and start the production container:
   ```bash
   docker compose up prod -d
   ```

The production build will be available at http://localhost:80

### Environment Variables

- `VITE_CONFIG_GIST_URL`: Your GitHub Gist URL for configuration
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Port number (optional, defaults to 3000 for dev and 80 for prod)
