import { cn } from "@/lib/utils";

type SplitTitleProps = {
  rest: string;
  italicWord: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SplitTitle({
  rest,
  italicWord,
  className,
  as: Tag = "h2",
}: SplitTitleProps) {
  return (
    <Tag className={cn("text-section", className)}>
      {rest}
      <br />
      <em className="font-light italic">{italicWord}</em>
    </Tag>
  );
}
