import { useContext, useEffect } from "react";
import {
  checkRedirect,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../utils/funcs";
import {
  ProjectContainer,
  ProjectDesc,
  ProjectsIntro,
  ProjectTitle,
} from "../styles/Projects.styled";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { useConfig } from "../../ConfigContext";

const Projects: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const { projects } = useConfig().personal;

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== check current command is redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "projects")) {
      projects.forEach(({ url }, index) => {
        index === parseInt(arg[1]) - 1 && window.open(url, "_blank");
      });
    }
  }, [arg, rerender, currentCommand, projects]);

  /* ===== check arg is valid ===== */
  const checkArg = () => {
    const validArgs = Array.from({ length: projects.length }, (_, i) => (i + 1).toString());
    return isArgInvalid(arg, "go", validArgs) ? (
      <Usage cmd="projects" />
    ) : null;
  };

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <div data-testid="projects">
      <ProjectsIntro>
        “Talk is cheap. Show me the code”? I got you. <br />
        Here are some of my projects you shouldn't miss
      </ProjectsIntro>
      {projects.map(({ title, description }, index) => (
        <ProjectContainer key={index}>
          <ProjectTitle>{`${index + 1}. ${title}`}</ProjectTitle>
          <ProjectDesc>{description}</ProjectDesc>
        </ProjectContainer>
      ))}
      <Usage cmd="projects" marginY />
    </div>
  );
};

export default Projects;
