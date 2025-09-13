import { useEffect, useState } from "react";
import { ChildrenModel } from "../models/ChildrenModel";
import { TargetModel } from "../models/TargetModel";
import { PlanModel } from "../models/PlanModel";
import { ReportModel } from "../models/ReportModel";

interface Props {
  title: string;
  placeholder: string;
  type?: string;
  arrSource: ChildrenModel[] | TargetModel[] | PlanModel[] | ReportModel[];
  onChange: (val: any) => void;
}

export default function SearchComponent(props: Props) {
  const { title, placeholder, type, arrSource, onChange } = props;
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
        items = (arrSource as TargetModel[]).filter((target) =>
          target.name.toLowerCase().includes(value.toLowerCase())
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

      default:
        break;
    }

    onChange(items);
  }, [value]);

  return (
    <div className="input-group" style={{ width: "30%" }}>
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
