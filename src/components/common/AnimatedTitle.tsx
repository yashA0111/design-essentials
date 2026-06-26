import { cn } from "@/lib/utils";

type AnimatedTitleProps = {
  italicWord: string;
  rest: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function AnimatedTitle({
  italicWord,
  rest,
  className,
  as: Tag = "h2",
}: AnimatedTitleProps) {
  return (
    <Tag className={cn("text-section", className)}>
      <span className="font-light italic">{italicWord}</span>{" "}
      <span className="font-normal">{rest}</span>
    </Tag>
  );
}

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
