import { HomeSkeleton } from "@/components/skeletons";

export default function Loading(){

  return(
    <div className="min-h-screen flex flex-col justify-center items-center py-8 space-y-8">
    <HomeSkeleton/>
    </div>
  )
}