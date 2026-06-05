import { useEffect, useState } from "react";
import { getDocData } from "../../constants/firebase/getDocData";
import { PlanTaskModel, ReportTaskModel } from "../../models";
import { useFieldStore, useTargetStore } from "../../zustand";

interface Props {
  reportTask: ReportTaskModel;
  reportTasks: ReportTaskModel[];
  onSetReportTasks: any;
  setDisable: any;
  status: string;
}

export default function ReportItem(props: Props) {
  const { reportTask, reportTasks, onSetReportTasks, setDisable, status } =
    props;
  const { targets } = useTargetStore();
  const [planTask, setPlanTask] = useState<PlanTaskModel>();
  const { fields } = useFieldStore();
  const [content, setContent] = useState("");
  const [contentSource, setContentSource] = useState("");

  useEffect(() => {
    if (reportTask) {
      getDocData({
        id: reportTask.planTaskId,
        nameCollect: "planTasks",
        setData: setPlanTask,
      });
      setContent(reportTask.content);
      setContentSource(reportTask.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportTask]);

  useEffect(() => {
    const index = reportTasks.findIndex((_) => _.id === reportTask.id);
    if (content && content !== contentSource) {
      reportTasks[index].content = content;
      reportTasks[index].isEdit = true;
      onSetReportTasks(reportTasks);
    } else {
      reportTasks[index].isEdit = false;
    }

    const isEdit = reportTasks.some((reportTask) => reportTask.isEdit);
    setDisable(!isEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const showTarget = () => {
    if (planTask) {
      const indexTarget = targets.findIndex(
        (target) => target.id === planTask.targetId,
      );
      if (indexTarget !== -1) {
        const indexField = fields.findIndex(
          (_) => _.id === targets[indexTarget].fieldId,
        );
        return {
          target: targets[indexTarget],
          field: fields[indexField],
          level: targets[indexTarget].level,
        };
      }
    }
  };

  return (
    // <tr>
    //   <td className="area-cell">{showTarget()?.field.name}</td>
    //   <td className="goal-cell">
    //     {showTarget()?.target.name}
    //     <div>
    //       <span className="goal-level">
    //         Level: {showTarget()?.target.level}
    //       </span>
    //     </div>
    //   </td>
    //   <td>{planTask?.intervention}</td>
    //   <td>{planTask?.content}</td>
    //   <td className="observe-cell">
    //     {status === "pending" ? (
    //       <textarea
    //         onChange={(e) => setContent(e.target.value)}
    //         className="form-control"
    //         placeholder="Nhập đánh giá"
    //         rows={6}
    //         cols={100}
    //         style={{ borderColor: colors.primary }}
    //         id="floatingTextarea2"
    //         value={content}
    //       ></textarea>
    //     ) : (
    //       content
    //     )}
    //   </td>
    // </tr>
    <tr>
      <td className="area-cell">{showTarget()?.field.name}</td>

      <td className="goal-cell">
        <div className="fw-semibold text-green-dark">
          {showTarget()?.target.name}
        </div>

        <div>
          <span className="goal-level">
            Level: {showTarget()?.target.level}
          </span>
        </div>
      </td>

      <td className="support-cell">
        {planTask?.intervention}
      </td>

      <td className="content-cell">
        {planTask?.content}
      </td>

      <td className="observe-cell">
        {status === "pending" ? (
          <textarea
            onChange={(e) => setContent(e.target.value)}
            className="form-control report-textarea"
            placeholder="Nhập đánh giá"
            rows={5}
            value={content}
          />
        ) : (
          <div className="report-content-text">{content}</div>
        )}
      </td>
    </tr>
  );
}
