import {
  users, courses, userCourses, challenges, discussions, discussionTags,
  jobs, jobTags, projects,
  type User, type InsertUser,
  type Course, type InsertCourse,
  type UserCourse, type InsertUserCourse,
  type Challenge, type InsertChallenge, 
  type Discussion, type InsertDiscussion,
  type DiscussionTag, type InsertDiscussionTag,
  type Job, type InsertJob,
  type JobTag, type InsertJobTag,
  type Project, type InsertProject
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // User Courses
  getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]>;
  createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(id: number, completedModules: number): Promise<UserCourse | undefined>;
  
  // Challenges
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Discussions
  getDiscussions(): Promise<(Discussion & { user: Pick<User, 'id' | 'username' | 'avatar'>, tags: string[] })[]>;
  getDiscussion(id: number): Promise<(Discussion & { user: Pick<User, 'id' | 'username' | 'avatar'>, tags: string[] }) | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  addDiscussionTag(tag: InsertDiscussionTag): Promise<DiscussionTag>;
  
  // Jobs
  getJobs(): Promise<(Job & { tags: string[] })[]>;
  getJob(id: number): Promise<(Job & { tags: string[] }) | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  addJobTag(tag: InsertJobTag): Promise<JobTag>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private userCourses: Map<number, UserCourse>;
  private challenges: Map<number, Challenge>;
  private discussions: Map<number, Discussion>;
  private discussionTags: Map<number, DiscussionTag>;
  private jobs: Map<number, Job>;
  private jobTags: Map<number, JobTag>;
  private projects: Map<number, Project>;
  
  private currentUserId: number;
  private currentCourseId: number;
  private currentUserCourseId: number;
  private currentChallengeId: number;
  private currentDiscussionId: number;
  private currentDiscussionTagId: number;
  private currentJobId: number;
  private currentJobTagId: number;
  private currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.challenges = new Map();
    this.discussions = new Map();
    this.discussionTags = new Map();
    this.jobs = new Map();
    this.jobTags = new Map();
    this.projects = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentUserCourseId = 1;
    this.currentChallengeId = 1;
    this.currentDiscussionId = 1;
    this.currentDiscussionTagId = 1;
    this.currentJobId = 1;
    this.currentJobTagId = 1;
    this.currentProjectId = 1;
    
    // Seed some demo data
    this.seedDemoData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Courses
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }
  
  // User Courses
  async getUserCourses(userId: number): Promise<(UserCourse & { course: Course })[]> {
    const userCourses = Array.from(this.userCourses.values()).filter(
      (userCourse) => userCourse.userId === userId
    );
    
    return userCourses.map(userCourse => {
      const course = this.courses.get(userCourse.courseId);
      if (!course) {
        throw new Error(`Course with id ${userCourse.courseId} not found`);
      }
      return { ...userCourse, course };
    });
  }
  
  async createUserCourse(insertUserCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.currentUserCourseId++;
    const userCourse: UserCourse = { 
      ...insertUserCourse, 
      id, 
      lastAccessedAt: new Date() 
    };
    this.userCourses.set(id, userCourse);
    return userCourse;
  }
  
  async updateUserCourseProgress(id: number, completedModules: number): Promise<UserCourse | undefined> {
    const userCourse = this.userCourses.get(id);
    if (!userCourse) return undefined;
    
    const updatedUserCourse: UserCourse = {
      ...userCourse,
      completedModules,
      lastAccessedAt: new Date()
    };
    
    this.userCourses.set(id, updatedUserCourse);
    return updatedUserCourse;
  }
  
  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const challenge: Challenge = { ...insertChallenge, id, participants: 0 };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  // Discussions
  async getDiscussions(): Promise<(Discussion & { user: Pick<User, 'id' | 'username' | 'avatar'>, tags: string[] })[]> {
    const discussions = Array.from(this.discussions.values());
    
    return discussions.map(discussion => {
      const user = this.users.get(discussion.userId);
      if (!user) {
        throw new Error(`User with id ${discussion.userId} not found`);
      }
      
      const tags = Array.from(this.discussionTags.values())
        .filter(tag => tag.discussionId === discussion.id)
        .map(tag => tag.tag);
      
      return {
        ...discussion,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        },
        tags
      };
    });
  }
  
  async getDiscussion(id: number): Promise<(Discussion & { user: Pick<User, 'id' | 'username' | 'avatar'>, tags: string[] }) | undefined> {
    const discussion = this.discussions.get(id);
    if (!discussion) return undefined;
    
    const user = this.users.get(discussion.userId);
    if (!user) {
      throw new Error(`User with id ${discussion.userId} not found`);
    }
    
    const tags = Array.from(this.discussionTags.values())
      .filter(tag => tag.discussionId === discussion.id)
      .map(tag => tag.tag);
    
    return {
      ...discussion,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      tags
    };
  }
  
  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.currentDiscussionId++;
    const discussion: Discussion = { 
      ...insertDiscussion, 
      id, 
      createdAt: new Date(),
      upvotes: 0,
      views: 0,
      comments: 0
    };
    this.discussions.set(id, discussion);
    return discussion;
  }
  
  async addDiscussionTag(insertTag: InsertDiscussionTag): Promise<DiscussionTag> {
    const id = this.currentDiscussionTagId++;
    const tag: DiscussionTag = { ...insertTag, id };
    this.discussionTags.set(id, tag);
    return tag;
  }
  
  // Jobs
  async getJobs(): Promise<(Job & { tags: string[] })[]> {
    const jobs = Array.from(this.jobs.values());
    
    return jobs.map(job => {
      const tags = Array.from(this.jobTags.values())
        .filter(tag => tag.jobId === job.id)
        .map(tag => tag.tag);
      
      return { ...job, tags };
    });
  }
  
  async getJob(id: number): Promise<(Job & { tags: string[] }) | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const tags = Array.from(this.jobTags.values())
      .filter(tag => tag.jobId === job.id)
      .map(tag => tag.tag);
    
    return { ...job, tags };
  }
  
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const job: Job = { 
      ...insertJob, 
      id, 
      postedAt: new Date() 
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async addJobTag(insertTag: InsertJobTag): Promise<JobTag> {
    const id = this.currentJobTagId++;
    const tag: JobTag = { ...insertTag, id };
    this.jobTags.set(id, tag);
    return tag;
  }
  
  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // Seed demo data
  private seedDemoData() {
    // Create a demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "sarah_williams",
      password: "password123",
      fullName: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face",
      bio: "Full Stack Developer",
      role: "user"
    };
    this.users.set(demoUser.id, demoUser);

    // Create other users for discussions
    const user2: User = {
      id: this.currentUserId++,
      username: "michael_chen",
      password: "password123",
      fullName: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      bio: "Frontend Developer",
      role: "user"
    };
    this.users.set(user2.id, user2);

    const user3: User = {
      id: this.currentUserId++,
      username: "sophia_rodriguez",
      password: "password123",
      fullName: "Sophia Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      bio: "Backend Developer",
      role: "user"
    };
    this.users.set(user3.id, user3);

    const user4: User = {
      id: this.currentUserId++,
      username: "david_kumar",
      password: "password123",
      fullName: "David Kumar",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      bio: "DevOps Engineer",
      role: "user"
    };
    this.users.set(user4.id, user4);

    // Create courses
    const courses: InsertCourse[] = [
      {
        title: "Advanced JavaScript Patterns",
        description: "Learn modern JavaScript patterns and advanced concepts to level up your development skills.",
        category: "JavaScript",
        thumbnail: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&q=80&w=400&h=225&fit=crop",
        totalModules: 8,
        level: "advanced"
      },
      {
        title: "React Performance Optimization",
        description: "Master techniques to build faster, more efficient React applications with advanced optimization strategies.",
        category: "React",
        thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&q=80&w=400&h=225&fit=crop",
        totalModules: 10,
        level: "intermediate"
      },
      {
        title: "Data Analysis with Python",
        description: "Learn how to analyze and visualize data effectively with Python, pandas, and matplotlib.",
        category: "Python",
        thumbnail: "https://images.unsplash.com/photo-1602992708529-c9fdb12905c9?auto=format&q=80&w=400&h=225&fit=crop",
        totalModules: 7,
        level: "beginner"
      }
    ];

    courses.forEach(course => {
      const id = this.currentCourseId++;
      this.courses.set(id, { ...course, id });
    });

    // Create user courses (progress)
    const userCourses: InsertUserCourse[] = [
      {
        userId: demoUser.id,
        courseId: 1,
        completedModules: 5
      },
      {
        userId: demoUser.id,
        courseId: 2,
        completedModules: 3
      },
      {
        userId: demoUser.id,
        courseId: 3,
        completedModules: 1
      }
    ];

    userCourses.forEach(userCourse => {
      const id = this.currentUserCourseId++;
      this.userCourses.set(id, { 
        ...userCourse, 
        id, 
        lastAccessedAt: new Date() 
      });
    });

    // Create challenges
    const challenges: InsertChallenge[] = [
      {
        title: "Binary Tree Maximum Path Sum",
        description: "Find the maximum path sum in a binary tree. The path may start and end at any node in the tree.",
        category: "Algorithm",
        difficulty: "Hard"
      },
      {
        title: "Build a Responsive Dashboard",
        description: "Create a responsive admin dashboard with charts and data visualization using any frontend framework.",
        category: "Frontend",
        difficulty: "Medium"
      }
    ];

    challenges.forEach((challenge, index) => {
      const id = this.currentChallengeId++;
      const participants = index === 0 ? 247 : 189;
      this.challenges.set(id, { ...challenge, id, participants });
    });

    // Create discussions
    const discussions: InsertDiscussion[] = [
      {
        title: "What's your preferred state management solution for React in 2023?",
        content: "With so many options now (Redux, Context API, Zustand, Recoil, Jotai), I'm curious what people are using in production and why.",
        userId: user2.id
      },
      {
        title: "Switching from MongoDB to PostgreSQL - what should I watch out for?",
        content: "Our team is planning to migrate from MongoDB to PostgreSQL for better data integrity. Looking for advice from those who've made this transition.",
        userId: user3.id
      },
      {
        title: "How are you handling authentication in your microservices architecture?",
        content: "Looking for best practices on implementing authentication across multiple microservices. Currently considering JWT with a dedicated auth service.",
        userId: user4.id
      }
    ];

    const discussionData = [
      {
        tags: ["react", "state-management", "frontend", "javascript"],
        upvotes: 42,
        views: 187,
        comments: 24,
        createdHoursAgo: 2
      },
      {
        tags: ["databases", "mongodb", "postgresql", "migration"],
        upvotes: 37,
        views: 142,
        comments: 19,
        createdHoursAgo: 6
      },
      {
        tags: ["authentication", "microservices", "jwt", "security"],
        upvotes: 29,
        views: 213,
        comments: 31,
        createdHoursAgo: 24
      }
    ];

    discussions.forEach((discussion, index) => {
      const id = this.currentDiscussionId++;
      const data = discussionData[index];
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - data.createdHoursAgo);
      
      this.discussions.set(id, { 
        ...discussion, 
        id, 
        createdAt,
        upvotes: data.upvotes,
        views: data.views,
        comments: data.comments 
      });
      
      // Add tags
      data.tags.forEach(tag => {
        const tagId = this.currentDiscussionTagId++;
        this.discussionTags.set(tagId, {
          id: tagId,
          discussionId: id,
          tag
        });
      });
    });

    // Create jobs
    const jobs: InsertJob[] = [
      {
        title: "Senior React Developer",
        company: "TechStack, Inc.",
        location: "San Francisco, CA",
        description: "Build modern web applications with React, Redux, and GraphQL in a collaborative environment.",
        salary: "$120K - $160K",
        logoUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=64&h=64&fit=crop"
      },
      {
        title: "Backend Engineer (Python)",
        company: "DataFlow",
        location: "Remote",
        description: "Join our team to build scalable backend services with Python, FastAPI, and AWS infrastructure.",
        salary: "$90K - $130K",
        logoUrl: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop"
      },
      {
        title: "DevOps Engineer",
        company: "CloudMatrix",
        location: "New York, NY",
        description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and optimize application delivery workflows.",
        salary: "$110K - $150K",
        logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop"
      }
    ];

    const jobData = [
      {
        tags: ["React", "Redux", "GraphQL", "TypeScript"],
        daysAgo: 2
      },
      {
        tags: ["Python", "FastAPI", "AWS", "PostgreSQL"],
        daysAgo: 7
      },
      {
        tags: ["Kubernetes", "Docker", "CI/CD", "Terraform"],
        daysAgo: 3
      }
    ];

    jobs.forEach((job, index) => {
      const id = this.currentJobId++;
      const data = jobData[index];
      const postedAt = new Date();
      postedAt.setDate(postedAt.getDate() - data.daysAgo);
      
      this.jobs.set(id, { ...job, id, postedAt });
      
      // Add tags
      data.tags.forEach(tag => {
        const tagId = this.currentJobTagId++;
        this.jobTags.set(tagId, {
          id: tagId,
          jobId: id,
          tag
        });
      });
    });

    // Create projects
    const projects: InsertProject[] = [
      {
        title: "Build a Personal Portfolio",
        description: "Create a responsive portfolio website showcasing your skills and projects.",
        difficulty: "Beginner",
        category: "Frontend",
        thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&q=80&w=400&h=225&fit=crop"
      },
      {
        title: "Create a Real-time Chat Application",
        description: "Build a real-time chat application using WebSockets and modern JavaScript.",
        difficulty: "Intermediate",
        category: "Fullstack",
        thumbnail: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&q=80&w=400&h=225&fit=crop"
      },
      {
        title: "E-commerce Platform with Payment Integration",
        description: "Develop a complete e-commerce platform with product listings, cart functionality, and payment processing.",
        difficulty: "Advanced",
        category: "Fullstack",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&q=80&w=400&h=225&fit=crop"
      }
    ];

    projects.forEach(project => {
      const id = this.currentProjectId++;
      this.projects.set(id, { ...project, id });
    });
  }
}

export const storage = new MemStorage();
