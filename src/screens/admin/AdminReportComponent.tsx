import { Edit2 } from "iconsax-react";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { ChildrenModel, PlanModel, ReportModel } from "../../models";
import { handleChildFromId } from "../../constants/handleChildFromId";

interface Props {
  report: ReportModel;
  children: ChildrenModel[];
  setReportEdit: any;
}

export default function AdminReportComponent(props: Props) {
  const { report, children, setReportEdit } = props;

  

  return (
    <tr>
      <td>{handleChildFromId(report.childId, children)}</td>
      <td>{report.title}</td>
      <td>{report.status}</td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setReportEdit(report)}
        />
      </td>
    </tr>
  );
}
