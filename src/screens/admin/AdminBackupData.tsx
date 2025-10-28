import { useState } from "react";
import LoadingOverlay from "../../components/LoadingOverLay";
import { downloadJS, fetchCollection } from "../../constants/exportFirestore";

export default function AdminBackupData() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      // 🔹 Danh sách collection bạn muốn export
      const collections = [
        "Meta",
        "carts",
        "children",
        "fields",
        "interventions",
        "planTasks",
        "plans",
        "reportTasks",
        "reports",
        "suggests",
        "targets",
        "users",
        "reportSaveds"
      ];

      let allData: any = {};

      setIsLoading(true)
      for (let name of collections) {
        const data = await fetchCollection(name);
        allData[name] = data;
      }
      
      // 👉 Xuất ra file .js chứa tất cả collections
      downloadJS(allData, "firestoreAllCollections.js");
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Lỗi export Firestore:", error);
    }
  };
  return (
    <div>
      <button type="button" className="btn btn-danger" onClick={handleExport}>
        Backup tất cả data HoaBanMaiEdu
      </button>

      <LoadingOverlay show={isLoading}/>
    </div>
  );
}
