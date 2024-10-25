import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <div className="flex justify-center items-center">
            <div>
                <div className="text-center">Not Found</div>
                <Button asChild>
                    <Link to="/">Back to List Task</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFound