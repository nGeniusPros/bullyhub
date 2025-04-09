"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEducationalContent } from "@/hooks/useEducationalContent";
import { AIContentPrompt, EducationalContent } from "@/types";
import { Loader2, Sparkles, FileText, Video, Image as ImageIcon, BarChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/marketing/rich-text-editor";

export default function NewEducationalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { templates, createContent, generateContentWithAI, loading } = useEducationalContent();
  
  const [activeTab, setActiveTab] = useState("manual");
  const [contentType, setContentType] = useState<"article" | "video" | "graphic" | "infographic">("article");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState<"pet_owners" | "breeders" | "veterinarians" | "general">("pet_owners");
  const [tags, setTags] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState<AIContentPrompt>({
    topic: "",
    targetAudience: "pet_owners",
    contentType: "article",
    tone: "informative",
    keyPoints: [],
    wordCount: 500,
    includeReferences: true,
    additionalInstructions: "",
  });
  
  // Handle AI content generation
  const handleGenerateContent = async () => {
    if (!aiPrompt.topic) {
      toast({
        title: "Error",
        description: "Please enter a topic for your content",
        variant: "destructive",
      });
      return;
    }
    
    const generatedContent = await generateContentWithAI(aiPrompt);
    
    if (generatedContent) {
      setTitle(generatedContent.title);
      setContent(generatedContent.content);
      setActiveTab("manual"); // Switch to manual tab to edit the generated content
    }
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle content creation
  const handleCreateContent = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newContent: Partial<EducationalContent> = {
        breederId: user?.id,
        contentType,
        templateId: selectedTemplateId || undefined,
        title,
        description,
        content,
        targetAudience,
        tags,
        topics,
        aiGenerated: activeTab === "ai",
        aiPrompt: activeTab === "ai" ? JSON.stringify(aiPrompt) : undefined,
        status: "draft",
      };
      
      const createdContent = await createContent(newContent);
      
      if (createdContent) {
        toast({
          title: "Success",
          description: "Content created successfully",
        });
        router.push(`/dashboard/marketing/education/${createdContent.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Educational Content</h1>
        <p className="text-muted-foreground">
          Create educational content for your clients and audience
        </p>
      </div>
      
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">Manual Creation</TabsTrigger>
          <TabsTrigger value="ai">AI Assistance</TabsTrigger>
          <TabsTrigger value="template">Use Template</TabsTrigger>
        </TabsList>
        
        {/* Manual Content Creation */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Enter the details for your educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value) => setContentType(value as any)}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="graphic">Graphic</SelectItem>
                    <SelectItem value="infographic">Infographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your content"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Select
                  value={targetAudience}
                  onValueChange={(value) => setTargetAudience(value as any)}
                >
                  <SelectTrigger id="target-audience">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet_owners">Pet Owners</SelectItem>
                    <SelectItem value="breeders">Breeders</SelectItem>
                    <SelectItem value="veterinarians">Veterinarians</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (e.g., nutrition, training)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-editor">Content</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your content here..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleCreateContent} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Content"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* AI Content Generation */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Let AI help you create educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-topic">Topic</Label>
                <Input
                  id="ai-topic"
                  placeholder="Enter the main topic (e.g., Nutrition for Bully Breeds)"
                  value={aiPrompt.topic}
                  onChange={(e) => setAiPrompt({...aiPrompt, topic: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-content-type">Content Type</Label>
                <Select
                  value={aiPrompt.contentType}
                  onValueChange={(value) => setAiPrompt({...aiPrompt, contentType: value as any})}
                >
                  <SelectTrigger id="ai-content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video Script</SelectItem>
                    <SelectItem value="graphic">Graphic Content</SelectItem>
                    <SelectItem value="infographic">Infographic Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-target-audience">Target Audience</Label>
                <Select
                  value={aiPrompt.targetAudience}
                  onValueChange={(value) => setAiPrompt({...aiPrompt, targetAudience: value as any})}
                >
                  <SelectTrigger id="ai-target-audience">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet_owners">Pet Owners</SelectItem>
                    <SelectItem value="breeders">Breeders</SelectItem>
                    <SelectItem value="veterinarians">Veterinarians</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-tone">Tone</Label>
                <Select
                  value={aiPrompt.tone}
                  onValueChange={(value) => setAiPrompt({...aiPrompt, tone: value as any})}
                >
                  <SelectTrigger id="ai-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-word-count">Word Count</Label>
                <Input
                  id="ai-word-count"
                  type="number"
                  placeholder="500"
                  value={aiPrompt.wordCount}
                  onChange={(e) => setAiPrompt({...aiPrompt, wordCount: parseInt(e.target.value) || 500})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-key-points">Key Points</Label>
                <Textarea
                  id="ai-key-points"
                  placeholder="Enter key points to include, one per line"
                  value={aiPrompt.keyPoints?.join('\n') || ''}
                  onChange={(e) => setAiPrompt({
                    ...aiPrompt, 
                    keyPoints: e.target.value.split('\n').filter(line => line.trim() !== '')
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-additional">Additional Instructions</Label>
                <Textarea
                  id="ai-additional"
                  placeholder="Any specific points you want to include..."
                  value={aiPrompt.additionalInstructions}
                  onChange={(e) => setAiPrompt({...aiPrompt, additionalInstructions: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleGenerateContent} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Template-based Content */}
        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Use Content Template</CardTitle>
              <CardDescription>
                Select a template to quickly create structured content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={setSelectedTemplateId}
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplateId && (
                <div className="p-4 border rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Template Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {templates.find(t => t.id === selectedTemplateId)?.description}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="template-title">Title</Label>
                <Input
                  id="template-title"
                  placeholder="Enter a title for your content"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Enter a brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-target-audience">Target Audience</Label>
                <Select
                  value={targetAudience}
                  onValueChange={(value) => setTargetAudience(value as any)}
                >
                  <SelectTrigger id="template-target-audience">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet_owners">Pet Owners</SelectItem>
                    <SelectItem value="breeders">Breeders</SelectItem>
                    <SelectItem value="veterinarians">Veterinarians</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="template-tags"
                    placeholder="Add tags (e.g., nutrition, training)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleCreateContent} disabled={loading || !selectedTemplateId}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Use Template"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
