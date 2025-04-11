import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertLikeSchema, 
  insertCommentSchema, 
  insertFollowSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Error handling middleware
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  };
  
  // User routes
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Post routes
  apiRouter.get("/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getFeedPosts();
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPostWithUser(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/users/:id/posts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const posts = await storage.getUserPosts(userId);
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/posts", async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(postData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Like routes
  apiRouter.post("/likes", async (req: Request, res: Response) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      
      // Check if post exists
      const post = await storage.getPost(likeData.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(likeData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  apiRouter.delete("/likes", async (req: Request, res: Response) => {
    try {
      const { userId, postId } = req.query;
      
      if (!userId || !postId) {
        return res.status(400).json({ message: "Missing userId or postId" });
      }
      
      const userIdNum = parseInt(userId as string);
      const postIdNum = parseInt(postId as string);
      
      const success = await storage.deleteLike(userIdNum, postIdNum);
      
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Comment routes
  apiRouter.get("/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      
      // Check if post exists
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/comments", async (req: Request, res: Response) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      
      // Check if post exists
      const post = await storage.getPost(commentData.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(commentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Follow routes
  apiRouter.post("/follows", async (req: Request, res: Response) => {
    try {
      const followData = insertFollowSchema.parse(req.body);
      
      // Check if both users exist
      const follower = await storage.getUser(followData.followerId);
      if (!follower) {
        return res.status(404).json({ message: "Follower not found" });
      }
      
      const following = await storage.getUser(followData.followingId);
      if (!following) {
        return res.status(404).json({ message: "Following user not found" });
      }
      
      const follow = await storage.createFollow(followData);
      res.status(201).json(follow);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  apiRouter.delete("/follows", async (req: Request, res: Response) => {
    try {
      const { followerId, followingId } = req.query;
      
      if (!followerId || !followingId) {
        return res.status(400).json({ message: "Missing followerId or followingId" });
      }
      
      const followerIdNum = parseInt(followerId as string);
      const followingIdNum = parseInt(followingId as string);
      
      const success = await storage.deleteFollow(followerIdNum, followingIdNum);
      
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Notification routes
  apiRouter.get("/users/:id/notifications", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/users/:id/notifications/read", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.markNotificationsAsRead(userId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Mount the API router with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
