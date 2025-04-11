import {
  users, posts, likes, comments, follows, notifications,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Like, type InsertLike,
  type Comment, type InsertComment,
  type Follow, type InsertFollow,
  type Notification, type InsertNotification,
  type PostWithUser, type NotificationWithUsers
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getPostWithUser(id: number): Promise<PostWithUser | undefined>;
  getUserPosts(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: number): Promise<boolean>;
  getFeedPosts(): Promise<PostWithUser[]>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, postId: number): Promise<boolean>;
  getLikeByUserAndPost(userId: number, postId: number): Promise<Like | undefined>;
  
  // Comment operations
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Follow operations
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<boolean>;
  getFollowersByUserId(userId: number): Promise<User[]>;
  getFollowingByUserId(userId: number): Promise<User[]>;
  getFollowByUserIds(followerId: number, followingId: number): Promise<Follow | undefined>;
  
  // Notification operations
  getUserNotifications(userId: number): Promise<NotificationWithUsers[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationsAsRead(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  private follows: Map<number, Follow>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private likeIdCounter: number;
  private commentIdCounter: number;
  private followIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.likes = new Map();
    this.comments = new Map();
    this.follows = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.likeIdCounter = 1;
    this.commentIdCounter = 1;
    this.followIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with some test data
    this.initializeTestData();
  }
  
  private initializeTestData() {
    // Create users
    const user1 = this.createUser({ 
      username: "ana.silva", 
      password: "password123", 
      name: "Ana Silva", 
      location: "Rio de Janeiro",
      bio: "Photographer | Beach lover",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    const user2 = this.createUser({ 
      username: "carlos.mendes", 
      password: "password123", 
      name: "Carlos Mendes", 
      location: "São Paulo",
      bio: "Adventure enthusiast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    const user3 = this.createUser({ 
      username: "sofia.almeida", 
      password: "password123", 
      name: "Sofia Almeida", 
      location: "Recife",
      bio: "Food blogger",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    const user4 = this.createUser({ 
      username: "miguel.santos", 
      password: "password123", 
      name: "Miguel Santos", 
      location: "Florianópolis",
      bio: "Surfer | Travel enthusiast",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    const user5 = this.createUser({ 
      username: "julia.lima", 
      password: "password123", 
      name: "Julia Lima", 
      location: "Salvador",
      bio: "Car enthusiast | Fashion",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    const user6 = this.createUser({ 
      username: "rafael.costa", 
      password: "password123", 
      name: "Rafael Costa", 
      location: "Brasília",
      bio: "Fotógrafo | Viajante | Amante da natureza",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    });
    
    // Create posts
    this.createPost({
      userId: user1.id,
      caption: "Curtindo esse dia maravilhoso na praia! 🌊☀️ #ferias #verao",
      imageUrl: "https://images.unsplash.com/photo-1533651180995-3b8dcd33e834?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    });
    
    this.createPost({
      userId: user2.id,
      caption: "Aventura de hoje! Trilha incrível com paisagens de tirar o fôlego 🏞️ #aventura #natureza",
      imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    });
    
    this.createPost({
      userId: user3.id,
      caption: "Almoço perfeito! 🍱 Experimentando essa culinária incrível #gastronomia #comida",
      imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    });
    
    this.createPost({
      userId: user4.id,
      caption: "Novo hobby! Aprendendo a surfar nas ondas perfeitas de Floripa 🏄‍♂️ #surf #praia",
      imageUrl: "https://images.unsplash.com/photo-1540339832862-474599807836?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    });
    
    this.createPost({
      userId: user5.id,
      caption: "Meu novo carro chegou! 🚗 Sonho realizado ✨ #carronovo #realizacao",
      imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    });
    
    // Create follows
    this.createFollow({ followerId: user6.id, followingId: user1.id });
    this.createFollow({ followerId: user6.id, followingId: user2.id });
    this.createFollow({ followerId: user6.id, followingId: user3.id });
    this.createFollow({ followerId: user1.id, followingId: user6.id });
    this.createFollow({ followerId: user2.id, followingId: user6.id });
    
    // Create likes
    this.createLike({ userId: user6.id, postId: 1 });
    this.createLike({ userId: user6.id, postId: 2 });
    this.createLike({ userId: user1.id, postId: 5 });
    this.createLike({ userId: user2.id, postId: 5 });
    this.createLike({ userId: user3.id, postId: 5 });
    
    // Create comments
    this.createComment({ userId: user2.id, postId: 1, content: "Lugar incrível! 😍" });
    this.createComment({ userId: user6.id, postId: 2, content: "Quero fazer essa trilha também!" });
    
    // Create notifications
    this.createNotification({ 
      userId: user6.id,
      triggeredByUserId: user1.id,
      type: "like",
      resourceId: 5
    });
    
    this.createNotification({
      userId: user6.id,
      triggeredByUserId: user2.id,
      type: "comment",
      resourceId: 2
    });
    
    this.createNotification({
      userId: user6.id,
      triggeredByUserId: user3.id,
      type: "follow",
      resourceId: null
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id, followersCount: 0, followingCount: 0, postsCount: 0 };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostWithUser(id: number): Promise<PostWithUser | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const user = this.users.get(post.userId);
    if (!user) return undefined;
    
    return { ...post, user };
  }
  
  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    
    const post: Post = { 
      ...postData, 
      id, 
      likesCount: 0, 
      commentsCount: 0, 
      createdAt: now 
    };
    
    this.posts.set(id, post);
    
    // Update user post count
    const user = this.users.get(postData.userId);
    if (user) {
      this.users.set(user.id, {
        ...user,
        postsCount: user.postsCount + 1
      });
    }
    
    return post;
  }
  
  async deletePost(id: number): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post) return false;
    
    this.posts.delete(id);
    
    // Update user post count
    const user = this.users.get(post.userId);
    if (user) {
      this.users.set(user.id, {
        ...user,
        postsCount: user.postsCount - 1
      });
    }
    
    // Delete associated likes and comments
    for (const [likeId, like] of this.likes.entries()) {
      if (like.postId === id) {
        this.likes.delete(likeId);
      }
    }
    
    for (const [commentId, comment] of this.comments.entries()) {
      if (comment.postId === id) {
        this.comments.delete(commentId);
      }
    }
    
    return true;
  }
  
  async getFeedPosts(): Promise<PostWithUser[]> {
    const postsArray = Array.from(this.posts.values());
    const result: PostWithUser[] = [];
    
    for (const post of postsArray) {
      const user = this.users.get(post.userId);
      if (user) {
        result.push({ ...post, user });
      }
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Like operations
  async createLike(likeData: InsertLike): Promise<Like> {
    // Check if like already exists
    const existingLike = await this.getLikeByUserAndPost(likeData.userId, likeData.postId);
    if (existingLike) {
      return existingLike;
    }
    
    const id = this.likeIdCounter++;
    const now = new Date();
    
    const like: Like = { ...likeData, id, createdAt: now };
    this.likes.set(id, like);
    
    // Update post like count
    const post = this.posts.get(likeData.postId);
    if (post) {
      this.posts.set(post.id, {
        ...post,
        likesCount: post.likesCount + 1
      });
    }
    
    // Create notification for the post owner
    if (post && post.userId !== likeData.userId) {
      this.createNotification({
        userId: post.userId,
        triggeredByUserId: likeData.userId,
        type: "like",
        resourceId: post.id
      });
    }
    
    return like;
  }
  
  async deleteLike(userId: number, postId: number): Promise<boolean> {
    const likes = Array.from(this.likes.values());
    const like = likes.find(l => l.userId === userId && l.postId === postId);
    
    if (!like) return false;
    
    this.likes.delete(like.id);
    
    // Update post like count
    const post = this.posts.get(postId);
    if (post) {
      this.posts.set(post.id, {
        ...post,
        likesCount: Math.max(0, post.likesCount - 1)
      });
    }
    
    return true;
  }
  
  async getLikeByUserAndPost(userId: number, postId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.userId === userId && like.postId === postId
    );
  }

  // Comment operations
  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    
    const comment: Comment = { ...commentData, id, createdAt: now };
    this.comments.set(id, comment);
    
    // Update post comment count
    const post = this.posts.get(commentData.postId);
    if (post) {
      this.posts.set(post.id, {
        ...post,
        commentsCount: post.commentsCount + 1
      });
      
      // Create notification for the post owner
      if (post.userId !== commentData.userId) {
        this.createNotification({
          userId: post.userId,
          triggeredByUserId: commentData.userId,
          type: "comment",
          resourceId: post.id
        });
      }
    }
    
    return comment;
  }

  // Follow operations
  async createFollow(followData: InsertFollow): Promise<Follow> {
    // Check if follow already exists
    const existingFollow = await this.getFollowByUserIds(followData.followerId, followData.followingId);
    if (existingFollow) {
      return existingFollow;
    }
    
    const id = this.followIdCounter++;
    const now = new Date();
    
    const follow: Follow = { ...followData, id, createdAt: now };
    this.follows.set(id, follow);
    
    // Update follower and following counts
    const follower = this.users.get(followData.followerId);
    if (follower) {
      this.users.set(follower.id, {
        ...follower,
        followingCount: follower.followingCount + 1
      });
    }
    
    const following = this.users.get(followData.followingId);
    if (following) {
      this.users.set(following.id, {
        ...following,
        followersCount: following.followersCount + 1
      });
      
      // Create notification
      if (followData.followerId !== followData.followingId) {
        this.createNotification({
          userId: followData.followingId,
          triggeredByUserId: followData.followerId,
          type: "follow",
          resourceId: null
        });
      }
    }
    
    return follow;
  }
  
  async deleteFollow(followerId: number, followingId: number): Promise<boolean> {
    const follows = Array.from(this.follows.values());
    const follow = follows.find(f => f.followerId === followerId && f.followingId === followingId);
    
    if (!follow) return false;
    
    this.follows.delete(follow.id);
    
    // Update follower and following counts
    const follower = this.users.get(followerId);
    if (follower) {
      this.users.set(follower.id, {
        ...follower,
        followingCount: Math.max(0, follower.followingCount - 1)
      });
    }
    
    const following = this.users.get(followingId);
    if (following) {
      this.users.set(following.id, {
        ...following,
        followersCount: Math.max(0, following.followersCount - 1)
      });
    }
    
    return true;
  }
  
  async getFollowersByUserId(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    const followers: User[] = [];
    for (const id of followerIds) {
      const user = this.users.get(id);
      if (user) {
        followers.push(user);
      }
    }
    
    return followers;
  }
  
  async getFollowingByUserId(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    const following: User[] = [];
    for (const id of followingIds) {
      const user = this.users.get(id);
      if (user) {
        following.push(user);
      }
    }
    
    return following;
  }
  
  async getFollowByUserIds(followerId: number, followingId: number): Promise<Follow | undefined> {
    return Array.from(this.follows.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }

  // Notification operations
  async getUserNotifications(userId: number): Promise<NotificationWithUsers[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const result: NotificationWithUsers[] = [];
    
    for (const notification of userNotifications) {
      const triggeredByUser = notification.triggeredByUserId 
        ? this.users.get(notification.triggeredByUserId) 
        : undefined;
      
      if (!triggeredByUser) continue;
      
      let post: Post | undefined;
      if (notification.resourceId && (notification.type === 'like' || notification.type === 'comment')) {
        post = this.posts.get(notification.resourceId);
      }
      
      result.push({
        ...notification,
        triggeredByUser,
        post
      });
    }
    
    return result;
  }
  
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    
    const notification: Notification = { 
      ...notificationData, 
      id, 
      read: false, 
      createdAt: now 
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationsAsRead(userId: number): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    for (const notification of userNotifications) {
      this.notifications.set(notification.id, {
        ...notification,
        read: true
      });
    }
    
    return true;
  }
}

export const storage = new MemStorage();
