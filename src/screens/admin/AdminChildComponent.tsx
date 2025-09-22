import { Edit2 } from "iconsax-react";
import { useEffect, useState } from "react";
import { TextComponent } from "../../components";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, UserModel } from "../../models";

interface Props {
  child: ChildrenModel;
  teachers: UserModel[];
  setChildEdit: any;
}

export default function AdminChildComponent(props: Props) {
  const { child, teachers, setChildEdit } = props;
  const [teacherChilds, setTeacherChilds] = useState<any[]>([]);

  useEffect(() => {
    if (child && child.teacherIds.length > 0) {
      const items = child.teacherIds.map((teacherId) => {
        const index = teachers.findIndex((_) => _.id === teacherId);

        return { fullName: teachers[index].fullName, id: teachers[index].id };
      });
      setTeacherChilds(items);
    }
  }, [child]);

  return (
    <tr>
      <td>
        {child.fullName}
        <TextComponent
          text={`${child.id}`}
          size={widthSmall ? sizes.text : sizes.bigText}
          styles={{ fontWeight: "bold" }}
        />
      </td>
      <td>
        {teacherChilds.map((_, index) => (
          <TextComponent
            key={index}
            text={`${_.fullName}`}
            size={widthSmall ? sizes.text : sizes.bigText}
          />
        ))}
      </td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setChildEdit(child)}
        />
      </td>
    </tr>
  );
}
