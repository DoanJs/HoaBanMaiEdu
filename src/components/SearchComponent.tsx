import { useState } from "react";

interface Props {
  title: string;
  placeholder: string;
}

export default function SearchComponent(props: Props) {
  const { title, placeholder } = props;
  const [value, setValue] = useState("");

  return (
    <div className="input-group" style={{ width: "30%" }}>
      <span className="input-group-text" id="basic-addon1">
        {title}
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label="Username"
        aria-describedby="basic-addon1"
      />
    </div>
  );
}
