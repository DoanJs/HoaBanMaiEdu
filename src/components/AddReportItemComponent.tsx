import { useEffect, useState } from "react";
import { convertTargetField } from "../constants/convertTargetAndField";
import { FieldModel, TargetModel } from "../models";

interface Props {
  addReport: any,
  addReports: any
  targets: TargetModel[],
  fields: FieldModel[]
}
export default function AddReportItemComponent(props: Props) {
  const { addReport, addReports, targets, fields } = props
  const [text, setText] = useState('');

  useEffect(() => {
    if (addReport && addReport.total) {
      setText(addReport.total)
    } else {
      setText('')
    }
  }, [addReport])

  useEffect(() => {
    if (text) {
      const index = addReports.findIndex((_: any) => _.id === addReport.id);
      addReports[index].total = text
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <tr>
      <th scope="row">
        {convertTargetField(addReport.targetId, targets, fields).nameField}
      </th>
      <td>
        {convertTargetField(addReport.targetId, targets, fields).nameTarget}
      </td>
      <td>{addReport.intervention}</td>
      <td>{addReport.content}</td>
      <td>
        <textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="form-control"
          placeholder="Nhập đánh giá"
          rows={4}
          cols={300}
          id="floatingTextarea2"
        ></textarea>
      </td>
    </tr>
  );
}
