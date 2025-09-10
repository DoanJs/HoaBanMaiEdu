import { useEffect, useState } from "react";
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
import { query_children } from "../../constants/firebase/query/Index";
import { sizes } from "../../constants/sizes";
import { useFirestoreWithMeta } from "../../constants/useFirestoreWithMeta";
import { ChildrenModel } from "../../models/ChildrenModel";
import useChildrenStore from "../../zustand/useChildrenStore";
import useUserStore from "../../zustand/useUserStore";

export default function ChildrenScreen() {
  const { user } = useUserStore();
  const { children, setChildren } = useChildrenStore();
  const [childrenData, setChildrenData] = useState<ChildrenModel[]>();
  const { data: data_children, loading: loading_children } =
    useFirestoreWithMeta(
      "childrenCache",
      query_children(`${user?.id}`),
      "children"
    );

  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children]);

  // useEffect(() => {
  //   if (children) {
  //     setChildrenData(children);
  //   }
  // }, [children]);

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
            text={`Cô ${user?.fullName} _ ${user?.position}`}
            size={32}
            styles={{ fontWeight: "bold" }}
          />
          <SpaceComponent height={30} />
          <SearchComponent
            title="Tìm trẻ"
            placeholder="Nhập tên trẻ"
            type="searchChildren"
            onChange={(val) => setChildrenData(val)}
          />
          <RowComponent
            styles={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              height: "90%",
              width: "70%",
              overflow: 10 > 11 ? "scroll" : "hidden",
              alignItems: "flex-start",
              overflowY: 3 > 4 ? "scroll" : undefined,
            }}
          >
            {children.map((_, index) => (
              <CardImageComponent
                key={index}
                avatar={_.avatar}
                name={_.fullName}
                link="home"
              />
            ))}
          </RowComponent>
        </RowComponent>
      </SectionComponent>
    )
  );
}
