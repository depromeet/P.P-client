import { useEffect, useState } from "react";

import { LinkAndGoButton } from "./link-and-go-button";
import { TimerBadge } from "./timer-badge";

import * as BackgroundSVG from "@/assets/imgs/card-background";
import { CountBadge } from "@/components/app/home/count-badge";

interface RecentCardProps {
  id?: string;
  keyword: string;
  commentCount: number;
  postCreatedDate: string;
  openDatetime?: string;
}

// 어두운 배경 이미지의 인덱스 추출 for 상이한 키워드 색상
const BACKGROUNDS = [...Object.values(BackgroundSVG).sort()];
const DARK_BACKGROUNDS = [2, 4, 10, 11];

export const RecentCard = ({
  id,
  keyword,
  commentCount,
  postCreatedDate,
}: RecentCardProps) => {
  const idx = Math.floor(Math.random() * 11);
  const [openDatetime, setOpenDatetime] = useState<Date>();

  useEffect(() => {
    const [year, month, day] = postCreatedDate.split("-");
    const openDatetime = new Date(+year, +month - 1, +day + 1, 24);

    setOpenDatetime(openDatetime);
  }, [postCreatedDate]);

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-4 bg-white p-4">
      <div
        className="flex aspect-square w-full flex-col justify-between rounded-3 bg-cover bg-no-repeat p-[18px] opacity-[.88]"
        style={{
          backgroundImage: `url(${BACKGROUNDS[idx]})`,
        }}
      >
        <div className="flex justify-between">
          <h2
            className={`text-h2 text-gray-700 ${
              DARK_BACKGROUNDS.includes(idx) ? "text-white" : "text-gray-700"
            }`}
          >
            {keyword}
          </h2>
          <CountBadge count={commentCount} />
        </div>
        <TimerBadge openDatetime={openDatetime ?? new Date()} />
      </div>
      <LinkAndGoButton
        // 추후 id 연동
        id={id ?? "5"}
        openDatetime={openDatetime ?? new Date()}
        backgroundUrl={BACKGROUNDS[idx]}
      />
    </div>
  );
};
