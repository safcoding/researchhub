"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoadingSwap } from "@/components/LoadingSwap"

const ANY_VALUE = "any"

const grantFilterSchema = z.object({
    query:              z.string().optional(),           
    type:               z.string().optional(),
    status:             z.string().optional(),
    sponsor_category:   z.string().optional(),
})


export function GrantFilterForm () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(grantFilterSchema),
        defaultValues: {
            query: searchParams.get("query") ?? "",              
            type: searchParams.get("type") ?? ANY_VALUE,
            status: searchParams.get("status") ?? ANY_VALUE,
            sponsor_category: searchParams.get("sponsor_category") ?? ANY_VALUE,
        }
    })

  function onSubmit(data: z.infer<typeof grantFilterSchema>) {
      const newParams = new URLSearchParams()

      if (data.query && data.query.trim() !== "") {
      newParams.set("query", data.query)
      }
      if (data.type && data.type !== ANY_VALUE) {
        newParams.set ("type", data.type)
      }
      if (data.status && data.status !== ANY_VALUE) {
        newParams.set ("status", data.status)
      }
      if (data.sponsor_category && data.sponsor_category !== ANY_VALUE) {
        newParams.set ("sponsor_category", data.sponsor_category)
      }
    
    newParams.set("page", "1")
    router.push(`${pathname}?${newParams.toString()}`)
    }

    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            name="query"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="Search by project title..." 
                            {...field} 
                        />
                    </FormControl>
                </FormItem>
            )}
        />
       <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grant Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="University Grant">University Grant</SelectItem>
                    <SelectItem value="Government Grant">Government Grant</SelectItem>
                    <SelectItem value="Industrial Grant">Industrial Grant</SelectItem>
                    <SelectItem value="Research Contract">Research Contract</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grant Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="ENDED">ENDED</SelectItem>
                    <SelectItem value="TERMINATED">TERMINATED</SelectItem>
                    <SelectItem value="REACTIVATE WITH FINAL REPORT">REACTIVATE WITH FINAL REPORT</SelectItem>
                    <SelectItem value="END - NEED TO SUBMIT FINAL REPORT">END - NEED TO SUBMIT FINAL REPORT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
          name="sponsor_category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsor Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="NATIONAL">NATIONAL</SelectItem>
                    <SelectItem value="UNIVERSITY">UNIVERSITY</SelectItem>
                    <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                    <SelectItem value="INTERNATIONAL">INTERNATIONAL</SelectItem>
                    <SelectItem value="GOVERNMENT">GOVERNMENT</SelectItem>                   
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Filter
          </LoadingSwap>
        </Button>
        </form>
    </Form>
    )
}

 