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

const publicationFilterSchema = z.object({
    query:              z.string().optional(),           
    type:              z.string().optional(),           
    category:               z.string().optional(),
    status:             z.string().optional(),
})


export function PublicationFilterForm () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(publicationFilterSchema),
        defaultValues: {
            query: searchParams.get("query") ?? "",              
            type: searchParams.get("type") ?? ANY_VALUE,
            status: searchParams.get("status") ?? ANY_VALUE,
        }
    })

  function onSubmit(data: z.infer<typeof publicationFilterSchema>) {
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
      if (data.category && data.category !== ANY_VALUE) {
        newParams.set ("category", data.category)
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
                            placeholder="Search by publication title..." 
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
              <FormLabel>Publication Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                            <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                            <SelectItem value="Original Book">Original Book</SelectItem>
                            <SelectItem value="Scopus">Scopus</SelectItem>
                            <SelectItem value="Web of Science">Web of Science</SelectItem>
                            <SelectItem value="Conference Paper">Conference Paper</SelectItem>
                            <SelectItem value="Proceedings">Proceedings</SelectItem>
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
                            <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                            <SelectItem value="VERIFIED (WAITING FOR INDEXING IN SCOPUS/WOS)">VERIFIED (WAITING FOR INDEXING IN SCOPUS/WOS)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                            <SelectItem value="Indexed Publication">Indexed Publication</SelectItem>
                            <SelectItem value="Non-Indexed Publication">Non-Indexed Publication</SelectItem>
                            <SelectItem value="Other Publication">Other Publication</SelectItem>              
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

 