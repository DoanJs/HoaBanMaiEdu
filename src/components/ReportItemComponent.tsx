import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { getDocData } from "../constants/firebase/getDocData";
import { PlanTaskModel } from "../models/PlanTaskModel";
import { ReportTaskModel } from "../models/ReportTaskModel";
import useFieldStore from "../zustand/useFieldStore";
import useTargetStore from "../zustand/useTargetStore";

interface Props {
  reportTask: ReportTaskModel;
  reportTasks: ReportTaskModel[];
  onSetReportTasks: any;
  setDisable: any;
  status: string;
}

export default function ReportItemComponent(props: Props) {
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
        (target) => target.id === planTask.targetId
      );
      if (indexTarget !== -1) {
        const indexField = fields.findIndex(
          (_) => _.id === targets[indexTarget].fieldId
        );
        return {
          target: targets[indexTarget],
          field: fields[indexField],
        };
      }
    }
  };

  return (
    <tr>
      <th scope="row">{showTarget()?.field.name}</th>
      <td>{showTarget()?.target.name}</td>
      <td>{planTask?.intervention}</td>
      <td>{planTask?.content}</td>

      <td  style={{width:'50%'}}>
        {status === "pending" ? (
          <textarea
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Nhập đánh giá"
            rows={6}
            cols={100}
            style={{ borderColor: colors.primary }}
            id="floatingTextarea2"
            value={content}
          ></textarea>
        ) : (
          content
        )}
      </td>
    </tr>
  );
}
