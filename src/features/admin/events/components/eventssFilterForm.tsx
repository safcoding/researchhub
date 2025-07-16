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

const eventFilterSchema = z.object({
    query:     z.string().optional(),           
    category:  z.string().optional(),
    status:    z.string().optional(),
    priority:  z.string().optional(),
})

export function EventFilterForm () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(eventFilterSchema),
        defaultValues: {
            query: searchParams.get("query") ?? "",              
            category: searchParams.get("category") ?? ANY_VALUE,
            status: searchParams.get("status") ?? ANY_VALUE,
            priority: searchParams.get("priority") ?? ANY_VALUE,
        }
    })

  function onSubmit(data: z.infer<typeof eventFilterSchema>) {
      const newParams = new URLSearchParams()

      if (data.query && data.query.trim() !== "") {
        newParams.set("query", data.query)
      }
      if (data.category && data.category !== ANY_VALUE) {
        newParams.set("category", data.category)
      }
      if (data.status && data.status !== ANY_VALUE) {
        newParams.set("status", data.status)
      }
      if (data.priority && data.priority !== ANY_VALUE) {
        newParams.set("priority", data.priority)
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
                            placeholder="Search by event title..." 
                            {...field} 
                        />
                    </FormControl>
                </FormItem>
            )}
        />
       <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
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
              <FormLabel>Event Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                    <SelectItem value="ONGOING">ONGOING</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
          name="priority"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Priority</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                    <SelectItem value="HIGH">HIGH</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="LOW">LOW</SelectItem>
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