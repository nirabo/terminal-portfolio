import { EduIntro, EduList } from "../styles/Education.styled";
import { Wrapper } from "../styles/Output.styled";
import { useConfig } from "../../ConfigContext";

const Education: React.FC = () => {
  const { education } = useConfig().personal;
  return (
    <Wrapper data-testid="education">
      <EduIntro>Here is my education background!</EduIntro>
      {education.map(({ institution, degree, year }) => (
        <EduList key={institution}>
          <div className="title">{degree}</div>
          <div className="desc">{institution} | {year}</div>
        </EduList>
      ))}
    </Wrapper>
  );
};

export default Education;
