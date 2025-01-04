import { useContext, useEffect } from "react";
import { ProjectsIntro } from "../styles/Projects.styled";
import { Cmd, CmdDesc, CmdList, HelpWrapper } from "../styles/Help.styled";
import {
  checkRedirect,
  generateTabs,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../utils/funcs";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { useConfig } from "../../ConfigContext";

const Socials: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const { socials } = useConfig().personal;

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== check current command makes redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "socials")) {
      socials.forEach(({ url }, index) => {
        index === parseInt(arg[1]) - 1 && window.open(url, "_blank");
      });
    }
  }, [arg, rerender, currentCommand, socials]);

  /* ===== check arg is valid ===== */
  const checkArg = () => {
    const validArgs = Array.from({ length: socials.length }, (_, i) => (i + 1).toString());
    return isArgInvalid(arg, "go", validArgs) ? (
      <Usage cmd="socials" />
    ) : null;
  };

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <HelpWrapper data-testid="socials">
      <ProjectsIntro>Here are my social links</ProjectsIntro>
      {socials.map(({ platform, url }, index) => (
        <CmdList key={platform}>
          <Cmd>{`${index + 1}. ${platform}`}</Cmd>
          {generateTabs(3)}
          <CmdDesc>- {url}</CmdDesc>
        </CmdList>
      ))}
      <Usage cmd="socials" marginY />
    </HelpWrapper>
  );
};

export default Socials;
