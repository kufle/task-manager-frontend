import { Route, Routes } from "react-router-dom"
import { Card, CardContent } from "./components/ui/card"
import Home from "./pages/Home"
import AddTask from "./pages/AddTask"
import Edit from "./pages/Edit"
import { Toaster } from "./components/ui/toaster"
import NotFound from "./pages/NotFound"

function App() {

  return (
    <>
      <div className="container mx-auto mt-6">
        <Card className="p-6">
          <CardContent className="px-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddTask />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  )
}

export default App
