import { Edit2 } from "iconsax-react";
import { TextComponent } from "../../components";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";
import { FieldModel } from "../../models";
import { SuggestModel } from "../../models/SuggestModel";

interface Props {
  suggest: SuggestModel;
  fields: FieldModel[];
  setSuggestEdit: any;
}

export default function AdminSuggestComponent(props: Props) {
  const { suggest, fields, setSuggestEdit } = props;

  const convertSuggestField = (suggest: SuggestModel, fields: FieldModel[]) => {
    const index = fields.findIndex((_) => _.id === suggest.fieldId);
    let nameField: string = "";
    if (index !== -1) {
      nameField = fields[index].name;
    }

    return { nameField };
  };

  return (
    <tr>
      <td>
        {suggest.name}
        <TextComponent
          text={"-->" + convertSuggestField(suggest, fields).nameField}
          size={sizes.bigText}
          styles={{ fontWeight: "bold" }}
        />
      </td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setSuggestEdit(suggest)}
        />
      </td>
    </tr>
  );
}
