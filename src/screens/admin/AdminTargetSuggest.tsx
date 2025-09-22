import { Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { ModalDeleteComponent, RowComponent, SearchComponent, SpaceComponent, SpinnerComponent, TextComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, FieldModel, TargetModel, UserModel } from "../../models";
import { useUserStore } from "../../zustand";
import { getDocsData } from "../../constants/firebase/getDocsData";
import AdminTargetComponent from "./AdminTargetComponent";
interface OptionType {
  id: string;
  fullName: string;
}

export default function AdminTargetSuggest() {
  const { user } = useUserStore()
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [children, setChildren] = useState<ChildrenModel[]>([]);
  const [newChildren, setNewChildren] = useState<any[]>([]);
  const [childEdit, setChildEdit] = useState<ChildrenModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [selectTeachers, setSelectTeachers] = useState<OptionType[]>([]);

  const [targets, setTargets] = useState<TargetModel[]>([]);
  const [newTargets, setNewTargets] = useState<TargetModel[]>([]);
  const [fields, setFields] = useState<FieldModel[]>([]);
  const [form, setForm] = useState({
    nameTarget: '',
    nameSuggest: '',
    level: 0,
    nameField: ''
  });

  // useEffect(() => {
  //   if (childEdit) {
  //     setForm({
  //       fullName: childEdit.fullName,
  //       avatar: childEdit.avatar
  //     })
  //     setSelectTeachers(childEdit.teacherIds.map((_) => {
  //       const indexTeacher = teachers.findIndex((teacher) => teacher.id === _)
  //       return { id: _, fullName: teachers[indexTeacher].fullName }
  //     }))
  //   }
  // }, [childEdit])
  // useEffect(() => {
  //   if (form.avatar && form.fullName && selectTeachers.length > 0) {
  //     setDisable(false)
  //   } else {
  //     setDisable(true)
  //   }
  // }, [form, selectTeachers])

  useEffect(() => {
    if (user) {
      getDocsData({
        nameCollect: 'targets',
        setData: setTargets,
      })
      getDocsData({
        nameCollect: 'fields',
        setData: setFields
      })
    }
  }, [user])

  useEffect(() => {
    if (targets.length > 0) {
      setNewTargets(targets)
    }
  }, [targets])

  // const handleChild = async () => {
  //   const data = {
  //     fullName: form.fullName,
  //     avatar: form.avatar,
  //     teacherIds: selectTeachers.map((_) => _.id)
  //   }

  //   setIsLoading(true)
  //   if (childEdit) {
  //     updateDocData({
  //       nameCollect: 'children',
  //       id: childEdit.id,
  //       valueUpdate: {
  //         ...data,
  //         createAt: serverTimestamp(),
  //         updateAt: serverTimestamp()
  //       },
  //       metaDoc: 'children'
  //     }).then(result => {
  //       setIsLoading(false)
  //       setForm({ fullName: '', avatar: '' })
  //       setSelectTeachers([])
  //       setChildEdit(undefined)
  //       handleToastSuccess(`Chỉnh sửa thông tin trẻ thành công ! (${childEdit.fullName}) `)
  //     }).catch((eror) => {
  //       setIsLoading(false)
  //       handleToastError('Chỉnh sửa thông tin trẻ mới thất bại !')
  //     })
  //   } else {
  //     addDocData({
  //       nameCollect: 'children',
  //       value: {
  //         ...data,
  //         createAt: serverTimestamp(),
  //         updateAt: serverTimestamp()
  //       },
  //       metaDoc: 'children'
  //     }).then(result => {
  //       setNewChildren(
  //         [
  //           ...newChildren,
  //           {
  //             ...data,
  //             id: result.id,
  //             createAt: serverTimestamp(),
  //             updateAt: serverTimestamp()
  //           }
  //         ])
  //       setIsLoading(false)
  //       setForm({ fullName: '', avatar: '' })
  //       setSelectTeachers([])
  //       handleToastSuccess(`Thêm trẻ mới thành công ! (${result.id}) `)
  //     }).catch((eror) => {
  //       setIsLoading(false)
  //       handleToastError('Thêm trẻ mới thất bại !')
  //     })
  //   }


  // }


  return (
    <RowComponent styles={{
      alignItems: 'flex-start',
      height: '90%'
    }}>
      <div style={{ flex: 2, height: '100%', overflowY: 'scroll', padding: 16 }}>
        <RowComponent justify="space-between">
          <SearchComponent title="Tìm mục tiêu" placeholder="Nhập mục tiêu" width={'75%'}
            arrSource={children} type="searchChildren" onChange={(val) => setNewChildren(val)} />
          <TextComponent text={`Có ${newChildren.length} mục tiêu`} styles={{ fontWeight: 'bold' }} />
        </RowComponent>
        <SpaceComponent height={8} />
        <table className="table table-bordered">
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th scope="col">Tên mục tiêu</th>
              <th scope="col">Lĩnh vực</th>
              <th scope="col">Level</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {
              newTargets.length > 0 &&
              newTargets.map((target, index) =>
                <AdminTargetComponent key={index} target={target} />)
            }

          </tbody>
        </table>
      </div>

      <SpaceComponent width={20} />

      <div style={{ flex: 1, background: colors.primaryLight, padding: '20px 40px', borderRadius: 10 }}>
        <RowComponent justify="space-evenly">
          <TextComponent text={childEdit ? 'Chỉnh sửa mục tiêu' : "Thêm mục tiêu"} size={sizes.title} styles={{ fontWeight: 'bold' }} />
          {childEdit && <RowComponent styles={{ cursor: 'pointer' }}>
            <Trash size={20} color={colors.red} variant="Bold" style={{ cursor: 'pointer' }}
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            />
            <SpaceComponent width={4} />
            <TextComponent text="Xóa mục tiêu" size={sizes.bigText} />
          </RowComponent>}
        </RowComponent>
        <SpaceComponent height={20} />

        <div>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Lĩnh vực
          </label>
          <Select
            getOptionLabel={(option) => option.fullName}
            getOptionValue={(option) => option.id.toString()}
            isMulti
            options={teachers}
            placeholder='Chọn lĩnh vực'
            value={selectTeachers}
            onChange={(value: MultiValue<OptionType>) => {
              setSelectTeachers(value as OptionType[]);
            }}
          />
        </div>
        <div>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Nội dung mục tiêu:
          </label>
          <textarea
            value={form.nameTarget}
            onChange={(e) => setForm({ ...form, nameTarget: e.target.value })}
            className="form-control"
            placeholder="Nhập nội dung mục tiêu"
            rows={6}
          ></textarea>

        </div>
        <div>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Level mục tiêu
          </label>
          <Select
            getOptionLabel={(option) => option.fullName}
            getOptionValue={(option) => option.id.toString()}
            isMulti
            options={teachers}
            placeholder='Chọn level của mục tiêu'
            value={selectTeachers}
            onChange={(value: MultiValue<OptionType>) => {
              setSelectTeachers(value as OptionType[]);
            }}
          />

        </div>
        <div>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Gợi ý cho mục tiêu
          </label>

          <textarea
            value={form.nameTarget}
            onChange={(e) => setForm({ ...form, nameSuggest: e.target.value })}
            className="form-control"
            placeholder="Nhập nội dung gợi ý"
            rows={6}
          ></textarea>
        </div>

        <SpaceComponent height={20} />
        <button
          style={{
            width: "100%",
            background: disable ? colors.gray : colors.orange,
            borderColor: disable ? colors.gray : colors.orange,
            fontWeight: "bold",
          }}
          type="button"
          className="btn btn-primary"
          onClick={disable ? undefined : () => { }}
        >
          {isLoading ? <SpinnerComponent /> : <>{childEdit ? 'Cập nhật' : 'Thêm mới'}</>}
        </button>
      </div>

      <LoadingOverlay show={isLoading} />

      <ModalDeleteComponent
        data={{
          id: childEdit?.id as string,
          nameCollect: 'children',
          itemTasks: []
        }}

      />
    </RowComponent>
  );
}
