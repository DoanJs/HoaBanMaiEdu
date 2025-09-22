import { Edit2 } from "iconsax-react";
import { useEffect, useState } from "react";
import { TextComponent } from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, UserModel } from "../../models";

interface Props {
  child: ChildrenModel
  teachers: UserModel[]
  setChildEdit: any
}

export default function AdminChildComponent(props: Props) {
  const { child, teachers, setChildEdit } = props
  const [teacherChilds, setTeacherChilds] = useState<any[]>([]);


  useEffect(() => {
    if (child && child.teacherIds.length > 0) {
      const items = child.teacherIds.map((teacherId) => {
        const index = teachers.findIndex((_) => _.id === teacherId)

        return { fullName: teachers[index].fullName, id: teachers[index].id }
      })

      setTeacherChilds(items)

    }
  }, [child])


  return (
    <tr>
      <td>
        <TextComponent text={child.fullName} size={sizes.bigText} />
        <TextComponent text={`${child.id}`} size={sizes.bigText} />
      </td>
      <td>{
        teacherChilds.map((_, index) =>
          <TextComponent key={index} text={`${_.fullName}`} size={sizes.bigText} />)
      }</td>
      <td style={{ textAlign: 'center' }}>
        <Edit2 size={20} color={colors.green} variant="Bold"
          style={{ cursor: 'pointer' }} onClick={() => setChildEdit(child)} />
      </td>
    </tr>
  );
}