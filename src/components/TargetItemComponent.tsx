import { colors } from "../constants/colors";
import { TargetModel } from "../models/TargetModel";
interface Props {
  index: number;
  target: TargetModel
}

export default function TargetItemComponent(props: Props) {
  const { index , target} = props;
  return (
    <tr style={{ color: colors.textBold }}>
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td>
       {target.name}
      </td>
      <td style={{ textAlign: "center" }}>{target.level}</td>
      <td>
        <div
          className="form-check"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            onChange={() => {}}
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
          />
        </div>
      </td>
    </tr>
  );
}
