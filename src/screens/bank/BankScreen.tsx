import { Outlet } from "react-router-dom";
import { FieldItemComponent, RowComponent } from "../../components";

export default function BankScreen() {
  // const [fields, setFields] = useState([]);

  // useEffect(() => {
  //   getDocsData({
  //     nameCollect: "fields",
  //     setData: setFields,
  //   });
  // }, []);

  return (
    <RowComponent
      styles={{
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <FieldItemComponent title="Ngôn ngữ hiểu" icon="message" />
        <FieldItemComponent title="Ngôn ngữ diễn đạt" icon="message2" />
        <FieldItemComponent title="Nhận thức" icon="notepad2" />
        <FieldItemComponent title="Vận động tinh" icon="hierarchy" />
        <FieldItemComponent title="Giao tiếp sớm" icon="profile2User" />
        <FieldItemComponent title="Hành vi/tập trung chú ý" icon="airpods" />
      </div>

      <Outlet />
    </RowComponent>
  );
}
