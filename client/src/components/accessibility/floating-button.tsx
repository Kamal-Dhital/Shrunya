import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AccessibilityIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export function FloatingAccessibilityButton() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Accessibility settings
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontScale(settings.fontScale || 100);
      setHighContrast(settings.highContrast || false);
      setReducedMotion(settings.reducedMotion || false);
      setDyslexicFont(settings.dyslexicFont || false);
    }
  }, []);
  
  // Apply settings when they change
  useEffect(() => {
    // Apply font size scaling
    document.documentElement.style.fontSize = `${fontScale}%`;
    
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    
    // Apply dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font");
    } else {
      document.documentElement.classList.remove("dyslexic-font");
    }
    
    // Save settings to localStorage
    const settings = {
      fontScale,
      highContrast,
      reducedMotion,
      dyslexicFont
    };
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
  }, [fontScale, highContrast, reducedMotion, dyslexicFont]);
  
  const saveSettings = () => {
    setIsOpen(false);
    toast({
      title: "Settings Applied",
      description: "Your accessibility preferences have been applied.",
    });
  };
  
  const goToFullSettings = () => {
    navigate("/settings/accessibility");
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
          aria-label="Accessibility Settings"
        >
          <AccessibilityIcon className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Accessibility Options</h3>
            <Button variant="ghost" size="sm" onClick={goToFullSettings}>
              More options
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Font Size: {fontScale}%</Label>
              </div>
              <Slider
                id="font-size"
                min={80}
                max={150}
                step={10}
                value={[fontScale]}
                onValueChange={(value) => setFontScale(value[0])}
              />
            </div>
            
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
            
            {/* Dyslexic Font */}
            <div className="flex items-center justify-between">
              <Label htmlFor="dyslexic-font">Dyslexic-friendly Font</Label>
              <Switch
                id="dyslexic-font"
                checked={dyslexicFont}
                onCheckedChange={setDyslexicFont}
              />
            </div>
          </div>
          
          <Button className="w-full" onClick={saveSettings}>
            Apply Settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}