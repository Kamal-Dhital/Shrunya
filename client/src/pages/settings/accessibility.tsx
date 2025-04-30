import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  EyeIcon,
  MoonIcon,
  SunIcon,
  Type,
  Minus,
  Plus,
  RotateCcw,
  TextIcon,
  MousePointerIcon,
  Palette,
  Check,
  SettingsIcon,
  ArrowLeftIcon,
} from "lucide-react";

export default function AccessibilitySettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [colorTheme, setColorTheme] = useState("system");
  
  // Apply font size scaling to the document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    return () => {
      document.documentElement.style.fontSize = "100%";
    };
  }, [fontScale]);
  
  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    return () => {
      document.documentElement.classList.remove("high-contrast");
    };
  }, [highContrast]);
  
  // Apply reduced motion
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    return () => {
      document.documentElement.classList.remove("reduce-motion");
    };
  }, [reducedMotion]);
  
  // Apply dyslexic font
  useEffect(() => {
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font");
    } else {
      document.documentElement.classList.remove("dyslexic-font");
    }
    return () => {
      document.documentElement.classList.remove("dyslexic-font");
    };
  }, [dyslexicFont]);
  
  // Apply focus indicators
  useEffect(() => {
    if (focusIndicators) {
      document.documentElement.classList.add("focus-visible");
    } else {
      document.documentElement.classList.remove("focus-visible");
    }
    return () => {
      document.documentElement.classList.remove("focus-visible");
    };
  }, [focusIndicators]);
  
  // Handle theme changes
  useEffect(() => {
    if (colorTheme === "system") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add("system");
    } else if (colorTheme === "dark") {
      document.documentElement.classList.remove("system", "light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("system", "dark");
      document.documentElement.classList.add("light");
    }
  }, [colorTheme]);
  
  // Reset all settings to default
  const resetSettings = () => {
    setFontScale(100);
    setHighContrast(false);
    setReducedMotion(false);
    setDyslexicFont(false);
    setFocusIndicators(false);
    setColorTheme("system");
    
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to their defaults.",
      variant: "default",
    });
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real application, this would save to a database or local storage
    toast({
      title: "Settings Saved",
      description: "Your accessibility preferences have been saved.",
      variant: "default",
    });
  };
  
  // Font size controls
  const increaseFontSize = () => {
    setFontScale(prev => Math.min(prev + 10, 150));
  };
  
  const decreaseFontSize = () => {
    setFontScale(prev => Math.max(prev - 10, 80));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/settings")}
                className="mr-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold flex items-center">
                <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
                Accessibility Settings
              </h1>
            </div>
            <p className="text-gray-500">Customize the platform to meet your accessibility needs</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 max-w-4xl">
            <Tabs defaultValue="visual">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="reading">Reading & Text</TabsTrigger>
                <TabsTrigger value="interaction">Interaction</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual">
                <div className="space-y-6">
                  {/* Color Theme */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="mr-2 h-5 w-5 text-primary" />
                        Color Theme
                      </CardTitle>
                      <CardDescription>
                        Choose your preferred color theme for the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <Card 
                          className={`cursor-pointer border-2 ${colorTheme === 'light' ? 'border-primary' : 'border-transparent'}`}
                          onClick={() => setColorTheme('light')}
                        >
                          <CardContent className="p-4 text-center">
                            <SunIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                            <div className="font-medium">Light</div>
                            {colorTheme === 'light' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer border-2 ${colorTheme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                          onClick={() => setColorTheme('dark')}
                        >
                          <CardContent className="p-4 text-center">
                            <MoonIcon className="h-8 w-8 mx-auto mb-2 text-blue-700" />
                            <div className="font-medium">Dark</div>
                            {colorTheme === 'dark' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer border-2 ${colorTheme === 'system' ? 'border-primary' : 'border-transparent'}`}
                          onClick={() => setColorTheme('system')}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="flex justify-center mb-2">
                              <SunIcon className="h-8 w-8 text-yellow-500" />
                              <MoonIcon className="h-8 w-8 text-blue-700 -ml-3" />
                            </div>
                            <div className="font-medium">System</div>
                            {colorTheme === 'system' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* High Contrast Mode */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <EyeIcon className="mr-2 h-5 w-5 text-primary" />
                        High Contrast Mode
                      </CardTitle>
                      <CardDescription>
                        Increases contrast between elements for better visibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="high-contrast">Enable High Contrast</Label>
                          <p className="text-sm text-gray-500">
                            This setting improves readability by increasing the contrast between text and background.
                          </p>
                        </div>
                        <Switch 
                          id="high-contrast" 
                          checked={highContrast}
                          onCheckedChange={setHighContrast}
                        />
                      </div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border ${!highContrast ? 'bg-white text-gray-800' : 'bg-black text-white border-white'}`}>
                          <h3 className="font-medium mb-2">Normal Contrast</h3>
                          <p className="text-sm">
                            This is how the platform looks with normal contrast settings.
                          </p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${!highContrast ? 'bg-gray-100 text-gray-600' : 'bg-white text-black border-black'}`}>
                          <h3 className="font-medium mb-2">High Contrast</h3>
                          <p className="text-sm">
                            This demonstrates the high contrast version of the platform.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Reduced Motion */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <svg 
                          className="mr-2 h-5 w-5 text-primary" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M11.8 4.5a7.4 7.4 0 0 0-8.1 7.3v.1M21.7 6.4a7.5 7.5 0 0 0-9.8-2v.1" />
                          <path d="M13.9 14.5a7.3 7.3 0 0 0-2.4-11h-.2M21.7 17.7a7.3 7.3 0 0 0-4.7-9.3" />
                          <path d="M11.8 19.6a7.3 7.3 0 0 0 9-5.7" />
                          <path d="M4.2 13.2a7.3 7.3 0 0 0 5.6 6.3h.2" />
                        </svg>
                        Reduced Motion
                      </CardTitle>
                      <CardDescription>
                        Minimizes animations and transitions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="reduced-motion">Reduce Motion</Label>
                          <p className="text-sm text-gray-500">
                            This setting reduces or eliminates animations and transitions throughout the platform.
                          </p>
                        </div>
                        <Switch 
                          id="reduced-motion" 
                          checked={reducedMotion}
                          onCheckedChange={setReducedMotion}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="reading">
                <div className="space-y-6">
                  {/* Font Size Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Type className="mr-2 h-5 w-5 text-primary" />
                        Font Size
                      </CardTitle>
                      <CardDescription>
                        Adjust the size of text throughout the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={decreaseFontSize}
                            disabled={fontScale <= 80}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <div className="text-center">
                            <span className="text-lg font-bold">{fontScale}%</span>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={increaseFontSize}
                            disabled={fontScale >= 150}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Slider
                          value={[fontScale]}
                          onValueChange={(values) => setFontScale(values[0])}
                          min={80}
                          max={150}
                          step={10}
                          className="w-full"
                        />
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setFontScale(80)}
                          >
                            Small
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setFontScale(100)}
                          >
                            Normal
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setFontScale(130)}
                          >
                            Large
                          </Button>
                        </div>
                        
                        <div className="mt-4 p-4 rounded-lg border bg-gray-50">
                          <h3 className="font-medium mb-2">Preview</h3>
                          <p className="mb-2">
                            This is how text will appear across the platform with your current settings.
                          </p>
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs">This is extra small text</div>
                            <div className="text-sm">This is small text</div>
                            <div className="text-base">This is normal text</div>
                            <div className="text-lg">This is large text</div>
                            <div className="text-xl">This is extra large text</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Dyslexic Font */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TextIcon className="mr-2 h-5 w-5 text-primary" />
                        Font Type
                      </CardTitle>
                      <CardDescription>
                        Choose a font that works best for you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <Label htmlFor="dyslexic-font">Dyslexia-Friendly Font</Label>
                          <p className="text-sm text-gray-500">
                            Use a font that's designed to be more readable for people with dyslexia.
                          </p>
                        </div>
                        <Switch 
                          id="dyslexic-font" 
                          checked={dyslexicFont}
                          onCheckedChange={setDyslexicFont}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border ${!dyslexicFont ? 'border-primary' : ''}`}>
                          <h3 className="font-medium mb-2">Standard Font</h3>
                          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            The quick brown fox jumps over the lazy dog. 
                            This text demonstrates how the standard font appears.
                          </p>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${dyslexicFont ? 'border-primary' : ''}`}>
                          <h3 className="font-medium mb-2">Dyslexia-Friendly Font</h3>
                          <p className="text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            The quick brown fox jumps over the lazy dog. 
                            This text demonstrates how the dyslexia-friendly font appears.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="interaction">
                <div className="space-y-6">
                  {/* Focus Indicators */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MousePointerIcon className="mr-2 h-5 w-5 text-primary" />
                        Focus Indicators
                      </CardTitle>
                      <CardDescription>
                        Enhanced visual feedback when navigating with keyboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
                          <p className="text-sm text-gray-500">
                            Makes focus outlines more visible when navigating with keyboard.
                          </p>
                        </div>
                        <Switch 
                          id="focus-indicators" 
                          checked={focusIndicators}
                          onCheckedChange={setFocusIndicators}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border ${!focusIndicators ? 'border-primary' : ''}`}>
                          <h3 className="font-medium mb-2">Standard Focus</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="focus:shadow-sm focus:ring-1 focus:ring-primary">
                              Button Example
                            </Button>
                            <input 
                              type="text" 
                              placeholder="Input Example" 
                              className="w-full px-3 py-2 border rounded-md focus:shadow-sm focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${focusIndicators ? 'border-primary' : ''}`}>
                          <h3 className="font-medium mb-2">Enhanced Focus</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="focus:shadow-lg focus:ring-4 focus:ring-primary/50">
                              Button Example
                            </Button>
                            <input 
                              type="text" 
                              placeholder="Input Example" 
                              className="w-full px-3 py-2 border rounded-md focus:shadow-lg focus:ring-4 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            <div className="flex justify-between items-center p-4">
              <Button
                variant="outline"
                onClick={resetSettings}
                className="flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/settings")}
                >
                  Cancel
                </Button>
                <Button onClick={saveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}