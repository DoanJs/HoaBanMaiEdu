import { colors } from "../constants/colors";
import { PlanTaskModel } from "../models/PlanTaskModel";
import useTargetStore from "../zustand/useTargetStore";

interface Props {
  planTask: PlanTaskModel
}

export default function PlanItemComponent(props: Props) {
  const { planTask } = props
  const { targets } = useTargetStore()

  const showTarget = () => {
    let result: string = ''
    const index = targets.findIndex((target) => target.id === planTask.targetId)
    if (index !== -1) {
      result = targets[index].name
    }

    return result
  }

  return (
    <tr>
      <td scope="row">Ngôn ngữ hiểu</td>
      <td>
        {showTarget()}
      </td>
      <td>{planTask?.intervention}</td>
      <td>
        <textarea
          onChange={() => { }}
          className="form-control"
          placeholder="Nhập đánh giá"
          rows={6}
          cols={200}
          style={{ borderColor: colors.primary }}
          id="floatingTextarea2"
          value={`Các hoạt động vui chơi tương tác với bạn, cô hỗ trợ tạo tình huống dẫn đến các sự việc giúp con hứng thú và ghi nhớ, kết thúc hoạt động cô hỏi- đáp và gợi ý để con kể lại.`}></textarea>
      </td>
    </tr>
  );
}
