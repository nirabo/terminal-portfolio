import {
  Cmd,
  HeroContainer,
  Link,
  Seperator,
} from "../styles/Welcome.styled";
import { useConfig } from "../../ConfigContext";

const Welcome: React.FC = () => {
  const { githubRepo } = useConfig().personal;
  return (
    <HeroContainer data-testid="welcome">
      <div className="info-section">
        <Seperator>----</Seperator>
        <div>
          This project's source code can be found in this project's{" "}
          <Link href={githubRepo}>GitHub repo</Link>
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
