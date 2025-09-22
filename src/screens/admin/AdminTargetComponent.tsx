import { Edit2 } from "iconsax-react";
import { TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { sizes } from "../../constants/sizes";
import { FieldModel, TargetModel } from "../../models";
import { widthSmall } from "../../constants/reponsive";

interface Props {
  target: TargetModel;
  targets: TargetModel[];
  fields: FieldModel[];
  // teachers: UserModel[]
  setTargetdEdit: any
}

export default function AdminTargetComponent(props: Props) {
  const { target, targets, fields, setTargetdEdit } = props;
  // const [teacherChilds, setTeacherChilds] = useState<any[]>([]);

  // useEffect(() => {
  //   if (child && child.teacherIds.length > 0) {
  //     const items = child.teacherIds.map((teacherId) => {
  //       const index = teachers.findIndex((_) => _.id === teacherId)

  //       return { fullName: teachers[index].fullName, id: teachers[index].id }
  //     })

  //     setTeacherChilds(items)

  //   }
  // }, [child])

  return (
    <tr>
      <td>
        {target.name}
        <TextComponent
          text={
            "-->" + convertTargetField(target.id, targets, fields).nameField
          }
          size={sizes.bigText}
          styles={{ fontWeight: "bold" }}
        />
      </td>
      <td>{target.level}</td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color='coral'
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() =>setTargetdEdit(target)}
        />
      </td>
    </tr>
  );
}
