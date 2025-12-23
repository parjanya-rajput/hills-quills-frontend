"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Play,
} from "lucide-react"
import { Story } from "@/features/web-story/types"
import { StatusChangeDialog } from "./status-change-dialog"
import { RejectionReasonDialog } from "./rejection-reason-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { UpdateStoryDialog } from "./update-story-dialog"
import { StatusBadge } from "@/components/molecules/status-badge"
import { toast } from "sonner"
import CategoryBadge from "@/components/molecules/category-badge"
import RegionBadge from "@/components/molecules/region-badge"
import { useRouter } from "next/navigation"
import { Status } from "@/types/common"
import { useUpdateStoryStatus } from "@/features/web-story/hooks"

interface StoriesTableProps {
  stories: Story[]
  isLoading: boolean
}

export function StoriesTableAuthor({
  stories,
  isLoading,
}: StoriesTableProps) {
  const router = useRouter()
  const { updateStoryStatus } = useUpdateStoryStatus()
  
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    open: boolean
    story?: Story
    newStatus?: Status
  }>({ open: false })

  const [rejectionReasonDialog, setRejectionReasonDialog] = useState<{
    open: boolean
    story?: Story
  }>({ open: false })

  const [updateDialog, setUpdateDialog] = useState<{
    open: boolean
    story?: Story
  }>({ open: false })

  const onStatusChange = async (storyId: number, newStatus: Status, rejectionReason?: string) => {
    try {
      await updateStoryStatus({ id: storyId, status: newStatus, rejectionReason })
      toast.success("Web Story sent to admin for review successfully.")
    } catch (error: any) {
      toast.error("Failed to update story status", error?.message)
    }
  }

  const handleStatusChange = async(story: Story, newStatus: Status) => {
    if (newStatus === Status.Rejected) {
      // open the rejection reason dialog
      setStatusChangeDialog({ open: true, story, newStatus })
    } else {
      await onStatusChange(story.id, newStatus)
    }
  }

  const handleStatusChangeConfirm = async (rejectionReason?: string) => {
    if (statusChangeDialog.story && statusChangeDialog.newStatus) {
      await onStatusChange(
        statusChangeDialog.story.id,
        statusChangeDialog.newStatus,
        rejectionReason
      )
    }
    setStatusChangeDialog({ open: false })
  }

  const handleViewRejectionReason = (story: Story) => {
    setRejectionReasonDialog({ open: true, story })
  }

  const handleUpdateClick = (story: Story) => {
    setUpdateDialog({ open: true, story })
  }

  const handleView = (storyId: number) => {
    router.push(`/author/stories/${storyId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No stories found
                </TableCell>
              </TableRow>
            ) : (
              stories.map((story) => {
                return (
                  <TableRow key={story.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {story.cover_image_url ? (
                          <Image
                            src={story.cover_image_url.previewUrl}
                            alt={story.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{story.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={story.category} />
                    </TableCell>
                    <TableCell>
                      <RegionBadge region={story.region} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={story.status} />
                        {story.status === Status.Rejected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRejectionReason(story)}
                            className="h-6 w-6 p-0"
                          >
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(story.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          { story.status !== Status.Approved &&
                          (<DropdownMenuItem onClick={() => handleUpdateClick(story)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Story
                          </DropdownMenuItem>
                        )}
                          <DropdownMenuItem 
                            onClick={() => handleView(story.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Story
                          </DropdownMenuItem>
                          
                          {/* Status Change Options */}
                          {story.status === Status.Draft && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(story, Status.Pending)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Submit Story
                            </DropdownMenuItem>
                          )}
                          {story.status === Status.Rejected && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(story, Status.Pending)}
                            >
                              <XCircle className="h-4 w-4 mr-2 text-yellow-500" />
                              Resubmit Story
                            </DropdownMenuItem>
                          )}
                          
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <StatusChangeDialog
        open={statusChangeDialog.open}
        story={statusChangeDialog.story}
        newStatus={statusChangeDialog.newStatus}
        onConfirm={handleStatusChangeConfirm}
        onCancel={() => setStatusChangeDialog({ open: false })}
      />

      <RejectionReasonDialog
        open={rejectionReasonDialog.open}
        story={rejectionReasonDialog.story}
        onClose={() => setRejectionReasonDialog({ open: false })}
      />

      <UpdateStoryDialog
        open={updateDialog.open}
        story={updateDialog.story}
        onCancel={() => setUpdateDialog({ open: false })}
      />
        
    </>
  )
}
