import React from "react";

function BlogItem({ blog }) {
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
      </div>
    </div>
  );
}

export default BlogItem;
