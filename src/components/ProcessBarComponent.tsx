// import React from "react";
// import { colors } from "../constants/colors";


// type ProgressBarComponentProps = {
//   percent: number; // 0 - 100
//   height?: number;
//   width?: string | number;
//   showText?: boolean;
// };

// const LEVEL_COLORS = [
//   "#f90606", // level 1 (0–25)
//   "#e67e22", // level 2 (25–50)
//   "#f1c40f", // level 3 (50–75)
//   "#2ecc71", // level 4 (75–100)
// ];

// const getProgressColor = (percent: number) => {
//   if (percent >= 75) return "#2ecc71"; // xanh dương
//   if (percent >= 50) return "#f1c40f"; // vàng
//   if (percent >= 25) return "#e67e22"; // cam
//   return "#f90606"; // xám
// };

// const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({
//   percent,
//   height = 12,
//   width = "100%",
//   showText = true,
// }) => {
//   const safePercent = Math.min(100, Math.max(0, percent));
//   const color = getProgressColor(safePercent);

//   return (
//     <div style={{ width, paddingRight: "5%", paddingLeft: "5%" }}>
//       {/* Bar background */}
//       <div
//         style={{
//           width: "100%",
//           height,
//           backgroundColor: colors.primaryLight,
//           borderRadius: 999,
//           overflow: "hidden",
//         }}
//       >
//         {/* Progress bar */}
//         <div
//           style={{
//             width: `${safePercent}%`,
//             height: "100%",
//             backgroundColor: color,
//             borderRadius: 999,
//             transition: "width 0.4s ease, background-color 0.3s ease",
//           }}
//         />
//       </div>

//       {/* Percent text */}
//       {showText && (
//         <div
//           style={{
//             marginTop: 6,
//             fontSize: 12,
//             fontWeight: 600,
//             textAlign: "right",
//             color: "#2c3e50",
//           }}
//         >
//           {safePercent.toFixed(1)}%
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProgressBarComponent;
import React from "react";
import { colors } from "../constants/colors";

type ProgressBarComponentProps = {
  percent: number; // 0 - 100
  height?: number;
  width?: string | number;
  showText?: boolean;
};

const LEVEL_COLORS = [
  "#f90606", // level 1
  "#e67e22", // level 2
  "#f1c40f", // level 3
  "#2ecc71", // level 4
];

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({
  percent,
  height = 12,
  width = "100%",
  showText = true,
}) => {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div style={{ width, paddingRight: "5%", paddingLeft: "5%" }}>
      {/* Bar background */}
      <div
        style={{
          width: "100%",
          height,
          backgroundColor: colors.primaryLight,
          borderRadius: 999,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {LEVEL_COLORS.map((color, index) => {
          const segmentStart = index * 25;
          const segmentEnd = segmentStart + 25;

          const filledPercent = Math.min(
            25,
            Math.max(0, safePercent - segmentStart),
          );

          return (
            <div
              key={index}
              style={{
                width: `${filledPercent}%`,
                maxWidth: "25%",
                height: "100%",
                backgroundColor: filledPercent > 0 ? color : "transparent",
                transition: "width 0.4s ease",
              }}
            />
          );
        })}
      </div>

      {/* Percent text */}
      {showText && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: 600,
            textAlign: "right",
            color: "#2c3e50",
          }}
        >
          {safePercent.toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBarComponent;
