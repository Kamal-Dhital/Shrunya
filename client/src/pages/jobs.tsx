import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JobCard } from "@/components/dashboard/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { BriefcaseIcon, SearchIcon, FilterIcon, BuildingIcon, GlobeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Jobs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch jobs data
  const jobsQuery = useQuery({
    queryKey: ["/api/jobs"],
    staleTime: 60000
  });

  const isLoading = jobsQuery.isLoading;
  const jobs = jobsQuery.data || [];

  // Filter jobs based on search and active tab
  const filterJobs = (jobs: any[]) => {
    if (!jobs) return [];
    
    let filtered = jobs;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job => job.title.toLowerCase().includes(query) || 
               job.company.toLowerCase().includes(query) ||
               job.description.toLowerCase().includes(query) ||
               job.location.toLowerCase().includes(query) ||
               job.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab (location type)
    if (activeTab === "remote") {
      filtered = filtered.filter(job => job.location.toLowerCase().includes("remote"));
    } else if (activeTab === "onsite") {
      filtered = filtered.filter(job => !job.location.toLowerCase().includes("remote"));
    }
    
    return filtered;
  };

  const filteredJobs = filterJobs(jobs);

  // Extract all unique tags from jobs
  const getAllTags = () => {
    if (!jobs) return [];
    
    const allTags = new Set<string>();
    jobs.forEach((job: any) => {
      job.tags.forEach((tag: string) => {
        allTags.add(tag);
      });
    });
    
    return Array.from(allTags).sort();
  };

  const allTags = getAllTags();

  // Extract all unique companies
  const getCompanies = () => {
    if (!jobs) return [];
    
    const companies = new Set<string>();
    jobs.forEach((job: any) => {
      companies.add(job.company);
    });
    
    return Array.from(companies).sort();
  };

  const companies = getCompanies();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/jobs", isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <BriefcaseIcon className="mr-2 h-6 w-6 text-primary" />
              Job Opportunities
            </h1>
            <p className="text-gray-500">Find your next developer role at top companies</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Search and filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search jobs..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <FilterIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>
              
              {/* Job type tabs */}
              <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger value="all" className="px-4">All</TabsTrigger>
                  <TabsTrigger value="remote" className="px-4 flex items-center gap-1">
                    <GlobeIcon className="h-4 w-4" />
                    <span>Remote</span>
                  </TabsTrigger>
                  <TabsTrigger value="onsite" className="px-4 flex items-center gap-1">
                    <BuildingIcon className="h-4 w-4" />
                    <span>On-site</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Featured job */}
              <Card className="mb-6 bg-primary/5 border-primary">
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-primary text-white">Featured</Badge>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <img 
                      src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=64&h=64&fit=crop" 
                      alt="TechStack logo" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">Senior Full Stack Engineer</h3>
                      <p className="text-gray-700 mb-2">TechStack, Inc. • San Francisco, CA (Remote Option)</p>
                      <p className="text-gray-600 mb-3">
                        Join our team to work on cutting-edge applications using modern web technologies. 
                        We're looking for a talented full-stack developer to help us scale our platform.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-blue-100 text-primary">React</Badge>
                        <Badge className="bg-blue-100 text-primary">Node.js</Badge>
                        <Badge className="bg-blue-100 text-primary">TypeScript</Badge>
                        <Badge className="bg-blue-100 text-primary">AWS</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">$130K - $180K</span>
                        <Button onClick={() => window.location.href = `/jobs/1`}>View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Jobs list */}
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm mb-4 p-4">
                      <div className="flex items-start mb-3">
                        <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-6 w-16" />
                        ))}
                      </div>
                      <div className="flex justify-between mb-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </>
              ) : filteredJobs.length > 0 ? (
                <>
                  {filteredJobs.map((job: any) => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      description={job.description}
                      salary={job.salary}
                      logoUrl={job.logoUrl}
                      postedAt={new Date(job.postedAt)}
                      tags={job.tags}
                    />
                  ))}
                </>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <BriefcaseIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search filters to find more opportunities</p>
                  <Button onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>Clear filters</Button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Job Alert card removed as requested */}
              
              {/* Skills filter */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Filter by Skills</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {allTags.map((tag, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`mr-2 mb-2 ${searchQuery === tag ? 'bg-primary text-white' : ''}`}
                        onClick={() => setSearchQuery(tag === searchQuery ? '' : tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Companies filter */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Top Companies</h3>
                  <div className="space-y-2">
                    {companies.slice(0, 5).map((company, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => setSearchQuery(company === searchQuery ? '' : company)}
                      >
                        <div className={`w-2 h-2 rounded-full ${index % 3 === 0 ? 'bg-primary' : index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500'} mr-2`} />
                        <span className={`${searchQuery === company ? 'font-medium text-primary' : ''}`}>{company}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
