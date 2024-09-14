const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { blogModel } = require("../Models/blog");
const commentModel = require("../Models/comment");
const userModel = require("../Models/user");
const likeModel = require("../Models/like");
const cloudinary = require("cloudinary").v2;
const saveModel = require("../Models/save");

const blogRouter = Router();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer storage (memory storage)
const upload = multer(); // For handling multipart/form-data (buffer storage)

// Utility function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "blogimages" },  // Optionally specify a folder in Cloudinary
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);  // Resolve with Cloudinary URL
                }
            }
        );
        stream.end(fileBuffer);  // Pass the file buffer to the upload stream
    });
};

blogRouter.get("/my-blogs", async(req, res) => {
    if(req.user) {
        const createdBy = req.user._id;
        console.log(createdBy);

        const blogs = await blogModel.find({createdBy})
        console.log(blogs);

        return res.render("myblogs", {
            user : req.user, 
            blogs : blogs
        });
    } 
    return res.render("home");
});

blogRouter.get("/add-blog", (req, res) => {
    if(req.user == undefined) {
        return res.redirect("/signup");
    }

    return res.render("addblog", {
        user: req.user
    });
});


blogRouter.post("/new", upload.single('image'), async (req, res) => {
    // Check if the user is logged in
    if (req.user == undefined) {
        return res.redirect("/signup");
    }

    // Extracting form fields (title and content) from req.body
    const { title, content } = req.body;

    // Check if title and content are provided
    if (!title || !content) {
        return res.status(400).send("Title and content are required.");
    }

    let cloudImageURL = null;

    // If a file is uploaded, upload it to Cloudinary
    if (req.file) {
        try {
            cloudImageURL = await uploadToCloudinary(req.file.buffer);  // Upload image buffer
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).send("Error uploading image to Cloudinary.");
        }
    }

    // Create the blog in the database
    try {
        const blog = await blogModel.create({
            title: title,
            content: content,
            createdBy: req.user._id,
            coverImage: cloudImageURL
        });

        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).send("Error creating blog.");
    }
});

blogRouter.get("/:blogId", async (req, res) => {
    try {
        const _id = req.params.blogId;
        
        const blog = await blogModel.findById(_id).populate("createdBy");
        console.log(blog)
        const comments = await commentModel.find({ blogId: _id }).populate("createdBy");

        const likeDoc = await likeModel.findOne({ blogId: _id });
        // Initialize like count and check if the user has liked the blog
        let likecount = 0;
        let userHasLiked = false;

        if (likeDoc) {
            likecount = likeDoc.likedBy.length;

            // Check if the current user has liked the blog
            if (req.user) {
                userHasLiked = likeDoc.likedBy.includes(req.user._id);
            }
        }


        const saveDoc = await saveModel.findOne({ blogId : _id });
        let saveCount = 0;
        let userHasSaved = false;

        if(saveDoc) {
            saveCount = saveDoc.savedby.length;

            // Check if the current user has saved the blog
            if (req.user) {
                userHasSaved = saveDoc.savedby.includes(req.user._id);
            }
        } 

        return res.render("blogpage", {
            user: req.user,
            blog,
            comments,
            likecount,
            userHasLiked,
            saveCount,
            userHasSaved,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
});

blogRouter.post("/comment/:blogId", async(req, res) => {
    await commentModel.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy : req.user._id
    });

    return res.redirect(`/blog/${req.params.blogId}`);
})


blogRouter.post("/like/:blogId", async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.user._id;

        console.log(blogId, userId);

        // Find the blog document
        let blogDoc = await blogModel.findById(blogId);

        if (!blogDoc) {
            return res.status(404).send("Blog not found");
        }

        // Find the user document
        const userDoc = await userModel.findById(userId);
        console.log(blogDoc, "\n", userDoc);

        if (!userDoc) {
            return res.status(404).send("User not found");
        }

        // Check if the blog is already in the user's Likedblogs array
        const isAlreadyLiked = userDoc.Likedblogs.some((blog) => blog.toString() === blogId);

        if (isAlreadyLiked) {
            // Remove the blog ID from the Likedblogs array
            await userModel.updateOne(
                { _id: userId },
                { $pull: { Likedblogs: blogId } } // Use blog ID for pulling
            );
        } else {
            // Add the blogDoc to the Likedblogs array
            await userModel.updateOne(
                { _id: userId },
                { $push: { Likedblogs: blogId } } // Convert blogDoc to a plain object
            );
        }

        // Find or create the like document
        let likeDoc = await likeModel.findOne({ blogId });

        if (!likeDoc) {
            // If no like document exists, create a new one
            likeDoc = new likeModel({ blogId, likedBy: [userId] });
            await likeDoc.save();
        } else {
            // If the like document exists, check if the user has already liked the blog
            const hasLiked = likeDoc.likedBy.includes(userId);

            if (hasLiked) {
                // Remove the user's like
                likeDoc.likedBy = likeDoc.likedBy.filter(id => id.toString() !== userId.toString());
            } else {
                // Add the user's like
                likeDoc.likedBy.push(userId);
            }
            
            await likeDoc.save();
        }

        return res.redirect(`/blog/${blogId}`);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
});

blogRouter.post("/save/:blogId", async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user._id;

    let blogDoc = await blogModel.findById(blogId);

    const userDoc = await userModel.findById(userId);

    if (!userDoc) {
        return res.status(404).send("User not found");
    }

    if(!blogDoc) {
        return res.status(404).send("Blog Not found");
    } 

    const hasSaved = userDoc.Savedblogs.some((blog) => blog.toString() == blogId);

    if(hasSaved) {
        await userModel.updateOne(
            {_id : userId}, 
            { $pull : { Savedblogs : blogId } }
        )
    } else {
        await userModel.updateOne(
            {_id: userId},
            { $push : { Savedblogs : blogId }}
        )
    }

    // Find if present else create
    let saveDoc = await saveModel.findOne({ blogId });

    if (!saveDoc) {
        // If no save document exists, create a new one
        saveDoc = new saveModel({ blogId, savedby: [userId] });
        await saveDoc.save();
    } else {
        // If the save document exists, check if the user has already saved the blog
        const hasSaved = saveDoc.savedby.includes(userId);

        if (hasSaved) {
            // Remove the user's save
            saveDoc.savedby = saveDoc.savedby.filter(id => id.toString() !== userId.toString());
        } else {
            // Add the user's save
            saveDoc.savedby.push(userId);
        }
        
        await saveDoc.save();
    }

    return res.redirect(`/blog/${blogId}`); // Redirect to the blog page or wherever you want
});

blogRouter.get("/saveblogs" , async(req,res) => {
    try {
        let userDoc;
    
        if(req.user) {
            userDoc = await userModel.findById(req.user._id).populate('Savedblogs').exec();
        }

        conosole.log(userDoc)

        return res.send("done");
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})

module.exports = {
    blogRouter
}