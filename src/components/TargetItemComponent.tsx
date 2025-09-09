import { colors } from "../constants/colors";
interface Props {
  index: number;
}

export default function TargetItemComponent(props: Props) {
  const { index } = props;
  return (
    <tr style={{ color: colors.textBold }}>
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto deserunt
        et reiciendis, facilis tempore itaque iste officia ut perferendis
        nostrum nam doloribus praesentium dolore sed aliquid voluptates
        necessitatibus sapiente culpa.
      </td>
      <td style={{ textAlign: "center" }}>2</td>
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
