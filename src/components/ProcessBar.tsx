import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import TextComponent from "./TextComponent";

export default function ProcessBar() {
  const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((old) => (old >= 100 ? 100 : old + 10));
      }, 500);

      return () => clearInterval(timer);
    }, []);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ background: colors.gray, borderRadius: 8 }}>
        <div
          style={{
            width: `${progress}%`,
            height: 10,
            backgroundColor:
              progress < 33
                ? colors.red
                : progress < 100
                ? colors.orange
                : colors.green,
            borderRadius: 8,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <TextComponent text={`${progress}%`} />
    </div>
  );
}
