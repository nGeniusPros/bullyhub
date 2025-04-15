"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MessageSquare, Send, Calendar, DollarSign, Award, CheckCircle, AlertCircle } from "lucide-react";
import { StudServiceWithDog, StudReceptionistMessage, AIStudReceptionistResponse } from "../types";
import { useStudServiceQueries } from "../data/queries";
import { formatCurrency } from "@/lib/utils";

interface StudReceptionistProps {
  serviceId: string;
}

export default function StudReceptionist({ serviceId }: StudReceptionistProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [studService, setStudService] = useState<StudServiceWithDog | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<StudReceptionistMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm the AI assistant for this stud service. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [lastResponse, setLastResponse] = useState<AIStudReceptionistResponse | null>(null);
  const studServiceQueries = useStudServiceQueries();

  // Fetch stud service details
  useEffect(() => {
    const fetchStudService = async () => {
      setLoading(true);
      try {
        const data = await studServiceQueries.getStudService(serviceId);
        setStudService(data);
      } catch (error) {
        console.error("Error fetching stud service:", error);
        toast.error("Failed to load stud service details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudService();
  }, [serviceId]);

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !studService) return;

    setSending(true);

    // Add user message to conversation
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      // Call the AI stud receptionist API
      const response = await fetch("/.netlify/functions/stud-receptionist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studServiceId: serviceId,
          message: userMessage.content,
          conversationId: null, // We're not tracking conversation ID in this example
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI receptionist");
      }

      const data: AIStudReceptionistResponse = await response.json();

      // Add assistant message to conversation
      const assistantMessage = {
        role: "assistant" as const,
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, assistantMessage]);
      setLastResponse(data);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from AI receptionist");

      // Add error message to conversation
      const errorMessage = {
        role: "assistant" as const,
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestionClick = (question: string) => {
    setMessage(question);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Stud Service Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The stud service you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/stud-services")}>
          Back to Stud Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stud Receptionist</h1>
          <p className="text-muted-foreground">
            Chat with our AI assistant about {studService.stud?.name}'s stud services
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat section */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat with AI Receptionist
              </CardTitle>
              <CardDescription>
                Ask questions about {studService.stud?.name}'s stud services
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={sending}
                />
                <Button
                  type="submit"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Suggested questions */}
          {lastResponse?.suggestedQuestions && lastResponse.suggestedQuestions.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lastResponse.suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestedQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info section */}
        <div className="space-y-6">
          {/* Stud info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stud Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="/placeholder-dog.jpg"
                    alt={studService.stud?.name}
                  />
                  <AvatarFallback>
                    {studService.stud?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{studService.stud?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {studService.stud?.breed}
                  </p>
                  <Badge
                    variant={
                      studService.availability ? "default" : "secondary"
                    }
                  >
                    {studService.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span>{studService.stud?.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stud Fee:</span>
                  <span>{formatCurrency(studService.fee)}</span>
                </div>
                {studService.stud?.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span>
                      {calculateAge(studService.stud.dateOfBirth)} years
                    </span>
                  </div>
                )}
              </div>

              {studService.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {studService.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Health info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">DNA Health Panel</p>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive genetic testing
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">OFA Hip Evaluation</p>
                    <p className="text-sm text-muted-foreground">
                      Good hip structure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">BOAS Assessment</p>
                    <p className="text-sm text-muted-foreground">
                      Grade 1 - Excellent breathing
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Cardiac Evaluation</p>
                    <p className="text-sm text-muted-foreground">
                      Normal heart function
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm">
                    {studService.availability
                      ? "Currently available for breeding"
                      : "Not available at this time"}
                  </p>
                </div>
                {studService.availability ? (
                  <Button className="w-full">
                    Request Breeding Date
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-md">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">
                      This stud is currently unavailable. Please check back later.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
