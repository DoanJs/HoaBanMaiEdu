import { useEffect, useState } from "react";
import { widthSmall } from "../constants/reponsive";
import { UserModel } from "../models";
import { ChildrenModel } from "../models/ChildrenModel";
import { PlanModel } from "../models/PlanModel";
import { ReportModel } from "../models/ReportModel";
import { SuggestModel } from "../models/SuggestModel";
import { TargetModel } from "../models/TargetModel";

interface Props {
  title: string;
  placeholder: string;
  type?: string;
  width?: number | string;
  arrSource:
    | ChildrenModel[]
    | TargetModel[]
    | PlanModel[]
    | ReportModel[]
    | SuggestModel[]
    | UserModel[];
  onChange: (val: any) => void;
}

export default function SearchComponent(props: Props) {
  const { title, placeholder, type, arrSource, onChange, width } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    let items: any = [];
    switch (type) {
      case "searchChildren":
        items = (arrSource as ChildrenModel[]).filter((child) =>
          child.fullName.toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "searchTarget":
        items = (arrSource as TargetModel[]).filter(
          (target) =>
            target.name.toLowerCase().includes(value.toLowerCase()) ||
            target.level === Number(value)
        );
        break;
      case "searchPlan":
        items = (arrSource as PlanModel[]).filter((plan) =>
          plan.title.toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "searchReport":
        items = (arrSource as ReportModel[]).filter((report) =>
          report.title.toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "searchSuggest":
        items = (arrSource as SuggestModel[]).filter((suggest) =>
          suggest.name.toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "searchTeacher":
        items = (arrSource as UserModel[]).filter((teacher) =>
          teacher.fullName.toLowerCase().includes(value.toLowerCase())
        );
        break;
      case "searchMeta":
        items = (arrSource as any[]).filter((meta) =>
          meta.id.toLowerCase().includes(value.toLowerCase())
        );
        break;

      default:
        break;
    }

    onChange(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={`input-group ${widthSmall && "input-group-sm"}`}
      style={{ width: width ?? "40%" }}
    >
      <span className="input-group-text" id="basic-addon1">
        {title}
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label="Username"
        aria-describedby="basic-addon1"
      />
    </div>
  );
}
