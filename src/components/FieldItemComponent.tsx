import { Link } from "react-router-dom";
import { ProgressBarComponent, SpaceComponent, TextComponent } from ".";
import { colors } from "../constants/colors";
import { showUIIconTarget } from "../constants/showUIIconTarget";
import { sizes } from "../constants/sizes";
import { useTargetStore } from "../zustand";
import { PlanTaskModel, ReportTaskModel, TargetModel } from "../models";
import useTotalReportTaskStore from "../zustand/useTotalReportTaskStore";
import useTotalPlanTaskStore from "../zustand/useTotalPlanTaskStore";

interface Props {
  title: string;
  fieldId: string;
}
type LevelMap = Record<number, any[]>; // 1 | 2 | 3 | 4

export default function FieldItemComponent(props: Props) {
  const { title, fieldId } = props;
  const {targets} = useTargetStore()
  const {totalPlanTasks} = useTotalPlanTaskStore()
  const {totalReportTasks} = useTotalReportTaskStore()

  const getLevelMapFromTargets = (targetIds: string[], fieldId: string) => {
    const targetIdSet = new Set(targetIds);

    const levelMap: Record<number, TargetModel[]> = {};

    for (const target of targets) {
      // 1️⃣ chỉ lấy target có id nằm trong report
      if (!targetIdSet.has(target.id)) continue;

      // 2️⃣ đúng field
      if (target.fieldId !== fieldId) continue;

      // 3️⃣ gom theo level
      (levelMap[target.level] ||= []).push(target);
    }

    return levelMap;
  };

  const getTargetIdsFromReportTasks = (
    reportTasks: ReportTaskModel[],
    planTasks: PlanTaskModel[],
  ): string[] => {
    // Map tra nhanh planTaskId → targetId
    const planTaskTargetMap = new Map<string, string>(
      planTasks.map(pt => [pt.id, pt.targetId]),
    );

    const targetIdSet = new Set<string>();

    for (const rt of reportTasks) {
      const targetId = planTaskTargetMap.get(rt.planTaskId);
      if (targetId) {
        targetIdSet.add(targetId);
      }
    }

    return Array.from(targetIdSet);
  };

  function calculateProgressPercent(
    baseLevels: LevelMap, // A
    reportLevels: LevelMap, // B
  ): number {
    const getRatio = (level: number) => {
      const baseCount = baseLevels[level]?.length || 0;
      const reportCount = reportLevels[level]?.length || 0;

      if (baseCount === 0) return 0;
      return reportCount / baseCount;
    };

    if (reportLevels[4]?.length) {
      return 75 + getRatio(4) * 25;
    }

    if (reportLevels[3]?.length) {
      return 50 + getRatio(3) * 25;
    }

    if (reportLevels[2]?.length) {
      return 25 + getRatio(2) * 25;
    }

    if (reportLevels[1]?.length) {
      return getRatio(1) * 25;
    }

    return 0;
  }

  const baseLevels = getLevelMapFromTargets(targets.map((_) => _.id), fieldId)
  const reportLevels = getLevelMapFromTargets(getTargetIdsFromReportTasks(totalReportTasks, totalPlanTasks), fieldId)

  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center'
    }}>
      <Link
        to={"../target"}
        state={{
          title,
          fieldId,
        }}
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: colors.primaryLightOpacity,
          width: 180,
          height: 180,
          padding: 16,
          borderRadius: 10,
          margin: 10,
          border: "1px solid coral",
          cursor: "pointer",
        }}
      >
        <div>{showUIIconTarget(title)}</div>
        <SpaceComponent height={20} />
        <TextComponent
          text={title}
          size={sizes.bigText}
          color={colors.textBold}
          styles={{ textAlign: "center", fontWeight: "bold" }}
        />
      </Link>
      <ProgressBarComponent percent={Number(calculateProgressPercent(baseLevels, reportLevels).toFixed(2))}/>
    </div>
  );
}
