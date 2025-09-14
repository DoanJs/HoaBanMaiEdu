import { where } from "firebase/firestore";
import { useEffect } from "react";
import {
  CardImageComponent,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { ChildrenModel } from "../../models/ChildrenModel";
import useChildrenStore from "../../zustand/useChildrenStore";
import useUserStore from "../../zustand/useUserStore";
import { Light } from "../../assets/icons";

export default function ChildrenScreen() {
  const { user } = useUserStore();
  const { children, setChildren } = useChildrenStore();
  const { data: data_children, loading: loading_children } =
    useFirestoreWithMetaCondition({
      key: `${user?.id}_childrenCache`,
      id: user?.id,
      metaDoc: "children",
      nameCollect: "children",
      condition: [where("teacherIds", "array-contains", user?.id)],
    });

  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children]);

  if (loading_children) return <SpinnerComponent />;
  return (
    user && (
      <SectionComponent
        styles={{
          padding: 100,
          background: colors.primary,
          display: "flex",
          flex: 1,
          height: sizes.height,
        }}
      >
        <RowComponent
          styles={{
            background: colors.bacground,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: 24,
            borderRadius: 10,
          }}
        >
          <TextComponent
            text={`Cô ${user.fullName} _ ${user.position}`}
            size={32}
            styles={{ fontWeight: "bold" }}
          />
          <SpaceComponent height={30} />
          <SearchComponent
            title="Tìm trẻ"
            placeholder="Nhập tên trẻ"
            type="searchChildren"
            arrSource={data_children as ChildrenModel[]}
            onChange={(val) => setChildren(val)}
          />
          <RowComponent
            styles={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              height: "90%",
              width: "70%",
              overflow: children.length > 10 ? "scroll" : "hidden",
              alignItems: "flex-start",
              overflowY: 3 > 4 ? "scroll" : undefined,
            }}
          >
            {children.length > 0 &&
              children.map((_, index) => (
                <CardImageComponent
                  key={index}
                  childInfo={_}
                  link={`home/${_.id}`}
                />
              ))}
          </RowComponent>
        </RowComponent>
      </SectionComponent>
    )
  );
}
