
import { Badge } from "@/components/ui/badge"
import { Status } from "@/types/common"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: Status
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const variants = {
      [Status.Draft]: { variant: "secondary" as const, icon: FileText, color: "text-gray-500", badgeClass: "bg-gray-100 border-gray-600" },
      [Status.Pending]: { variant: "outline" as const, icon: Clock, color: "text-yellow-500" , badgeClass: "bg-yellow-100 border-yellow-600"},
      [Status.Approved]: { variant: "outline" as const, icon: CheckCircle, color: "text-green-500" , badgeClass: "bg-green-100 border-green-600"},
      [Status.Rejected]: { variant: "outline" as const, icon: XCircle, color: "text-red-500", badgeClass: "bg-red-100 border-red-600" },
    }
  
    const { variant, icon: Icon, color, badgeClass } = variants[status]
  
    return (
      <Badge variant={variant} className={`flex text-xs font-semibold items-center gap-1 ${badgeClass}`}>
        <Icon className={`h-3 w-3 ${color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }