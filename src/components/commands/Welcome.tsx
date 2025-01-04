import { Cmd, HeroContainer, Link, Seperator } from "../styles/Welcome.styled";

const Welcome: React.FC = () => {
  return (
    <HeroContainer data-testid="welcome">
      <div className="info-section">
        <Seperator>----</Seperator>
        <div>
          This project's source code can be found in this project's{" "}
          <Link
            href={
              import.meta.env.VITE_GITHUB_REPO ||
              "https://github.com/yourusername/terminal-portfolio"
            }
          >
            GitHub repo
          </Link>
          .
        </div>
        <Seperator>----</Seperator>
        <div>
          For a list of available commands, type `<Cmd>help</Cmd>`.
        </div>
      </div>
    </HeroContainer>
  );
};

export default Welcome;
