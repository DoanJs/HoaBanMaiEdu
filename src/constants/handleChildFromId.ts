import { ChildrenModel } from "../models"

export const handleChildFromId = (childId: string, children: ChildrenModel[], ) => {
    let fullName = ''
    const index = children.findIndex((_) => _.id === childId)
    if (index !== -1) {
      fullName = children[index].fullName
    }

    return fullName
  }