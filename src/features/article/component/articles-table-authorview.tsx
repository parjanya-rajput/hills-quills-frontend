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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  FileText,
  AlertCircle,
} from "lucide-react"
import { Article } from "@/features/article/types"
import { ArticleRejectionReasonDialog } from "./article-rejection-reason-dialog"
import { RejectionReasonDialog } from "./rejection-reason-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { UpdateArticleDialog } from "./update-article-dialog"
import { StatusBadge } from "../../../components/molecules/status-badge"
import { useUpdateArticleStatusAuthor } from "@/features/article/hooks"
import { toast } from "sonner"
import CategoryBadge from "@/components/molecules/category-badge"
import RegionBadge from "@/components/molecules/region-badge"
import { useRouter } from "next/navigation"
import { Status } from "@/types/common"
interface ArticlesTableProps {
  articles: Article[]
  isLoading: boolean
}

export function ArticlesTableAuthorView({
  articles,
  isLoading,
}: ArticlesTableProps) {
  const router = useRouter()
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    open: boolean
    article?: Article
  }>({ open: false })

  const [rejectionReasonDialog, setRejectionReasonDialog] = useState<{
    open: boolean
    article?: Article
  }>({ open: false })

  const [updateDialog, setUpdateDialog] = useState<{
    open: boolean
    article?: Article
  }>({ open: false })


  const { updateArticleStatus: updateStatus } = useUpdateArticleStatusAuthor()
 

  const onStatusChange = async (articleId: number, newStatus: Status, rejectionReason?: string) => {
    try {
      await updateStatus({ id: articleId, status: newStatus })
      toast.success("Article sent to admin for review successfully.")
    } catch (error: any) {
      toast.error("Failed to update article status", error?.message)
    }
  }

  const handleStatusChange = async(article: Article, newStatus: Status) => {
    if (newStatus === Status.Rejected) {
      // open the rejection reason dialog
      setStatusChangeDialog({ open: true, article })
    } else {
      await onStatusChange(article.id, newStatus)
    }
  }

  const handleRejectionReasonConfirm = async (rejectionReason?: string) => {
    if (statusChangeDialog.article) {
      await onStatusChange(
        statusChangeDialog.article.id,
        Status.Rejected,
        rejectionReason
      )
    }
    setStatusChangeDialog({ open: false })
  }

  const handleViewRejectionReason = (article: Article) => {
    setRejectionReasonDialog({ open: true, article })
  }

  const handleUpdateClick = (article: Article) => {
    setUpdateDialog({ open: true, article })
  }

  const handleView = (articleId: number) => {
    router.push(`/author/articles/${articleId}`)
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
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                      {article.image ? (
                        <Image
                          src={article.image.previewUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.content.slice(0, 50)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={article.category} />
                  </TableCell>
                  <TableCell>
                    <RegionBadge region={article.region} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={article.status} />
                      {article.status === Status.Rejected && article.rejection_reason && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRejectionReason(article)}
                          className="h-6 w-6 p-0"
                        >
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(article.created_at)}
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

                        {article.status !== Status.Approved && (
                          <DropdownMenuItem onClick={() => handleUpdateClick(article)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Article
                        </DropdownMenuItem>
                        )}

                        <DropdownMenuItem 
                          onClick={() => handleView(article.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Article
                        </DropdownMenuItem>
                        
                        {/* Status Change Options */}
                        {article.status === Status.Draft && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(article, Status.Pending)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Submit Draft
                          </DropdownMenuItem>
                        )}

                        {
                          article.status === Status.Rejected && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(article, Status.Pending)}
                            >
                              <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                              Resubmit Article
                            </DropdownMenuItem>
                          )
                        }
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <ArticleRejectionReasonDialog
        open={statusChangeDialog.open}
        article={statusChangeDialog.article}
        onConfirm={handleRejectionReasonConfirm}
        closeDialog={() => setStatusChangeDialog({ open: false })}
      />

      <RejectionReasonDialog
        open={rejectionReasonDialog.open}
        article={rejectionReasonDialog.article}
        closeDialog={() => setRejectionReasonDialog({ open: false })}
      />

      <UpdateArticleDialog
        open={updateDialog.open}
        article={updateDialog.article}
        closeDialog={() => setUpdateDialog({ open: false })}
      />
        
    </>
  )
}
