import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { convertToBase64 } from "../../utils/FileToBase64";
import { postBlogThunk } from "../store/thunk/blog-management";

const TextEditor = () => {
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.blog);

  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogData, setBlogData] = useState();

  const handlePostBlog = async (blogData) => {
    dispatch(postBlogThunk(blogData, navigate));
  };

  const handleSave = async () => {
    if (content) {
      const base64Image = coverImage ? await convertToBase64(coverImage) : null;

      const updatedBlogData = {
        title: title,
        content: content,
        file: base64Image,
      };
      setBlogData(updatedBlogData);
      handlePostBlog(updatedBlogData);
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
    "font",
    "size",
    "align",
    "blockquote",
    "code-block",
    "indent",
    "script",
  ];

  if (data.loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6 text-center">
          Create Your Fitness Blog
        </h2>

        <div className="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-indigo-300 font-medium mb-2"
            >
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter your blog title"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="mb-6">
            <label className="block text-indigo-300 font-medium mb-2">
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  id="coverImage"
                  onChange={handleCoverImageChange}
                  accept="image/*"
                />
                <label
                  htmlFor="coverImage"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg 
                    cursor-pointer transition-colors inline-block"
                >
                  Choose Image
                </label>
              </div>
              {coverImage && (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {coverImage.name}
                </div>
              )}
            </div>
          </div>

          {/* React Quill Editor */}
          <div className="mb-6">
            <label className="block text-indigo-300 font-medium mb-2">
              Blog Content
            </label>
            <div className="bg-gray-800 overflow-hidden border border-gray-700 rounded-lg">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your fitness journey..."
                className="text-white h-[400px] bg-gray-800 prose prose-invert 
                  prose-headings:text-indigo-400 prose-blockquote:border-l-indigo-500 
                  prose-blockquote:text-gray-300 prose-strong:text-white 
                  prose-code:bg-gray-700 prose-code:p-1 prose-code:rounded
                  hover:prose-a:text-indigo-300 prose-a:transition-colors"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!title || !content}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !title || !content
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Publish Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
