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
import { EquipmentFilterSearch } from "./equipmentFilter"

const ANY_VALUE = "any"

const labFilterSchema = z.object({
    query:    z.string().optional(),
    equipment_query: z.string().optional(),       
    type:     z.string().optional(),
    status:   z.string().optional(),
})

export function LabFilterForm () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(labFilterSchema),
        defaultValues: {
            query: searchParams.get("query") ?? "",   
            equipment_query: searchParams.get("equipment_query") ?? "",  
            type: searchParams.get("type") ?? ANY_VALUE,
            status: searchParams.get("status") ?? ANY_VALUE,
        }
    })

  function onSubmit(data: z.infer<typeof labFilterSchema>) {
      const newParams = new URLSearchParams()

      if (data.query && data.query.trim() !== "") {
        newParams.set("query", data.query)
      }
      if (data.equipment_query && data.equipment_query.trim() !== ""){
        newParams.set("equipment_query", data.equipment_query)
      }
      if (data.type && data.type !== ANY_VALUE) {
        newParams.set("type", data.type)
      }
      if (data.status && data.status !== ANY_VALUE) {
        newParams.set("status", data.status)
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
                            placeholder="Search by lab name..." 
                            {...field} 
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        <FormField
            name="equipment_query"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Search by Equipment</FormLabel>
                    <FormControl>
                        <EquipmentFilterSearch
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Search by equipment name..."
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
              <FormLabel>Lab Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                      <SelectItem value="i-Kohza">i-Kohza</SelectItem>
                      <SelectItem value="Research Lab">Research Lab</SelectItem>
                      <SelectItem value="Satellite Lab">Satellite Lab</SelectItem>
                      <SelectItem value="Teaching Lab">Teaching Lab</SelectItem>
                      <SelectItem value="Service Lab">Service Lab</SelectItem>
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
              <FormLabel>Lab Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value={ANY_VALUE}>Any</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Maintenance">Inactive</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
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