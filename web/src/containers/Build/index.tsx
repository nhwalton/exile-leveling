import { useEffect, useState } from "react";
import { TaskItemProps, TaskList } from "../../components/TaskList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";
import { BuildForm } from "../../components/BuildForm";
import { clearPersistent, getPersistent, setPersistent } from "../../utility";

export function Build() {
  const [buildData, setBuildData] = useState<BuildData | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (buildData) {
        setPersistent("build-data", buildData);
      } else {
        const buildData = getPersistent<BuildData>("build-data");
        if (buildData) setBuildData(buildData);
      }
    };

    fn();
  }, [buildData]);

  const taskItems: TaskItemProps[] = [];

  if (buildData) {
    for (let i = 0; i < buildData.requiredGems.length; i++) {
      const requiredGem = buildData.requiredGems[i];
      taskItems.push({
        key: requiredGem.uid,
        initialIsCompleted: requiredGem.acquired,
        onUpdate: (isCompleted) => {
          buildData.requiredGems[i].acquired = isCompleted;
          setPersistent("build-data", buildData);
        },
        children: (
          <GemOrder
            key={i}
            onMoveTop={() => {
              const splice = buildData.requiredGems.splice(i, 1);
              buildData.requiredGems.unshift(...splice);
              setBuildData({
                ...buildData,
              });
            }}
            onMoveUp={() => {
              if (i == 0) return;

              const swap = buildData.requiredGems[i];
              buildData.requiredGems[i] = buildData.requiredGems[i - 1];
              buildData.requiredGems[i - 1] = swap;

              setBuildData({
                ...buildData,
              });
            }}
            onMoveDown={() => {
              if (i == buildData.requiredGems.length - 1) return;

              const swap = buildData.requiredGems[i];
              buildData.requiredGems[i] = buildData.requiredGems[i + 1];
              buildData.requiredGems[i + 1] = swap;

              setBuildData({
                ...buildData,
              });
            }}
            onDelete={() => {
              buildData.requiredGems.splice(i, 1);
              setBuildData({
                ...buildData,
              });
            }}
            requiredGem={requiredGem}
          />
        ),
      });
    }
  }

  return (
    <div>
      <BuildForm
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
        onReset={() => {
          clearPersistent("build-data");
          setBuildData(null);
        }}
      />
      <hr />
      {buildData && (
        <>
          <div className="header">{buildData.characterClass}</div>
          <hr />
          <TaskList items={taskItems} />
          <hr />
        </>
      )}
    </div>
  );
}
