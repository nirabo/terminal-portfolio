import { useContext } from "react";
import _ from "lodash";
import { Wrapper } from "../styles/Output.styled";
import { termContext } from "../Terminal";
import { useConfig } from "../../ConfigContext";

const Email: React.FC = () => {
  const { email } = useConfig().personal;
  const { history, rerender } = useContext(termContext);

  /* ===== get current command ===== */
  const currentCommand = _.split(history[0], " ");

  if (rerender && currentCommand[0] === "email" && currentCommand.length <= 1) {
    window.open("mailto:" + email, "_self");
  }

  return (
    <Wrapper>
      <span>{email}</span>
    </Wrapper>
  );
};

export default Email;
