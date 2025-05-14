import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GithubIcon, BookOpenIcon, TrophyIcon, UsersIcon, BriefcaseIcon, CodeIcon } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 text-white mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" 
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-bold">SHRUNYA</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-gray-200 transition">Features</a>
              <a href="#courses" className="hover:text-gray-200 transition">Courses</a>
              <a href="#community" className="hover:text-gray-200 transition">Community</a>
              {/* <a href="#pricing" className="hover:text-gray-200 transition">Pricing</a> */}
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/auth/login")}
              >
                Log In
              </Button>
              <Button 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/auth/signup")}
              >
                Sign Up
              </Button>
            </div>
          </nav>

          <div className="py-20 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Elevate Your Development Journey
            </h1>
            <p className="text-xl mb-10">
              The complete platform for developers to learn, build, challenge themselves, 
              connect with others, and advance their careers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate("/auth/signup")}
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        {/* <div className="h-16 bg-white">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" className="fill-current text-primary -mt-1">
            <path d="M0 0 L1440 0 L1440 20 C1320 90, 1200 80, 1080 40 C960 0, 720 60, 600 80 C360 120, 120 40, 0 80 Z" />
          </svg>
        </div> */}
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything You Need in One Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Learning</h3>
              <p className="text-gray-600">
                Access high-quality courses taught by industry experts covering the latest technologies and best practices.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skill-Building Challenges</h3>
              <p className="text-gray-600">
                Test your skills with our coding challenges and improve your problem-solving abilities.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CodeIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practical Projects</h3>
              <p className="text-gray-600">
                Build real-world projects to apply your knowledge and expand your portfolio.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-gray-600">
                Connect with other developers, share knowledge, and collaborate on innovative solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Opportunities</h3>
              <p className="text-gray-600">
                Discover job opportunities aligned with your skills and career aspirations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <GithubIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
              <p className="text-gray-600">
                Seamlessly connect with your GitHub repositories and showcase your contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Advanced JavaScript Course" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Advanced JavaScript Patterns</h3>
                  <p className="text-gray-600 mb-4">
                    Master advanced JavaScript patterns and build better applications.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <div className="flex text-amber-400">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm ml-1">4.9 (427 reviews)</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">$49.99</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="React Mastery Course" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">React Mastery</h3>
                  <p className="text-gray-600 mb-4">
                    Learn React from fundamentals to advanced concepts like hooks and context.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <div className="flex text-amber-400">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm ml-1">4.8 (356 reviews)</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">$59.99</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Full Stack Development Course" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Full Stack Development</h3>
                  <p className="text-gray-600 mb-4">
                    Become a complete developer by mastering both frontend and backend technologies.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <div className="flex text-amber-400">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm ml-1">4.7 (289 reviews)</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">$79.99</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth/signup")}
            >
              Explore All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Connect With Fellow Developers</h3>
              <p className="text-gray-600 mb-6">
                Our thriving community brings together developers from all backgrounds and experience levels.
                Share knowledge, ask questions, collaborate on projects, and grow together.
              </p>
              <ul className="space-y-3">
                {[
                  "Participate in discussions on various tech topics",
                  "Get help with your coding problems",
                  "Contribute to open-source projects",
                  "Network with professionals in the industry"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="mt-8"
                onClick={() => navigate("/auth/signup")}
              >
                Join the Community
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold">React vs. Vue: Which is better for my project?</h4>
                  <p className="text-sm text-gray-600">Started by @james_dev • 34 replies</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold">Tips for optimizing database queries</h4>
                  <p className="text-sm text-gray-600">Started by @db_master • 17 replies</p>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="p-4">
                  <h4 className="font-semibold">How to structure large Node.js applications</h4>
                  <p className="text-sm text-gray-600">Started by @node_ninja • 28 replies</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold">Career transition: from backend to full stack</h4>
                  <p className="text-sm text-gray-600">Started by @career_switcher • 42 replies</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {/* <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="flex flex-col">
              <CardContent className="pt-6 px-6 pb-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-6">$0<span className="text-base font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">
                  Get started with basic access to our platform.
                </p>
                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    "Access to free courses",
                    "Limited coding challenges",
                    "Community forum access",
                    "Basic project templates"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/auth/signup")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col relative border-primary">
              <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                <span className="bg-primary text-white text-sm py-1 px-3 rounded-full">Most Popular</span>
              </div>
              <CardContent className="pt-6 px-6 pb-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-6">$15<span className="text-base font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">
                  Full access to all features for individual developers.
                </p>
                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    "Access to all courses",
                    "Unlimited challenges",
                    "Advanced project templates",
                    "Priority community support",
                    "Job board access",
                    "Progress tracking",
                    "Course certificates"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/auth/signup?plan=pro")}
                >
                  Choose Pro
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardContent className="pt-6 px-6 pb-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Team</h3>
                <div className="text-3xl font-bold mb-6">$49<span className="text-base font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">
                  Perfect for teams and organizations with multiple developers.
                </p>
                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    "Everything in Pro plan",
                    "Team management dashboard",
                    "Advanced analytics",
                    "Custom learning paths",
                    "Dedicated support",
                    "Team collaboration tools",
                    "Bulk license management"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/auth/signup?plan=team")}
                >
                  Choose Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are already learning, building, and growing with SHRUNYA.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate("/auth/signup")}
          >
            Get Started For Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <svg 
                  className="w-8 h-8 text-white mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" 
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-2xl font-bold">SHRUNYA</span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete platform for developers to learn, build, challenge themselves, 
                connect with others, and advance their careers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Challenges</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Projects</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Jobs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          <div className="pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} SHRUNYA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}