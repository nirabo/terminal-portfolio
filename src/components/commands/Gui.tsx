import { useContext } from "react";
import { termContext } from "../Terminal";
import { useConfig } from "../../ConfigContext";

const Gui: React.FC = () => {
  const { history, rerender } = useContext(termContext);
  const config = useConfig();

  /* ===== get current command ===== */
  const currentCommand = history[0];

  if (rerender && currentCommand === "gui") {
    const guiUrl = config?.system?.gui?.url || 'https://github.com/yourusername';
    window.open(guiUrl, "_blank");
  }

  return <span></span>;
};

export default Gui;
