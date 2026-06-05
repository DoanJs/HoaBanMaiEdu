import { useState } from "react";
import "./admin.css";
import AdminBackupData from "./AdminBackupData";
import AdminChildren from "./AdminChildren";
import AdminField from "./AdminField";
import AdminMeta from "./AdminMeta";
import AdminPlan from "./AdminPlan";
import AdminReport from "./AdminReport";
import AdminSuggest from "./AdminSuggest";
import AdminTarget from "./AdminTarget";
import AdminTeacher from "./AdminTeacher";

export default function AdminAllInOne() {
  const [tab, setTab] = useState("adminchildren");

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        {/* ===== TAB HEADER ===== */}
        <div className="qx-tabs mb-3">
          {[
            { key: "adminchildren", label: "TRẺ" },
            { key: "adminteacher", label: "GIÁO VIÊN" },
            { key: "adminfield", label: "LĨNH VỰC" },
            { key: "admintarget", label: "MỤC TIÊU" },
            // { key: "adminsuggest", label: "GỢI Ý" },
            { key: "adminplan", label: "KẾ HOẠCH" },
            { key: "adminreport", label: "BÁO CÁO" },
            { key: "adminmeta", label: "META" },
            { key: "adminbackupdata", label: "BACKUP_DATA" },
          ].map((item) => (
            <button
              key={item.key}
              className={`qx-tab ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ===== CONTENT ===== */}
        {tab === "adminchildren" && <AdminChildren />}
        {tab === "adminfield" && <AdminField />}
        {tab === "admintarget" && <AdminTarget />}
        {tab === "adminsuggest" && <AdminSuggest />}
        {tab === "adminplan" && <AdminPlan />}
        {tab === "adminreport" && <AdminReport />}
        {tab === "adminteacher" && <AdminTeacher />}
        {tab === "adminmeta" && <AdminMeta />}
        {tab === "adminbackupdata" && <AdminBackupData />}
      </section>
    </>
  );
}
