import { CountBadge } from "./count-badge";

interface PastCardProps {
  imgUrl: string;
  count: number;
  date: Date;
  keyword: string;
}

export const PastCard = ({ imgUrl, count, date, keyword }: PastCardProps) => {
  return (
    <div className="flex flex-col items-start justify-between rounded-t-3 hover:cursor-pointer">
      <div
        className="flex aspect-square w-full flex-col items-end rounded-t-3 bg-cover bg-no-repeat p-3"
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      >
        <CountBadge count={count} />
      </div>
      <div className="flex w-full flex-col items-end gap-0.5 rounded-b-3 bg-white p-3">
        <div className="text-cap-compact self-stretch">
          {date.toLocaleDateString().replace(/ /g, "")}
        </div>
        <div className="text-b2-strong self-stretch">{keyword}</div>
      </div>
    </div>
  );
};
