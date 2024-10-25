import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BASE_URL } from '@/config/config'
import axios from 'axios'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from "@/hooks/use-toast"

interface Task {
    id: number
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    due_date: string
}

type SortKey = "title" | "status" | "due_date"
type SortOrder = "asc" | "desc"

function Home() {
    const { toast } = useToast()
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [sortKey, setSortKey] = useState<SortKey>("due_date")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        fetchTask();
    }, []);

    const fetchTask = async () => {
        setIsLoading(true)
        console.log(`${BASE_URL}/tasks`)
        try {
            const { data } = await axios.get(`${BASE_URL}/tasks`);
            setTasks(data.data)
        } catch (error: any) {
            console.log(error.response);
        } finally {
            setIsLoading(false)
        }
    }

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortKey(key)
            setSortOrder("asc")
        }
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortKey === "title") {
            return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        } else if (sortKey === "status") {
            return sortOrder === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status)
        } else {
            return sortOrder === "desc"
            ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            : new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        }
    })

    const handleDeleteConfirm = async () => {
        if (deleteTaskId === null) return

        setIsLoading(true)
        try {
            await axios.delete(`${BASE_URL}/tasks/${deleteTaskId}`);
            setTasks(tasks.filter(task => task.id !== deleteTaskId))
            toast({
                title: "Success",
                description: "Task deleted successfully",
            })
        } catch (error: any) {
            console.log(error.response);
            toast({
                title: "Error",
                description: "Failed to delete task. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setDeleteTaskId(null)
        }
    }

    const handleDeleteClick = (taskId: number) => {
        setDeleteTaskId(taskId)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false)
        setDeleteTaskId(null)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <>
        <h1 className="text-xl font-bold tracking-tight py-3">List Task</h1>
        <div className="mb-5">
            <Button asChild>
                <Link to="/add"><Plus /> Add Task</Link>
            </Button>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                        Title {sortKey === "title" && (sortOrder === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead>
                        Description
                    </TableHead>
                    <TableHead onClick={() => handleSort("status")}>
                        Status {sortKey === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("due_date")}>
                        Due Date {sortKey === "due_date" && (sortOrder === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead>
                        Action
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedTasks.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                                {task.status}
                            </span>
                        </TableCell>
                        <TableCell>{format(new Date(task.due_date), "PP")}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link to={`/edit/${task.id}`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit task</span>
                                </Link>
                            </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(task.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default Home