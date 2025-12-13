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
    FileText,
} from "lucide-react"
import { Author } from "@/features/author/types"
import { useRouter } from "next/navigation"
import { StatusAuthor } from "@/types/common"
import { StatusBadge } from "@/components/molecules/status-badge"
import { DeleteConfirmationDialog } from '@/features/author/components/delete-confirmation-dialog'
import { UpdateAuthorDialog } from "./update-author-dialog"

interface AuthorsTableProps {
    authors: Author[]
    isLoading: boolean
}

export function AuthorsTable({
    authors,
    isLoading,
}: AuthorsTableProps) {
    const router = useRouter()
    const [statusChangeDialog, setStatusChangeDialog] = useState<{
        open: boolean
        author?: Author
    }>({ open: false })

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        author?: Author
    }>({ open: false })

    const [updateDialog, setUpdateDialog] = useState<{
        open: boolean
        author?: Author
    }>({ open: false })


    const handleDeleteClick = (author: Author) => {
        setDeleteDialog({ open: true, author })

    }


    const handleUpdateClick = (author: Author) => {
        setUpdateDialog({ open: true, author })
    }

    const handleView = (authorId: number) => {
        router.push(`/admin/authors/${authorId}`)
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
                            <TableHead className="w-16">Profile</TableHead>
                            <TableHead>Name</TableHead>
                            {/* About not shown here */}
                            <TableHead>Email</TableHead>
                            <TableHead>Profession</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {authors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No authors found
                                </TableCell>
                            </TableRow>
                        ) : (
                            authors.map((author) => (
                                <TableRow key={author.id}>
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                                            {author.profile_photo_url ? (
                                                <Image
                                                    src={author.profile_photo_url}
                                                    alt={author.name}
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
                                            <p className="font-medium truncate">{author.name}</p>
                                            <p className="text-sm text-muted-foreground">{author.about ? (author.about.length > 50 ? author.about.slice(0, 50) + "..." : author.about) : ""}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{author.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{author.profession}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={author.is_active === 1 ? StatusAuthor.Active : StatusAuthor.Deleted} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(author.created_at)}
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
                                                <DropdownMenuItem onClick={() => handleUpdateClick(author)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Author
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleView(author.id)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Author
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(author)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Author
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>


            <DeleteConfirmationDialog
                open={deleteDialog.open}
                author={deleteDialog.author}
                closeDialog={() => setDeleteDialog({ open: false })}
            />

            <UpdateAuthorDialog
                open={updateDialog.open}
                author={updateDialog.author}
                closeDialog={() => setUpdateDialog({ open: false })}
            />

        </>
    )
}
