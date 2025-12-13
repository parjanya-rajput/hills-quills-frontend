"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, Calendar, User } from "lucide-react"
import { Author } from "@/features/author/types"
import { StatusBadge } from "../../../components/molecules/status-badge"
import { toast } from "sonner"
import { StatusAuthor } from "@/types/common"
import { useSetDeleteStatusAuthor } from "../hooks"

interface DeleteConfirmationDialogProps {
    open: boolean
    author?: Author
    closeDialog: () => void
}

export function DeleteConfirmationDialog({
    open,
    author,
    closeDialog,
}: DeleteConfirmationDialogProps) {

    const { deleteAuthor, isLoading, error } = useSetDeleteStatusAuthor()

    const handleConfirm = async () => {
        if (author) {
            try {
                await deleteAuthor(author.id)
                closeDialog()
            } catch (error: any) {
                toast.error("Failed to delete author", error?.message)
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-red-600">Delete Author</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {author && (
                    <div className="space-y-4">
                        {/* Warning Banner */}
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-red-800">Author Deletion</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        This will set the status of the author as deleted. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Article Info */}
                        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                            <h4 className="font-medium text-lg">{author.name}</h4>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Author ID:</span>
                                        <span className="font-mono">{author.id}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{formatDate(author.created_at)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Status:</span>
                                        <StatusBadge status={author.is_active === 1 ? StatusAuthor.Active : StatusAuthor.Deleted} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span>{author.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Profession:</span>
                                        <span>{author.profession}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Author
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
