// import { useEffect, useState } from "react";
// import { convertTargetField } from "../../constants/convertTargetAndField";
// import { FieldModel, TargetModel } from "../../models";
// interface Props {
//   addReport: any;
//   addReports: any;
//   targets: TargetModel[];
//   fields: FieldModel[];
//   onOpenAiModal: (report: any) => void;
// }

// export default function AddReportItem(props: Props) {
//   const { addReport, addReports, targets, fields, onOpenAiModal } = props;
//   const [text, setText] = useState("");

//   useEffect(() => {
//     if (addReport && addReport.total) {
//       setText(addReport.total);
//     } else {
//       setText("");
//     }
//   }, [addReport]);

//   // useEffect(() => {
//   //   if (text) {
//   //     const index = addReports.findIndex((_: any) => _.id === addReport.id);
//   //     addReports[index].total = text;
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [text]);
//   return (
//     <tr key={addReport.targetId}>
//       <td>
//         <span className="field-badge">
//           {convertTargetField(addReport.targetId, targets, fields).nameField}
//         </span>
//       </td>

//       <td>
//         <div className="target-name">
//           {convertTargetField(addReport.targetId, targets, fields).nameTarget}
//         </div>
//         <span className="goal-level mt-2">
//           Level:{" "}
//           {convertTargetField(addReport.targetId, targets, fields).levelTarget}
//         </span>
//       </td>

//       <td>{addReport.intervention || "Chưa có"}</td>

//       <td>{addReport.content || "Chưa có nội dung"}</td>

//       <td>
//         <div className="summary-ai-wrap">
//           <textarea
//             className="form-control report-textarea"
//             rows={4}
//             cols={250}
//             placeholder="Nhập đánh giá, nhận xét..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button
//             type="button"
//             className="btn-ai-summary"
//             onClick={() => onOpenAiModal(addReport)}
//           >
//             <i className="bi bi-stars me-1" />
//             Dùng AI
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// }

import { convertTargetField } from "../../constants/convertTargetAndField";
import { FieldModel, TargetModel } from "../../models";

interface Props {
  addReport: any;
  targets: TargetModel[];
  fields: FieldModel[];
  onOpenAiModal: (report: any) => void;
  onChangeTotal: (id: string, value: string) => void;
}

export default function AddReportItem(props: Props) {
  const { addReport, targets, fields, onOpenAiModal, onChangeTotal } = props;

  const targetInfo = convertTargetField(addReport.targetId, targets, fields);

  return (
    // <tr key={addReport.targetId}>
    //   <td>
    //     <span className="field-badge">{targetInfo.nameField}</span>
    //   </td>

    //   <td>
    //     <div className="target-name">{targetInfo.nameTarget}</div>
    //     <span className="goal-level mt-2">Level: {targetInfo.levelTarget}</span>
    //   </td>

    //   <td>{addReport.intervention || "Chưa có"}</td>
    //   <td>{addReport.content || "Chưa có nội dung"}</td>

    //   <td>
    //     <div className="summary-ai-wrap">
    //       <textarea
    //         className="form-control report-textarea"
    //         rows={4}
    //         cols={250}
    //         placeholder="Nhập đánh giá, nhận xét..."
    //         value={addReport.total || ""}
    //         onChange={(e) => onChangeTotal(addReport.id, e.target.value)}
    //       />

    //       <button
    //         type="button"
    //         className="btn-ai-summary"
    //         onClick={() => onOpenAiModal(addReport)}
    //       >
    //         <i className="bi bi-stars me-1" />
    //         Dùng AI
    //       </button>
    //     </div>
    //   </td>
    // </tr>
    <tr>
      <td className="area-cell">
        <span className="field-badge">{targetInfo.nameField}</span>
      </td>

      <td className="goal-cell">
        <div className="target-name">{targetInfo.nameTarget}</div>

        <div>
          <span className="goal-level">Level: {targetInfo.levelTarget}</span>
        </div>
      </td>

      <td className="support-cell">{addReport.intervention || "Chưa có"}</td>

      <td className="content-cell">
        {addReport.content || "Chưa có nội dung"}
      </td>

      <td className="observe-cell">
        <div className="summary-ai-wrap">
          <textarea
            className="form-control report-textarea"
            rows={5}
            placeholder="Nhập đánh giá, nhận xét..."
            value={addReport.total || ""}
            onChange={(e) => onChangeTotal(addReport.id, e.target.value)}
          />

          <button
            type="button"
            className="btn-ai-summary"
            onClick={() => onOpenAiModal(addReport)}
          >
            <i className="bi bi-stars me-1" />
            Dùng AI
          </button>
        </div>
      </td>
    </tr>
  );
}
