import { Edit2 } from "iconsax-react";
import moment from "moment";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";

interface Props {
  meta: any;
  setMetaEdit: any;
}

export default function AdminMetaComponent(props: Props) {
  const { meta, setMetaEdit } = props;

  return (
    <tr>
      <td> {meta.id}</td>
      <td>
        {moment(handleTimeStampFirestore(meta.lastUpdated)).format(
          "HH:mm:ss DD/MM/YYYY"
        )}
      </td>
      <td style={{ textAlign: "center" }}>
        <Edit2
          size={widthSmall ? sizes.bigText : sizes.title}
          color="coral"
          variant="Bold"
          style={{ cursor: "pointer" }}
          onClick={() => setMetaEdit(meta)}
        />
      </td>
    </tr>
  );
}
