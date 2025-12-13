"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import AuthorForm from "./author-form"
import { RotateCcw, Save, X } from "lucide-react"
import { useUpdateAuthorForm } from "../hooks/useUpdateAuthor"
import { Author } from "../types"

interface UpdateAuthorDialogProps {
    open: boolean
    author?: Author
    closeDialog: () => void
}

export function UpdateAuthorDialog({
    open,
    author,
    closeDialog,
}: UpdateAuthorDialogProps) {
    // Form state
    const { formData, handleChange, isLoading, isUpdating, handleUpdate, handleReset, hasChanges } = useUpdateAuthorForm(author!)

    const updateAuthorAndDone = async () => {
        await handleUpdate()
        closeDialog()
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={closeDialog}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Loading...
                        </DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Update Author Details
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to the author content and metadata. You can reset to original values at any time.
                    </DialogDescription>
                </DialogHeader>

                {author && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-sm space-y-1">
                            <p><span className="font-medium">Author ID:</span> {author.id}</p>
                            <p><span className="font-medium">Author Name:</span> {author.name}</p>
                            <p><span className="font-medium">Current Status:</span> <span className="capitalize">{author.is_active ? "Active" : "Inactive"}</span></p>
                        </div>
                    </div>
                )}

                <ScrollArea className="max-h-[50vh] pr-4">
                    <div className="space-y-6">
                        <AuthorForm
                            data={formData}
                            onChange={handleChange}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={isUpdating || !hasChanges}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>

                        <Button
                            variant="outline"
                            onClick={closeDialog}
                            disabled={isUpdating}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                    </div>

                    <Button
                        onClick={updateAuthorAndDone}
                        disabled={isUpdating || !hasChanges}
                        className="flex items-center gap-2 w-full sm:w-auto"
                    >
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Update Author
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}