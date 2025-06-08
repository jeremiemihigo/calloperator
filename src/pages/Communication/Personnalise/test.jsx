import { Editor } from "primereact/editor";
import { useState } from "react";

export default function BasicDemo() {
  const [text, setText] = useState("");

  return (
    <div className="card">
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue)}
        style={{ height: "320px" }}
      />
    </div>
  );
}
