import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";
import { useConfig } from "../ConfigContext";

const TermInfo: React.FC = () => {
  const config = useConfig();
  const terminalUser = config?.system?.terminal?.user || 'guest';
  const terminalHost = config?.system?.terminal?.host || 'portfolio';
  const homeDir = config?.system?.homedir || '/home/user';

  return (
    <Wrapper>
      <User>{terminalUser}@{terminalHost}</User>
      <WebsiteName>:$ ~ {homeDir}</WebsiteName>
    </Wrapper>
  );
};

export default TermInfo;
