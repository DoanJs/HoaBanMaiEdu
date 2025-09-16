import { TargetModel } from "../models";

export const convertNameTargetAndFieldId = (
  targetId: string,
  targets: TargetModel[]
) => {
  let name: string = "";
  let fieldId: string = "";
  const index = targets.findIndex((target) => target.id === targetId);
  if (index !== -1) {
    name = targets[index].name;
    fieldId = targets[index].fieldId;
  }

  return { name, fieldId };
};
