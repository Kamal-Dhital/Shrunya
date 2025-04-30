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

    // Add additional user fields for profile
    const enhancedUser = {
      ...userWithoutPassword,
      joinedDate: userWithoutPassword.createdAt || new Date(2022, 3, 15).toISOString(),
      bio: "Full-stack developer passionate about JavaScript and modern web technologies. Always learning something new.",
      location: "San Francisco, CA",
      website: "https://example.com/profile",
      github: "dev_username",
      twitter: "dev_twitter",
      linkedin: "dev_linkedin"
    };
    
    res.json(enhancedUser);
  });
  
  app.patch(`${apiPrefix}/user/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // In a real app, we would update the user in the database
    // For now, we'll just return the submitted data as if it was updated
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Merge the existing user data with the update
    const updatedUser = {
      ...user,
      ...req.body,
      id
    };
    
    // Don't return the password
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json(userWithoutPassword);
  });
  
  // Courses
  app.get(`${apiPrefix}/courses`, async (_req: Request, res: Response) => {
    const courses = await storage.getCourses();
    
    // Add premium flag to some courses
    const enhancedCourses = courses.map((course, index) => ({
      ...course,
      isPremium: index % 3 === 0, // Make every third course premium
      price: index % 3 === 0 ? (49.99 + index).toFixed(2) : null,
      originalPrice: index % 3 === 0 ? (69.99 + index).toFixed(2) : null,
      discount: index % 3 === 0 ? 20 + (index % 10) : null,
      rating: (4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 100,
      students: Math.floor(Math.random() * 5000) + 500,
      duration: `${Math.floor(Math.random() * 10) + 5}h ${Math.floor(Math.random() * 59)}m`,
      lessons: Math.floor(Math.random() * 30) + 20
    }));
    
    res.json(enhancedCourses);
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
    
    // Add additional course details
    const enhancedCourse = {
      ...course,
      isPremium: id % 3 === 0, // Make some courses premium
      price: id % 3 === 0 ? (49.99 + id % 10).toFixed(2) : null,
      originalPrice: id % 3 === 0 ? (69.99 + id % 10).toFixed(2) : null,
      discount: id % 3 === 0 ? 20 + (id % 10) : null,
      rating: (4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 100,
      students: Math.floor(Math.random() * 5000) + 500,
      duration: `${Math.floor(Math.random() * 10) + 5}h ${Math.floor(Math.random() * 59)}m`,
      lessons: Math.floor(Math.random() * 30) + 20,
      exercises: Math.floor(Math.random() * 15) + 5,
      longDescription: "This comprehensive course will take you through all aspects of modern web development using JavaScript and related technologies. You'll learn how to build robust, scalable applications from the ground up.",
      learningPoints: [
        "Master key concepts in modern development",
        "Build real-world projects from scratch",
        "Learn best practices and industry standards",
        "Optimize applications for performance",
        "Deploy to production environments"
      ],
      requirements: [
        "Basic programming knowledge",
        "A computer with internet access",
        "Enthusiasm to learn and practice"
      ],
      modules: [
        {
          title: "Introduction to Course",
          lessons: [
            "Welcome and Course Overview",
            "Setting Up Your Development Environment",
            "Understanding Core Concepts"
          ],
          duration: "45 min"
        },
        {
          title: "Essential Foundations",
          lessons: [
            "Key Principles and Patterns",
            "Building Blocks of the Framework",
            "Common Techniques and Approaches",
            "Practical Examples"
          ],
          duration: "1h 20min"
        },
        {
          title: "Advanced Techniques",
          lessons: [
            "Deep Dive into Complex Features",
            "Performance Optimization",
            "Error Handling and Debugging",
            "Testing and Quality Assurance"
          ],
          duration: "1h 45min"
        },
        {
          title: "Real-World Projects",
          lessons: [
            "Project Planning and Architecture",
            "Implementation of Core Features",
            "Adding Advanced Functionality",
            "Testing and Deployment",
            "Maintenance and Future Improvements"
          ],
          duration: "3h 15min",
          isPremium: true
        }
      ]
    };
    
    res.json(enhancedCourse);
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
    
    // Enhance challenge with additional details
    const enhancedChallenge = {
      ...challenge,
      instructions: `
# ${challenge.title}

## Problem Description
${challenge.description}

## Instructions
1. Analyze the problem carefully
2. Devise a strategy to solve it
3. Implement your solution in code
4. Test with different inputs
5. Optimize for performance and readability

## Example Input
\`\`\`
[1, 2, 3, 4, 5]
\`\`\`

## Expected Output
\`\`\`
15
\`\`\`

## Constraints
- Time complexity should be O(n)
- Space complexity should be O(1)
- Handle edge cases properly
`,
      testCases: [
        {
          input: "[1, 2, 3, 4, 5]",
          expectedOutput: "15",
          explanation: "Sum of all elements in the array"
        },
        {
          input: "[-10, 9, 20, null, null, 15, 7]",
          expectedOutput: "42",
          explanation: "Maximum path sum through the node tree"
        },
        {
          input: "[3, 9, 20, 15, 7]",
          expectedOutput: "54",
          explanation: "Sum of all values in the node tree"
        }
      ],
      hints: [
        "Try using a recursive approach for tree-based problems",
        "Consider edge cases like empty inputs or negative values",
        "For optimization, think about how to avoid redundant calculations"
      ],
      solutions: {
        javascript: `function maximumPathSum(root) {
  let maxSum = Number.MIN_SAFE_INTEGER;
  
  function findMaxPath(node) {
    if (!node) return 0;
    
    // Find max path sum for left and right subtrees
    const leftMax = Math.max(0, findMaxPath(node.left));
    const rightMax = Math.max(0, findMaxPath(node.right));
    
    // Update maxSum if path through current node is greater
    maxSum = Math.max(maxSum, leftMax + rightMax + node.val);
    
    // Return max path ending at current node
    return Math.max(leftMax, rightMax) + node.val;
  }
  
  findMaxPath(root);
  return maxSum;
}`,
        python: `def maximum_path_sum(root):
    max_sum = float('-inf')
    
    def find_max_path(node):
        nonlocal max_sum
        if not node:
            return 0
        
        # Find max path sum for left and right subtrees
        left_max = max(0, find_max_path(node.left))
        right_max = max(0, find_max_path(node.right))
        
        # Update max_sum if path through current node is greater
        max_sum = max(max_sum, left_max + right_max + node.val)
        
        # Return max path ending at current node
        return max(left_max, right_max) + node.val
    
    find_max_path(root)
    return max_sum`
      },
      timeLimit: "30 minutes",
      difficultyDetails: {
        Easy: "Suitable for beginners, requires basic programming concepts",
        Medium: "Requires good understanding of algorithms and data structures",
        Hard: "Challenging problems that require advanced knowledge and optimization"
      }[challenge.difficulty] || "Standard difficulty level"
    };
    
    res.json(enhancedChallenge);
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
  
  // Challenge submissions
  app.post(`${apiPrefix}/challenge-submissions`, async (req: Request, res: Response) => {
    try {
      const { challengeId, userId, code, language } = req.body;
      
      // Simulate submission processing
      setTimeout(() => {
        // In a real application, this would test the code against test cases
      }, 2000);
      
      res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 1,
        challengeId,
        userId,
        language,
        status: "Submitted",
        submittedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit challenge solution" });
    }
  });
  
  app.get(`${apiPrefix}/challenge-submissions/:id/results`, async (req: Request, res: Response) => {
    try {
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }
      
      // Simulate test results
      const results = {
        id: submissionId,
        status: "Completed",
        score: Math.floor(Math.random() * 101),
        executionTime: Math.floor(Math.random() * 1000) + 200,
        memory: Math.floor(Math.random() * 100) + 50,
        passedTests: Math.floor(Math.random() * 10) + 1,
        totalTests: 10,
        feedback: "Good solution! Consider optimizing the time complexity."
      };
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get challenge results" });
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
    
    // Add comments to the discussion
    const enhancedDiscussion = {
      ...discussion,
      comments: [
        {
          id: 1,
          user: {
            id: 2,
            username: "dev_enthusiast",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
          },
          content: "Great point! I've found that Redux works well for larger applications, but can be overkill for simpler ones.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          upvotes: 7
        },
        {
          id: 2,
          user: {
            id: 3,
            username: "js_ninja",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
          },
          content: "I prefer using Context API for most use cases now. It's built into React and doesn't require additional libraries.",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          upvotes: 4
        },
        {
          id: 3,
          user: {
            id: 4,
            username: "web_developer",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
          },
          content: "It really depends on the project requirements. For complex state with frequent updates, Redux still has advantages.",
          createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          upvotes: 2
        }
      ]
    };
    
    res.json(enhancedDiscussion);
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
  
  app.post(`${apiPrefix}/discussions/:id/comments`, async (req: Request, res: Response) => {
    try {
      const discussionId = parseInt(req.params.id);
      if (isNaN(discussionId)) {
        return res.status(400).json({ message: "Invalid discussion ID" });
      }
      
      const { userId, content } = req.body;
      
      // In a real application, this would save the comment to the database
      const newComment = {
        id: Math.floor(Math.random() * 1000) + 1,
        discussionId,
        userId,
        content,
        createdAt: new Date().toISOString(),
        upvotes: 0
      };
      
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
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
    
    // Add additional job details
    const enhancedJob = {
      ...job,
      fullDescription: `
# ${job.title} at ${job.company}

## About the Role
${job.description}

## Responsibilities
- Design, develop, and maintain high-quality applications
- Collaborate with cross-functional teams to define and implement new features
- Write clean, efficient, and well-documented code
- Participate in code reviews and contribute to technical discussions
- Troubleshoot and fix bugs and performance issues

## Required Skills
- ${job.tags.slice(0, 3).join(', ')} experience
- Strong problem-solving abilities
- Excellent communication skills
- Experience with version control systems
- Understanding of software development lifecycle

## Benefits
- Competitive salary: ${job.salary || '$120K - $150K'}
- Remote work options available
- Flexible working hours
- Health, dental, and vision insurance
- 401(k) matching
- Professional development budget
- Generous paid time off

## How to Apply
Submit your resume and portfolio through our application system. We look forward to hearing from you!
`,
      companyInfo: {
        name: job.company,
        location: job.location,
        size: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000} employees`,
        industry: ["Technology", "Software Development", "Web Development", "Fintech", "Healthcare Tech"][Math.floor(Math.random() * 5)],
        founded: 2000 + Math.floor(Math.random() * 20),
        website: `https://www.${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
        about: `${job.company} is a leading technology company focused on creating innovative solutions that solve real-world problems. Our team consists of passionate individuals who are committed to excellence and continuous improvement.`
      },
      applicationProcess: {
        steps: [
          "Initial application review",
          "Technical assessment",
          "First interview with hiring manager",
          "Team interview",
          "Final interview with leadership",
          "Offer negotiation"
        ],
        timeframe: "2-3 weeks",
        contactEmail: `careers@${job.company.toLowerCase().replace(/\s+/g, '')}.com`
      }
    };
    
    res.json(enhancedJob);
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
  
  app.post(`${apiPrefix}/job-applications`, async (req: Request, res: Response) => {
    try {
      const { jobId, userId, resume, coverLetter } = req.body;
      
      // In a real application, this would save the application to the database
      const application = {
        id: Math.floor(Math.random() * 1000) + 1,
        jobId,
        userId,
        status: "Submitted",
        submittedAt: new Date().toISOString()
      };
      
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit job application" });
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
    
    // Add additional project details
    const enhancedProject = {
      ...project,
      skillsRequired: project.category.split(',').map((skill: string) => skill.trim()),
      estimatedTime: ["2-3 weeks", "1-2 months", "3-4 weeks"][Math.floor(Math.random() * 3)],
      objectives: [
        "Learn how to structure a complete application",
        "Implement best practices for code organization",
        "Create a responsive and accessible user interface",
        "Integrate with external APIs and services",
        "Deploy the application to a production environment"
      ],
      steps: [
        {
          name: "Project Setup",
          description: "Initialize the project and configure the development environment",
          tasks: [
            "Create a new project repository",
            "Set up the development environment",
            "Install necessary dependencies",
            "Configure build tools and scripts"
          ]
        },
        {
          name: "Feature Implementation",
          description: "Develop the core features of the application",
          tasks: [
            "Implement user authentication",
            "Create the main components and pages",
            "Set up routing and navigation",
            "Implement data fetching and state management"
          ]
        },
        {
          name: "Styling and UI/UX",
          description: "Design and style the application interface",
          tasks: [
            "Create a consistent design system",
            "Implement responsive layouts",
            "Add animations and transitions",
            "Ensure accessibility compliance"
          ]
        },
        {
          name: "Testing and Optimization",
          description: "Test the application and optimize performance",
          tasks: [
            "Write unit and integration tests",
            "Perform performance audits",
            "Optimize loading times and resource usage",
            "Fix bugs and improve error handling"
          ]
        },
        {
          name: "Deployment",
          description: "Deploy the application to a production environment",
          tasks: [
            "Configure deployment settings",
            "Set up continuous integration/deployment",
            "Implement monitoring and logging",
            "Document the project and create a README"
          ]
        }
      ],
      resources: [
        {
          name: "Design Assets",
          url: "https://example.com/design-assets",
          description: "UI design assets and mockups for the project"
        },
        {
          name: "API Documentation",
          url: "https://example.com/api-docs",
          description: "Documentation for the APIs used in the project"
        },
        {
          name: "Reference Implementation",
          url: "https://github.com/example/reference-repo",
          description: "A reference implementation to use as a guide"
        }
      ],
      completedBy: Math.floor(Math.random() * 500) + 100,
      averageRating: (4 + Math.random()).toFixed(1)
    };
    
    res.json(enhancedProject);
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
  
  app.post(`${apiPrefix}/project-submissions`, async (req: Request, res: Response) => {
    try {
      const { projectId, userId, repositoryUrl, deploymentUrl, notes } = req.body;
      
      // In a real application, this would save the submission to the database
      const submission = {
        id: Math.floor(Math.random() * 1000) + 1,
        projectId,
        userId,
        repositoryUrl,
        deploymentUrl,
        notes,
        status: "Submitted",
        submittedAt: new Date().toISOString()
      };
      
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit project" });
    }
  });
  
  // Settings
  app.get(`${apiPrefix}/user-settings/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // In a real application, this would fetch from the database
      // For this demo, we'll return mock settings
      const settings = {
        userId,
        theme: "system",
        fontSize: 100,
        highContrast: false,
        reducedMotion: false,
        notifications: {
          email: true,
          browser: true,
          mobile: false
        },
        emailFrequency: "daily",
        privacy: {
          profileVisibility: "public",
          activityVisibility: "followers"
        }
      };
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user settings" });
    }
  });
  
  app.patch(`${apiPrefix}/user-settings/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // In a real application, this would update the database
      // For this demo, we'll just return the data that was sent
      res.json({
        userId,
        ...req.body,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });
  
  // Simulated payment processing endpoint
  app.post(`${apiPrefix}/create-payment-intent`, async (req: Request, res: Response) => {
    try {
      const { amount, courseId } = req.body;
      
      // In a real application, this would integrate with Stripe or another payment processor
      // For this demo, we'll simulate a payment process
      const clientSecret = `sim_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setTimeout(() => {
        // Simulate payment processing time
      }, 1000);
      
      res.json({ 
        clientSecret,
        amount,
        courseId,
        currency: "usd",
        status: "requires_payment_method"
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
