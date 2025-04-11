import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { 
  insertUserSchema, 
  insertPostSchema, 
  insertLikeSchema, 
  insertCommentSchema, 
  insertFollowSchema,
  insertProductSchema,
  insertOrderSchema,
  insertReviewSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Initialize Stripe with your secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil"
    })
  : null;

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
  
  // Product routes
  apiRouter.get("/products", async (req: Request, res: Response) => {
    try {
      const { category, type } = req.query;
      const products = await storage.getAllProducts(
        category as string | undefined, 
        type as string | undefined
      );
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/products/featured", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductWithReviews(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/users/:id/products", async (req: Request, res: Response) => {
    try {
      const sellerId = parseInt(req.params.id);
      const user = await storage.getUser(sellerId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const products = await storage.getSellerProducts(sellerId);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(productData.sellerId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  apiRouter.put("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const productData = req.body;
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const updatedProduct = await storage.updateProduct(productId, productData);
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.delete("/products/:id", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      await storage.deleteProduct(productId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Review routes
  apiRouter.get("/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Check if product exists
      const product = await storage.getProduct(reviewData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(reviewData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Order routes
  apiRouter.get("/users/:id/orders", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.get("/sellers/:id/orders", async (req: Request, res: Response) => {
    try {
      const sellerId = parseInt(req.params.id);
      
      const user = await storage.getUser(sellerId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const orders = await storage.getSellerOrders(sellerId);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  apiRouter.post("/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Check if product exists
      const product = await storage.getProduct(orderData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(orderData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  apiRouter.put("/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Payment routes
  apiRouter.post("/create-payment-intent", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable." 
      });
    }
    
    try {
      const { amount, productId, userId } = req.body;
      
      if (!amount || !productId || !userId) {
        return res.status(400).json({ 
          message: "Amount, productId, and userId are required" 
        });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productId: productId.toString(),
          userId: userId.toString()
        }
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: "Failed to create payment intent" 
      });
    }
  });
  
  apiRouter.post("/payment-webhook", express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Stripe is not configured" 
      });
    }
    
    const sig = req.headers['stripe-signature'] as string;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Webhook signature verification failed" });
      return;
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { productId, userId } = paymentIntent.metadata;
        
        if (productId && userId) {
          await storage.createOrder({
            userId: parseInt(userId),
            productId: parseInt(productId),
            amount: (paymentIntent.amount / 100).toString(),
            stripePaymentIntentId: paymentIntent.id
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  });
  
  // User seller status route
  apiRouter.post("/users/:id/seller-status", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { isSeller } = req.body;
      
      if (isSeller === undefined) {
        return res.status(400).json({ message: "isSeller field is required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserSellerStatus(userId, isSeller);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = updatedUser || {};
      res.json(userWithoutPassword);
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
