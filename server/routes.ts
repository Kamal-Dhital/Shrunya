import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCourseSchema, insertUserCourseSchema, insertChallengeSchema, insertDiscussionSchema, insertJobSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = '/api';
  
  // Users
  app.get(`${apiPrefix}/user/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Courses
  app.get(`${apiPrefix}/courses`, async (_req: Request, res: Response) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });
  
  app.get(`${apiPrefix}/courses/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    
    const course = await storage.getCourse(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  });
  
  app.post(`${apiPrefix}/courses`, async (req: Request, res: Response) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  // User Courses (progress)
  app.get(`${apiPrefix}/user-courses/:userId`, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const userCourses = await storage.getUserCourses(userId);
    res.json(userCourses);
  });
  
  app.post(`${apiPrefix}/user-courses`, async (req: Request, res: Response) => {
    try {
      const userCourseData = insertUserCourseSchema.parse(req.body);
      const userCourse = await storage.createUserCourse(userCourseData);
      res.status(201).json(userCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user course" });
    }
  });
  
  app.patch(`${apiPrefix}/user-courses/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user course ID" });
    }
    
    const { completedModules } = req.body;
    if (typeof completedModules !== 'number' || completedModules < 0) {
      return res.status(400).json({ message: "Invalid completedModules value" });
    }
    
    const userCourse = await storage.updateUserCourseProgress(id, completedModules);
    if (!userCourse) {
      return res.status(404).json({ message: "User course not found" });
    }
    
    res.json(userCourse);
  });
  
  // Challenges
  app.get(`${apiPrefix}/challenges`, async (_req: Request, res: Response) => {
    const challenges = await storage.getChallenges();
    res.json(challenges);
  });
  
  app.get(`${apiPrefix}/challenges/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }
    
    const challenge = await storage.getChallenge(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    res.json(challenge);
  });
  
  app.post(`${apiPrefix}/challenges`, async (req: Request, res: Response) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  
  // Discussions
  app.get(`${apiPrefix}/discussions`, async (_req: Request, res: Response) => {
    const discussions = await storage.getDiscussions();
    res.json(discussions);
  });
  
  app.get(`${apiPrefix}/discussions/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid discussion ID" });
    }
    
    const discussion = await storage.getDiscussion(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    
    res.json(discussion);
  });
  
  app.post(`${apiPrefix}/discussions`, async (req: Request, res: Response) => {
    try {
      const discussionData = insertDiscussionSchema.parse(req.body);
      const discussion = await storage.createDiscussion(discussionData);
      
      // Handle tags if provided
      if (Array.isArray(req.body.tags)) {
        for (const tag of req.body.tags) {
          await storage.addDiscussionTag({
            discussionId: discussion.id,
            tag
          });
        }
      }
      
      res.status(201).json(discussion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid discussion data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create discussion" });
    }
  });
  
  // Jobs
  app.get(`${apiPrefix}/jobs`, async (_req: Request, res: Response) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });
  
  app.get(`${apiPrefix}/jobs/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    
    const job = await storage.getJob(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(job);
  });
  
  app.post(`${apiPrefix}/jobs`, async (req: Request, res: Response) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      
      // Handle tags if provided
      if (Array.isArray(req.body.tags)) {
        for (const tag of req.body.tags) {
          await storage.addJobTag({
            jobId: job.id,
            tag
          });
        }
      }
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });
  
  // Projects
  app.get(`${apiPrefix}/projects`, async (_req: Request, res: Response) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });
  
  app.get(`${apiPrefix}/projects/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });
  
  app.post(`${apiPrefix}/projects`, async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
