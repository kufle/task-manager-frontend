import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarIcon, MoveLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import axios from "axios";

function AddTask() {
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: "",
        description: "",
        status: "pending",
        due_date: new Date().toLocaleString(),
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target
        setTask((prev) => ({ ...prev, [name]: value }))
      }

    const handleStatusChange = (value: "todo" | "in-progress" | "done") => {
        setTask((prev) => ({ ...prev, status: value }))
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            console.log(date.toLocaleString())
            setTask((prev) => ({ ...prev, due_date: date.toLocaleString() }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/tasks/create", task);
        } catch (error: any) {
            console.log(error.response);
        } finally {
            setLoading(false);
            navigate("/");
        }
    }

    return (
        <div className="lg:max-w-md">
            <Link to="/">
                <div className="flex items-center">
                    <MoveLeft className="text-gray-400 h-4 w-4"/>
                    <span className="ml-2 text-gray-400 text-sm">Back To List Task</span>
                </div>
            </Link>
            <h1 className="text-xl font-bold tracking-tight py-2">Add Task</h1>
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
                        defaultValue="pending"
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
                    <Button disabled={loading}>{loading ? "Loading..." : "Save"}</Button>
                </div>
            </form>
        </div>
    )
}

export default AddTask