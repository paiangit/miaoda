import React, { ProfilerProps, ProfilerOnRenderCallback } from 'react';

type Props = { metadata?: any; phases?: ('mount' | 'update')[] } & Omit<
  ProfilerProps,
  'onRender'
>;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) {
    return;
  }

  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};

// 每隔5秒批量打印输出一次，以避免打印过于频繁
setInterval(sendProfileQueue, 5000);

export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<unknown>
  ) => {
    // 指定如果没有传入phases，则所有更新都记录
    // 否则，如果phase属于phases中，则也要记录
    // phase是阶段的意思，比如，mount阶段、update阶段
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
