import { signOut } from "firebase/auth";
import { serverTimestamp, where } from "firebase/firestore";
import { Logout } from "iconsax-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import suggestCA from "../../constants/database/suggest/suggestCA";
import suggestCNXH from "../../constants/database/suggest/suggestCNXH";
import suggestHV from "../../constants/database/suggest/suggestHV";
import suggestNNDD from "../../constants/database/suggest/suggestNNDD";
import suggestNNH from "../../constants/database/suggest/suggestNNH";
import suggestNT from "../../constants/database/suggest/suggestNT";
import suggestTTCY from "../../constants/database/suggest/suggestTTCY";
import suggestVDT from "../../constants/database/suggest/suggestVDT";
import { getDocsData } from "../../constants/firebase/getDocsData";
import { handleToastError, handleToastSuccess } from "../../constants/handleToast";
import { sizes } from "../../constants/sizes";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import { auth } from "../../firebase.config";
import { ChildrenModel } from "../../models/ChildrenModel";
import useChildrenStore from "../../zustand/useChildrenStore";
import useUserStore from "../../zustand/useUserStore";
import { addDocData } from "../../constants/firebase/addDocData";

export default function ChildrenScreen() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { children, setChildren } = useChildrenStore();
  const [isLoading, setIsLoading] = useState(false);
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
  }, [data_children, loading_children, setChildren]);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      handleToastSuccess('Đăng xuất tài khoản thành công !')
      setIsLoading(false);
      navigate("/login", { replace: true }); // <-- chuyển hướng rõ ràng
    } catch (error) {
      handleToastError('Đăng xuất tài khoản thất bại !')
      console.error("Error signing out:", error);
    }
  };

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
          <div style={{
            position: 'absolute',
            right: 20, top: 20,
            padding: 6,
            borderRadius: 10,
            background: colors.bacground,
            cursor: 'pointer',
          }}
            onClick={handleLogout}
          >
            {isLoading ? <SpinnerComponent /> : <Logout size={32} color='coral' variant="Bold" />}
          </div>
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
