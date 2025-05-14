import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SaveIcon, PlayIcon, FolderIcon, FileIcon, PlusIcon, TrashIcon } from "lucide-react";

export default function ProjectEditor() {
  const { toast } = useToast();
  const [match, params] = useRoute("/projects/:id/editor");
  const [, navigate] = useLocation();
  const projectId = params?.id;
  
  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
    staleTime: 60000
  });

  // State for code editor
  const [activeFile, setActiveFile] = useState("index.html");
  const [files, setFiles] = useState({
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project?.title || 'My Project'}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World!</h1>
  <p>Start building your project here.</p>
  
  <script src="script.js"></script>
</body>
</html>`,
    "styles.css": `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: #2563eb;
}`,
    "script.js": `// Your JavaScript code goes here
console.log('Project initialized!');

// Add your functionality below
`
  });

  // Handle file content change
  const handleCodeChange = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: content
    }));
  };

  // Create a new file
  const handleCreateFile = () => {
    const fileName = prompt("Enter file name (including extension):");
    if (!fileName) return;
    
    if (files[fileName]) {
      toast({
        title: "File already exists",
        description: `A file named '${fileName}' already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => ({
      ...prev,
      [fileName]: ""
    }));
    setActiveFile(fileName);
  };

  // Delete a file
  const handleDeleteFile = (fileName: string) => {
    if (Object.keys(files).length <= 1) {
      toast({
        title: "Cannot delete file",
        description: "You must have at least one file in your project.",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      const newFiles = { ...files };
      delete newFiles[fileName];
      setFiles(newFiles);
      
      // Set active file to the first remaining file
      if (activeFile === fileName) {
        setActiveFile(Object.keys(newFiles)[0]);
      }
    }
  };

  // Save project
  const handleSaveProject = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully."
    });
  };

  // Run project
  const handleRunProject = () => {
    // In a real app, this would compile and run the project
    const htmlContent = files["index.html"];
    const cssContent = files["styles.css"] || "";
    const jsContent = files["script.js"] || "";
    
    // Create a blob with the HTML content
    const blob = new Blob([
      htmlContent.replace(
        "</head>",
        `<style>${cssContent}</style></head>`
      ).replace(
        "</body>",
        `<script>${jsContent}</script></body>`
      )
    ], { type: "text/html" });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Open the URL in a new tab
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto md:ml-64">
          <Header />
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Project", href: `/projects/${projectId}` },
            { label: "Editor", href: `/projects/${projectId}/editor`, isCurrent: true }
          ]} />
          
          <main className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
              <Skeleton className="h-full" />
              <Skeleton className="h-full lg:col-span-3" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project?.title || "Project", href: `/projects/${projectId}` },
          { label: "Editor", href: `/projects/${projectId}/editor`, isCurrent: true }
        ]} />
        
        <main className="p-4 md:p-6">
          {/* Editor Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{project?.title || "Project"} Editor</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRunProject} className="gap-2">
                <PlayIcon className="h-4 w-4" /> Run
              </Button>
              <Button onClick={handleSaveProject} className="gap-2">
                <SaveIcon className="h-4 w-4" /> Save Project
              </Button>
            </div>
          </div>
          
          {/* Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* File Explorer */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium flex items-center gap-1">
                  <FolderIcon className="h-4 w-4 text-primary" /> Files
                </h2>
                <Button variant="ghost" size="sm" onClick={handleCreateFile}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-2">
                {Object.keys(files).map(fileName => (
                  <div 
                    key={fileName}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${activeFile === fileName ? 'bg-blue-50 text-primary' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveFile(fileName)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileIcon className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{fileName}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(fileName);
                      }}
                    >
                      <TrashIcon className="h-3 w-3 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Code Editor */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden lg:col-span-3">
              <div className="p-3 border-b border-gray-200">
                <Tabs value={activeFile}>
                  <TabsList className="bg-gray-100">
                    {Object.keys(files).map(fileName => (
                      <TabsTrigger 
                        key={fileName} 
                        value={fileName}
                        onClick={() => setActiveFile(fileName)}
                      >
                        {fileName}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="p-4 h-[calc(100%-56px)] overflow-auto">
                <textarea
                  className="w-full h-full font-mono text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={files[activeFile]}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}