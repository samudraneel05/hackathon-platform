import type React from "react"
import { StudentSidebar } from "@/components/student/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

