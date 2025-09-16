import { FieldModel } from "../models/FieldModel";
import { TargetModel } from "../models/TargetModel";

export const showTargetAndField = (
  targets: TargetModel[],
  targetId: string,
  fields: FieldModel[]
) => {
  let field: string = "";
  let name: string = "";
  const index = targets.findIndex((target) => target.id === targetId);
  if (index !== -1) {
    const indexField = fields.findIndex((_) => _.id === targets[index].fieldId);
    field = fields[indexField].name;
    name = targets[index].name;
  }

  return { name, field };
};
