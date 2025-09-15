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
import { sizes } from "../../constants/sizes";
import { ReportModel } from "../../models/ReportModel";
import useReportStore from "../../zustand/useReportStore";

export default function ReportScreen() {
  const { reports } = useReportStore();
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === 'approved')
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
          padding: 10,
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
          arrSource={reports.filter((report) => report.status === 'approved')}
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
          <AddCircle size={30} color={colors.primary} variant="Bold" />
          <SpaceComponent width={4} />
          <TextComponent text="Thêm mới" size={sizes.bigText} />
        </Link>
      </RowComponent>

      <RowComponent styles={{ display: "flex", flexWrap: "wrap" }}>
        {reportNews &&
          reportNews.map((_, index) => (
            <Link
              to={"../reportList"}
              state={{
                title: _.title,
                reportId: _.id,
              }}
              key={index}
              type="button"
              className="btn "
              style={{
                background: colors.primaryLightOpacity,
                border: "1px solid coral",
                fontWeight: "bold",
                margin: 10,
              }}
            >
              {_.title}
            </Link>
          ))}
      </RowComponent>
    </div>
  );
}
