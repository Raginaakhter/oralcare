import { StarIcon } from "@/components/icons";

export function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className="h-3.5 w-3.5"
          fillClass={i < Math.round(value) ? "fill-amber-400" : "fill-slate-200"}
        />
      ))}
    </span>
  );
}
