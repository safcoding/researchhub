'use client'
import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Admin Pages",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Grant Management",
          url: "/admin/grants",
        },
        {
          title: "Publication Management",
          url: "/admin/publications",
        },
        {
          title: "Lab and Equipment Management",
          url: "/admin/labs",
        },
        {
          title: "Event Management",
          url: "/admin/events",
        },
      ],
    },
    {
      title: "Public Pages",
      url: "#",
      items: [
        {
          title: "Home ",
          url: "/",
        },
        {
          title: "About",
          url: "/about",
        },
        {
          title: "Grants",
          url: "/grants",
        },
        {
          title: "Publications",
          url: "/publications",
        },
        {
          title: "Labs",
          url: "/labs",
        },
        {
          title: "Events",
          url: "/events",
        },
      ],
    },
  ],
}

export function AdminNav({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ResearchHub Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}