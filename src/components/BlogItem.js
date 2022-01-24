import React from "react";

function BlogItem({ blog, deleteBlog }) {
  return (
    <div
      className="mb-5 item"
      style={{ borderRadius: 10, backgroundColor: "rgba(153, 255, 153,0.2)" }}
    >
      <div className="image">
        <img
          src={blog.thumbnail ? blog.thumbnail : ""}
          alt=""
          height={200}
          width={200}
        />
      </div>
      <div className="text ms-4 mt-2">
        <h2>{blog.title}</h2>
        <p style={{ paddingRight: 10 }}>{blog.description}</p>
        <p> Posted On {blog.postedOn} </p>
        <p> By {blog.author.name} </p>
        <i
          className="fas fa-trash mb-2 btn"
          onClick={() => deleteBlog(blog._id)}
        />
      </div>
    </div>
  );
}

export default BlogItem;
