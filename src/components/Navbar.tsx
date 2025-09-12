import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  HomeItemComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from ".";
import { colors } from "../constants/colors";
import { getDocData } from "../constants/firebase/getDocData";
import { getDocsData } from "../constants/firebase/getDocsData";
import { query_targets } from "../constants/firebase/query/Index";
import { sizes } from "../constants/sizes";
import { useFirestoreWithMeta } from "../constants/useFirestoreWithMeta";
import { TargetModel } from "../models/TargetModel";
import { UserModel } from "../models/UserModel";
import useChildStore from "../zustand/useChildStore";
import useSelectTargetStore from "../zustand/useSelectTargetStore";
import useTargetStore from "../zustand/useTargetStore";
import useUserStore from "../zustand/useUserStore";

export default function Navbar() {
  const { id } = useParams();
  const { user } = useUserStore();
  const { selectTarget, setSelectTarget } = useSelectTargetStore();
  const { child, setChild } = useChildStore();
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const { setTargets } = useTargetStore();
  const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
    {
      key: "targetsCache",
      query: query_targets,
      metaDoc: "targets",
    }
  );


  useEffect(() => {
    if (!loading_targets) {
      setTargets(data_targets as TargetModel[]);
    }
  }, [data_targets, loading_targets]);

  useEffect(() => {
    if (id) {
      getDocData({
        id,
        nameCollect: "children",
        setData: setChild,
      });
    }
  }, [id]);

  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: "users",
        condition: [where("id", "in", child.teacherIds)],
        setData: setTeachers,
      });
    }
  }, [child]);

  return (
    <SectionComponent
      styles={{
        padding: 20,
        background: colors.primary,
        display: "flex",
        flex: 1,
        height: sizes.height,
      }}
    >
      <div
        style={{
          flex: 1,
          background: colors.primaryLight,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <RowComponent justify="space-between">
          <RowComponent>
            <Link to={"/"}>
              <img
                alt=""
                src="https://res.cloudinary.com/filesuploadonserver/image/upload/v1757600460/HoaBanMaiEdu/icons/HBMIcon_ujnyvq.jpg"
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 10,
                  marginLeft: 16,
                }}
              />
            </Link>
            <SpaceComponent width={10} />
            <TextComponent
              text="TRUNG TÂM CAN THIỆP SỚM HOA BAN MAI EDU"
              styles={{ fontWeight: "bold" }}
              size={sizes.title}
            />
          </RowComponent>

          <RowComponent>
            <RowComponent
              styles={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid",
                borderRightColor: colors.primary,
                paddingRight: 16,
              }}
            >
              <img
                alt=""
                src={child?.avatar}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 100,
                  objectFit: "cover",
                }}
              />
              <SpaceComponent width={10} />
              <TextComponent
                text={child?.fullName as string}
                styles={{ fontWeight: "bold" }}
                size={sizes.bigText}
              />
            </RowComponent>
            <SpaceComponent width={10} />
            <div>
              <TextComponent
                text="Giáo viên phụ trách:"
                styles={{ fontWeight: "bold" }}
                size={sizes.bigText}
              />
              {teachers.length > 0 &&
                teachers.map((teacher, index) => (
                  <TextComponent
                    text={`${index + 1}. ${teacher.fullName}`}
                    key={index}
                  />
                ))}
            </div>
          </RowComponent>

          <RowComponent>
            <RowComponent styles={{ flexDirection: "column" }}>
              <TextComponent
                text={user?.fullName.toUpperCase() as string}
                color={colors.textBold}
                size={sizes.bigText}
                styles={{ fontWeight: "bold" }}
              />
              <TextComponent
                text={user?.position as string}
                color={colors.textBold}
              />
            </RowComponent>
            <SpaceComponent width={6} />
            <Link to={"profile"}>
              <img
                alt=""
                src={user?.avatar}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 100,
                  cursor: "pointer",
                }}
              />
            </Link>
          </RowComponent>
        </RowComponent>

        <SpaceComponent height={16} />

        <RowComponent
          styles={{
            flex: 1,
            alignItems: "flex-start",
            borderRadius: 10,
            height: "90%",
          }}
        >
          <SectionComponent
            styles={{ display: "flex", flex: 1, height: "100%" }}
          >
            <RowComponent
              styles={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <RowComponent
                styles={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <HomeItemComponent
                  title="NGÂN HÀNG MỤC TIÊU"
                  icon="bank"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="KẾ HOẠCH"
                  icon="plan"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="BÁO CÁO"
                  icon="chart"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="ĐIỂM DANH"
                  icon="callover"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="HÌNH ẢNH/VIDEO"
                  icon="image"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
                <HomeItemComponent
                  title="CÀI ĐẶT"
                  icon="setting"
                  value={selectTarget}
                  onClick={(val) => setSelectTarget(val)}
                />
              </RowComponent>
              <HomeItemComponent
                title="GIỎ MỤC TIÊU"
                icon="cart"
                value={selectTarget}
                onClick={(val) => setSelectTarget(val)}
              />
            </RowComponent>
          </SectionComponent>

          <SectionComponent
            styles={{
              display: "flex",
              flex: 4,
              background: colors.bacground,
              borderRadius: 10,
              height: "100%",
            }}
          >
            <Outlet />
          </SectionComponent>
        </RowComponent>
      </div>
    </SectionComponent>
  );
}
