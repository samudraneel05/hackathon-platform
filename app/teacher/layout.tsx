import type React from "react"
import { TeacherSidebar } from "@/components/teacher/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <TeacherSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

