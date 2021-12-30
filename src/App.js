import "./App.css";
import CreateBlog from "./components/CreateBlog";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import AllBlogs from "./components/AllBlogs";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<CreateBlog />} />
        <Route path="blogs" element={<AllBlogs />} />
      </Routes>
    </div>
  );
}

export default App;
