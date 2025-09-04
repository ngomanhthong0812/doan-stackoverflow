import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function RenderSkeleton({ className, length = 6 }) {
  return (
    <div className={cn("grid grid-cols-4 gap-3 mt-4", className)}>
      {Array.from({ length }).map((_, idx) => (
        <div className="flex flex-col space-y-3" key={idx}>
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
