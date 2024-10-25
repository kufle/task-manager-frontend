import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/config/config";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CalendarIcon, Loader2, MoveLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { format } from "date-fns"

interface Task {
    id: number
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    due_date: string
}

function Edit() {
    const navigate = useNavigate();
    const {id} = useParams();

    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<Task | null>(null)
    
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const {data} = await axios.get(`${BASE_URL}/tasks/${id}`);
                setTask(data.data);
                console.log(data);
            } catch (error: any) {
                console.log(error.response);
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target
        setTask((prev) => prev ? { 
          ...prev,
          [name]: value
        } : null)
      }
    
      const handleStatusChange = (value: "pending" | "in-progress" | "completed") => {
        setTask((prev) => prev ? {
          ...prev,
          status: value
        } : null)
      }
    
      const handleDateChange = (date: Date | undefined) => {
        if (date && task) {
          setTask({
            ...task,
            due_date: date.toLocaleString()
          })
        }
      }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/tasks/${id}`, task);
            navigate("/");
        } catch (error: any) {
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <>
        {task ? (
        <div className="lg:max-w-md">
            <Link to="/">
                <div className="flex items-center">
                    <MoveLeft className="text-gray-400 h-4 w-4"/>
                    <span className="ml-2 text-gray-400 text-sm">Back To List Task</span>
                </div>
            </Link>
            <h1 className="text-xl font-bold tracking-tight py-2">Edit Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <Label>Title</Label>
                    <Input id="title" name="title" value={task.title} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <Label>Description</Label>
                    <Textarea id="description" name="description" value={task.description} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                    <Label>Status</Label>
                    <Select
                        defaultValue={task.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In-Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-3">
                    <Label>Due Date</Label>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal"
                                    )}
                                    >
                                    <CalendarIcon />
                                    {task.due_date ? format(new Date(task.due_date), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={new Date(task.due_date)}
                                    onSelect={handleDateChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div>
                    <Button disabled={loading}>{loading ? "Loading..." : "Update"}</Button>
                </div>
            </form>
        </div>
    ): <h1>Not Found</h1>}
        </>
    )
}

export default Edit