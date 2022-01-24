import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import { ClipLoader } from "react-spinners";

function AllBlogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const url =
      "https://saveonshopping-server.herokuapp.com/api/blog/getallblogs";
    axios.get(url).then((response) => {
      setBlogs(response.data.blogs);
      setIsLoading(false);
    });
    return () => {};
  }, []);

  const deleteBlog = async (blogId) => {
    const url = `https://saveonshopping-server.herokuapp.com/api/blog/delete/${blogId}`;
    axios.delete(url).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        const newBlogs = blogs.filter((blog, ind) => {
          return blog._id !== blogId;
        });
        setBlogs(newBlogs);
        return;
      }
      alert("Error while deleting blog");
    });
    console.log(blogId);
  };

  return (
    <div>
      <div className="container mt-4">
        <h1 className="text-center mb-3">Blogs</h1>
        <div className="text-center">
          <ClipLoader loading={isLoading} />
        </div>
        {blogs &&
          blogs.map((blog, ind) => {
            return <BlogItem blog={blog} key={ind} deleteBlog={deleteBlog} />;
          })}
      </div>
    </div>
  );
}

export default AllBlogs;
