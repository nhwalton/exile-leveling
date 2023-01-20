import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { formStyles } from "../../components/Form";
import { routeFilesSelector } from "../../state/route";
import Editor from "react-simple-code-editor";
import { highlight, Grammar } from "prismjs";

import styles from "./EditRoute.module.css";

const RouteGrammar: Grammar = {
  keyword: {
    pattern: /#ifdef\s+\w+|#endif/,
    inside: {
      keyword: /#ifdef|#endif/,
      variable: /\w+/,
    },
  },
  variable: { pattern: /#ifdef \w+/, lookbehind: true },
  comment: /#.*/,
  fragment: {
    pattern: /\{(.*)\}?/,
    inside: {
      keyword: { pattern: /(\{)(\w|\s)+/, lookbehind: true },
      "keyword control-flow": /[\|{}]/,
      property: /.+/,
    },
  },
};

export default function EditRouteContainer() {
  const [routeFiles, setRouteFiles] = useRecoilState(routeFilesSelector);
  const resetRouteFiles = useResetRecoilState(routeFilesSelector);

  return (
    <RouteEditor
      routeFiles={routeFiles}
      onUpdate={(updatedRouteFiles) => setRouteFiles(updatedRouteFiles)}
      onReset={() => resetRouteFiles()}
    />
  );
}

interface RouteEditorProps {
  routeFiles: string[];
  onUpdate: (updatedRouteFiles: string[]) => void;
  onReset: () => void;
}

function RouteEditor({ routeFiles, onUpdate, onReset }: RouteEditorProps) {
  const [workingRouteFiles, setWorkingRouteFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    setWorkingRouteFiles(routeFiles);
  }, [routeFiles]);

  const fileListItems = [];
  for (let i = 0; i < workingRouteFiles.length; i++) {
    fileListItems.push(
      <div
        key={i}
        className={classNames("borderListItem", styles.fileListItem, {
          [styles.selected]: selectedIndex === i,
        })}
        onClick={() => {
          setSelectedIndex(i);
        }}
      >
        Act {i + 1}
        {workingRouteFiles[i] !== routeFiles[i] && "*"}
      </div>
    );
  }

  return (
    <>
      <div className={classNames(formStyles.form, styles.workspaceForm)}>
        <div className={classNames(styles.workspace)}>
          <div className={classNames(styles.fileList)}>{fileListItems}</div>
          <div className={classNames(formStyles.formInput, styles.editor)}>
            <Editor
              value={workingRouteFiles[selectedIndex]}
              onValueChange={(value) => {
                const updatedRouteFiles = [...workingRouteFiles];
                updatedRouteFiles[selectedIndex] = value;
                setWorkingRouteFiles(updatedRouteFiles);
              }}
              highlight={(value) =>
                value !== undefined ? highlight(value, RouteGrammar, "") : value
              }
              tabSize={4}
              style={{
                fontFamily: "'Consolas', monospace",
                minHeight: "100%",
              }}
              textareaClassName={classNames(styles.editorTextArea)}
            />
          </div>
        </div>
        <div className={classNames(formStyles.groupRight)}>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              setWorkingRouteFiles([...routeFiles]);
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onUpdate(workingRouteFiles);
            }}
          >
            Save
          </button>
        </div>
      </div>
      <hr />
    </>
  );
}
