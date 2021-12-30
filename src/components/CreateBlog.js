/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Alert from "./Alert";
import firebaseApp from "../config/firebaseConfig";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Irfan Bennur");
  const [h1, setH1] = useState("");

  const [thumbnailSrc, setThumbnailSrc] = useState("");

  const [thumbnailImage, setThumbnailImage] = useState();
  const [imagesArray, setImages] = useState();

  const [alert, setAlert] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      e.preventDefault();
      const body = {
        title,
        description,
        content,
        author: {
          name: author,
        },
        h1,
      };

      if (!thumbnailImage) body.thumbnail = null;
      if (!imagesArray) body.images = null;

      try {
        const thumbnail = await _uploadThumbnailToFirebase();
        body.thumbnail = thumbnail;
      } catch (error) {}

      try {
        const images = await _uploadImagesToFirebase();
        body.images = images;
      } catch (error) {}

      setTimeout(async () => {
        await handleResponse(body);
        clearForm();
        window.scrollTo(0, 0);
      }, 2000);
    } catch (error) {
      window.scrollTo(0, 0);
      setIsLoading(false);
      handleAlert("danger", "Some error occurred. Please try again later");
    }
  };

  const handleResponse = async (body) => {
    try {
      const url = "https://saveonshopping-server.herokuapp.com/api/blog/create";
      const { data } = await axios.post(url, body);

      if (data.success) {
        setIsLoading(false);
        handleAlert("success", "Blog created successfully");
      } else {
        setIsLoading(false);
        handleAlert("danger", "Some error occurred. Please try again later");
      }
    } catch (error) {
      window.scrollTo(0, 0);
      setIsLoading(false);
      handleAlert("danger", "Some error occurred. Please try again later");
    }
  };

  const handleAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({});
    }, 3000);
  };

  const _uploadThumbnailToFirebase = async () => {
    return new Promise((resolve, reject) => {
      if (!thumbnailImage) reject();
      else {
        let name = generateFileName(thumbnailImage.name);
        const storage = getStorage(firebaseApp);
        let storageRef = ref(storage, `thumbnail_images/${name}`);
        uploadBytes(storageRef, thumbnailImage).then((snap) => {
          getDownloadURL(snap.ref).then((url) => {
            resolve(url);
          });
        });
      }
    });
  };

  const _uploadImagesToFirebase = async () => {
    let imageUrlsArray = [];
    return new Promise((resolve, reject) => {
      if (!imagesArray) reject();
      else {
        const storage = getStorage(firebaseApp);
        for (let i = 0; i < imagesArray.length; i++) {
          const image = imagesArray[i];
          let name = generateFileName(image.name);
          let storageRef = ref(storage, `blog_images/${name}`);
          uploadBytes(storageRef, image).then((snap) => {
            getDownloadURL(snap.ref).then((url) => {
              imageUrlsArray.push(url);
            });
          });
        }
        resolve(imageUrlsArray);
      }
    });
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setH1("");
    setThumbnailSrc(null);
    setThumbnailImage(null);
    setImages(null);
    document.getElementById("thumbnail-input").value = null;
    document.getElementById("images-input").value = null;
  };

  const generateFileName = (originalName) => {
    const ext = originalName.split(".")[1];
    const name = Date.now().toString();
    return `${name}.${ext}`;
  };

  return (
    <div>
      <div className="container mt-2 wrapper">
        {alert && (
          <div className="mt-3">
            <Alert alert={alert} />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <h1 className="text-center">Create new Blog</h1>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              required={true}
              type="text"
              className="form-control"
              id="title"
              aria-describedby="titleHelp"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <div className="form-text" id="titleHelp">
              Maximum length : 70 characters
            </div>
          </div>
          <div className="mb-3 mt-4">
            <label htmlFor="desc" className="form-label">
              Description
            </label>
            <textarea
              required={true}
              name="descritption"
              rows={2}
              type="text"
              className="form-control"
              id="desc"
              maxLength={170}
              aria-describedby="descHelp"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            <div className="form-text" id="descHelp">
              Maximum length : 170 characters
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="h1" className="form-label">
                H1 tag
              </label>
              <input
                required={true}
                type="text"
                className="form-control"
                id="h1"
                onChange={(e) => setH1(e.target.value)}
                value={h1}
              />
            </div>
            <div className="col">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                required={true}
                type="text"
                className="form-control"
                id="author"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
                disabled={true}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              required={true}
              name="content"
              className="form-control"
              id="content"
              cols="50"
              rows="15"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="content" className="form-label">
              Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail-input"
              className="form-control"
              onChange={(e) => {
                let a = URL.createObjectURL(e.target.files[0]);
                setThumbnailSrc(a);
                setThumbnailImage(e.target.files[0]);
                if (e.target.files.length === 1) {
                  document.getElementById("thumbnail").style.display = "flex";
                } else {
                  document.getElementById("thumbnail").style.display = "none";
                }
              }}
            />
          </div>
          <div
            className="mb-3 justify-content-center"
            id="thumbnail"
            style={{ display: "none" }}
          >
            {thumbnailSrc && (
              <img
                src={thumbnailSrc}
                alt="thumb"
                className="mt-3"
                height={200}
                width={200}
              />
            )}
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="content" className="form-label">
              Images
            </label>
            <input
              type="file"
              name="thumbnail"
              id="images-input"
              className="form-control"
              multiple={true}
              onChange={(e) => setImages(e.target.files)}
            />
          </div>

          <div className="d-flex justify-content-center align-items-center flex-column">
            <ClipLoader loading={isLoading} />
            <button type="submit" className="btn btn-primary mb-5 w-50 mt-3">
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
