import { Edit2 } from "iconsax-react";
import { TextComponent } from "../../components";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { UserModel } from "../../models";

interface Props {
  teacher: UserModel;
  setTeacherEdit: any;
}

export default function AdminTeacherComponent(props: Props) {
  const { teacher, setTeacherEdit } = props;

  return (
    <tr>
      <td>
        {teacher.fullName}
        <TextComponent
          text={"-->" + teacher.id}
          size={sizes.bigText}
          styles={{ fontWeight: "bold" }}
        />
      </td>
      <td>{teacher.role}</td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setTeacherEdit(teacher)}
        />
      </td>
    </tr>
  );
}
