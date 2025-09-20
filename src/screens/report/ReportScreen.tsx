import { AddCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RowComponent,
  SearchComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from "../../components";
import { colors } from "../../constants/colors";
import { ReportModel } from "../../models";
import { useReportStore } from "../../zustand";
import { widthSmall } from "../../constants/reponsive";
import { sizes } from "../../constants/sizes";

export default function ReportScreen() {
  const { reports } = useReportStore();
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "approved");
      setReportNews(items);
    }
  }, [reports]);

  if (!reports) return <SpinnerComponent />;
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <RowComponent
        justify="space-between"
        styles={{
          padding: '1%',
          alignItems: "center",
          borderBottom: "1px solid",
          borderBottomColor: colors.gray,
        }}
      >
        <SearchComponent
          type="searchReport"
          placeholder="Nhập tháng"
          title="Tìm tháng"
          onChange={(val) => setReportNews(val)}
          arrSource={reports.filter((report) => report.status === "approved")}
        />
        <Link
          to={"../addReport"}
          style={{
            cursor: "pointer",
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddCircle size={widthSmall ? sizes.smallTitle : sizes.bigTitle} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4} />
          <TextComponent text="Thêm mới"  size={widthSmall ? sizes.text: sizes.thinTitle} />
        </Link>
      </RowComponent>

      <RowComponent
        styles={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          height: "85%",
          overflowY: "scroll",
        }}
      >
        {reportNews &&
          reportNews.map((_, index) => (
            <Link
              to={"../reportList"}
              state={{
                title: _.title,
                reportId: _.id,
              }}
              key={index}
              style={{
                background: colors.primaryLightOpacity,
                border: "1px solid coral",
                fontWeight: "bold",
                margin: 10,
                padding: 8,
                borderRadius: 4,
                textDecoration:'none'
              }}
            >
              <TextComponent text={_.title} size={widthSmall ? sizes.text: sizes.thinTitle}/>
            </Link>
          ))}
      </RowComponent>
    </div>
  );
}
