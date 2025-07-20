import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const shimmer =cn("bg-accent animate-pulse rounded-md")

export default function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="ml-2 h-6 w-24 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="rounded-xl bg-gray-100 p-4 space-y-6">
          <div className="ml-2 h-8 w-40 rounded-md bg-gray-200" />
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
        </div>
      </div>
    </div>
  );
}

export function PieChartSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="ml-2 h-6 w-24 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-60 w-60 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export  function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-12 w-100"/>
        <Skeleton className="h-4 w-70"/>
       </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <CardSkeleton/>
                <CardSkeleton/>
                <CardSkeleton/>
            </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PieChartSkeleton/>
      <PieChartSkeleton/>
      </div>
      <ChartSkeleton/>
    </div>
  )
}

export function EventSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-6 w-30"/>
        <Skeleton className="h-10 w-100"/>
        <Skeleton className="h-10 w-100"/>
       </div>
        <div className="flex flex-wrap gap-2 justify-center">
        <Skeleton className="h-6 w-15"/>
        <Skeleton className="h-6 w-15"/>
        <Skeleton className="h-6 w-15"/>
        <Skeleton className="h-6 w-15"/>
        <Skeleton className="h-6 w-15"/>
        <Skeleton className="h-6 w-15"/>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
        </div>
    </div>
  )
}

export function HomeSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-32">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-30 w-200"/>
        <Skeleton className="h-4 w-100"/>
        <Skeleton className="h-4 w-100"/>
        <Skeleton className="h-4 w-100"/>
        <Skeleton className="h-14 w-40"/>
       </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-20">
              <Skeleton className="h-100 w-100"/>
              <Skeleton className="h-100 w-100"/>
              <Skeleton className="h-100 w-100"/>
            </div>
      <div className="grid grid-cols-1 gap-6">
            <CardSkeleton/>
            <CardSkeleton/>
            <CardSkeleton/>
      </div>
      <ChartSkeleton/>
    </div>
  )
}

export function PartnerSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-6 w-30"/>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>
              <Skeleton className="h-60 w-800"/>            
        </div>
    </div>
  )
}