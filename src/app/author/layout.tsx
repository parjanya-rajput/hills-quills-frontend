import { DashboardLayout } from "@/app/author/components/DashboardLayout"
import ProtectedRoute from "@/features/auth/components/protectedroute"
import { UserRole } from "@/types/auth"

export default function AuthorLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

  return (
    <ProtectedRoute requiredRole={UserRole.AUTHOR}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}