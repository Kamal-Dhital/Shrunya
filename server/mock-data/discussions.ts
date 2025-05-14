// Mock data for community discussions
export const discussions = [
  {
    id: 1,
    title: "What's your preferred state management solution for React in 2023?",
    content: "With so many options now (Redux, Context API, Zustand, Recoil, Jotai), I'm curious what people are using in production and why.",
    userId: 2,
    createdAt: "2023-07-20T14:30:00Z",
    upvotes: 42,
    views: 187,
    comments: [
      {
        id: 1,
        userId: 3,
        content: "I've been using Zustand for my recent projects and love the simplicity. It's much less boilerplate than Redux.",
        createdAt: "2023-07-20T15:45:00Z",
        upvotes: 12
      },
      {
        id: 2,
        userId: 4,
        content: "Context API works well for smaller apps, but I still prefer Redux for larger applications with complex state.",
        createdAt: "2023-07-20T16:30:00Z",
        upvotes: 8
      }
    ],
    tags: ["react", "state-management", "frontend", "javascript"]
  },
  {
    id: 2,
    title: "Switching from MongoDB to PostgreSQL - what should I watch out for?",
    content: "Our team is planning to migrate from MongoDB to PostgreSQL for better data integrity. Looking for advice from those who've made this transition.",
    userId: 3,
    createdAt: "2023-07-19T10:15:00Z",
    upvotes: 37,
    views: 142,
    comments: [
      {
        id: 3,
        userId: 2,
        content: "The biggest challenge we faced was redesigning our schema to be relational. Take time to properly plan your tables and relationships.",
        createdAt: "2023-07-19T11:20:00Z",
        upvotes: 15
      }
    ],
    tags: ["databases", "mongodb", "postgresql", "migration"]
  },
  {
    id: 3,
    title: "How are you handling authentication in your microservices architecture?",
    content: "Looking for best practices on implementing authentication across multiple microservices. Currently considering JWT with a dedicated auth service.",
    userId: 4,
    createdAt: "2023-07-18T08:45:00Z",
    upvotes: 29,
    views: 213,
    comments: [
      {
        id: 4,
        userId: 1,
        content: "We're using a combination of API Gateway for authentication and passing JWTs between services. Works well but requires careful planning for token expiration.",
        createdAt: "2023-07-18T09:30:00Z",
        upvotes: 10
      },
      {
        id: 5,
        userId: 3,
        content: "Consider using an identity provider like Auth0 or Keycloak. They handle a lot of the complexity for you.",
        createdAt: "2023-07-18T10:15:00Z",
        upvotes: 14
      }
    ],
    tags: ["authentication", "microservices", "jwt", "security"]
  },
  {
    id: 4,
    title: "Best practices for CI/CD pipelines in 2023",
    content: "I'm setting up CI/CD for a new project and wondering what tools and practices people are using these days. GitHub Actions? Jenkins? Something else?",
    userId: 1,
    createdAt: "2023-07-17T13:20:00Z",
    upvotes: 25,
    views: 178,
    comments: [
      {
        id: 6,
        userId: 2,
        content: "GitHub Actions has been great for us. The tight integration with GitHub makes it really convenient.",
        createdAt: "2023-07-17T14:10:00Z",
        upvotes: 8
      }
    ],
    tags: ["devops", "ci-cd", "github-actions", "automation"]
  },
  {
    id: 5,
    title: "Thoughts on Next.js 13 and the App Router?",
    content: "I'm considering migrating from pages router to app router in Next.js 13. Has anyone made the switch? How was your experience?",
    userId: 2,
    createdAt: "2023-07-16T09:45:00Z",
    upvotes: 33,
    views: 201,
    comments: [
      {
        id: 7,
        userId: 4,
        content: "We migrated a medium-sized app and it was mostly smooth. The nested layouts and server components are game changers.",
        createdAt: "2023-07-16T10:30:00Z",
        upvotes: 12
      },
      {
        id: 8,
        userId: 1,
        content: "Be careful with data fetching patterns - they're quite different. Read the docs thoroughly before migrating.",
        createdAt: "2023-07-16T11:15:00Z",
        upvotes: 9
      }
    ],
    tags: ["nextjs", "react", "web-development", "javascript"]
  }
];