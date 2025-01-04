import {
  AboutWrapper,
  HighlightAlt,
  HighlightSpan,
} from "../styles/About.styled";
import { useConfig } from "../../ConfigContext";

const About: React.FC = () => {
  const { name, jobTitle, location, description } = useConfig().personal;
  return (
    <AboutWrapper data-testid="about">
      <p>
        Hi, my name is <HighlightSpan>{name}</HighlightSpan>!
      </p>
      <p>
        I'm <HighlightAlt>{jobTitle}</HighlightAlt> based in {location}.
      </p>
      <p>
        {description}
      </p>
    </AboutWrapper>
  );
};

export default About;
