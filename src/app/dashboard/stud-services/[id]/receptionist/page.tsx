"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  User,
  Calendar,
  DollarSign,
  Shield,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { AIStudReceptionistResponse, StudReceptionistMessage } from "@/types";

export default function StudReceptionistPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [studService, setStudService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<StudReceptionistMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the AI assistant for this stud service. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [lastResponse, setLastResponse] =
    useState<AIStudReceptionistResponse | null>(null);

  // Fetch stud service details
  useEffect(() => {
    const fetchStudService = async () => {
      try {
        // Fetch the stud service from the database
        const response = await fetch(`/api/stud-services/${params.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Format the data for our component
        setStudService({
          id: data.id,
          studId: data.stud.id,
          dogName: data.stud.name,
          breed: data.stud.breed,
          color: data.stud.color,
          fee: data.fee,
          description: data.description,
          availability: data.availability,
          owner: {
            firstName: data.stud.profiles.first_name,
            lastName: data.stud.profiles.last_name,
            email: data.stud.profiles.email || "contact@bullyhub.com",
          },
        });
      } catch (error) {
        console.error("Error fetching stud service:", error);
        // Show error message to user
      } finally {
        setLoading(false);
      }
    };

    fetchStudService();
  }, [params.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setSending(true);

    try {
      // Call the AI stud receptionist API
      const response = await fetch("/api/stud-services/receptionist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studServiceId: params.id,
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

      // Add error message to conversation
      const errorMessage = {
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stud Receptionist
          </h1>
          <p className="text-muted-foreground">
            Chat with our AI assistant about {studService?.dogName}'s stud
            services
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Stud Service
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
                Ask questions about {studService?.dogName}'s stud services
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
                      className={`flex items-start gap-3 max-w-[80%] ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar
                        className={
                          msg.role === "user" ? "bg-primary" : "bg-muted"
                        }
                      >
                        {msg.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                        <AvatarFallback>
                          {msg.role === "user" ? "U" : "AI"}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className="mt-1 text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="pt-3">
              <form
                className="flex w-full items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" disabled={sending || !message.trim()}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
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
                    src="/avatars/avatar style 2/avatar-2.png"
                    alt={studService?.dogName}
                  />
                  <AvatarFallback>
                    {studService?.dogName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{studService?.dogName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {studService?.breed}
                  </p>
                  <Badge
                    variant={
                      studService?.availability ? "default" : "secondary"
                    }
                  >
                    {studService?.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {studService?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">${studService?.fee}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Health Tested</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested questions */}
          {lastResponse?.suggestedQuestions &&
            lastResponse.suggestedQuestions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Suggested Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lastResponse.suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{question}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Additional info tabs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="availability">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                </TabsList>

                <TabsContent value="availability" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        variant={
                          studService?.availability ? "default" : "secondary"
                        }
                      >
                        {studService?.availability
                          ? "Available"
                          : "Unavailable"}
                      </Badge>
                    </div>

                    {lastResponse?.availabilityInfo && (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Next Available:</span>{" "}
                          {lastResponse.availabilityInfo.nextAvailableDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lastResponse.availabilityInfo.bookingInstructions}
                        </p>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Stud Fee:</span> $
                      {studService?.fee}
                    </p>

                    {lastResponse?.pricing?.additionalFees &&
                      lastResponse.pricing.additionalFees.length > 0 && (
                        <>
                          <p className="text-sm font-medium">
                            Additional Fees:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {lastResponse.pricing.additionalFees.map(
                              (fee, index) => (
                                <li key={index}>
                                  {fee.description}: ${fee.amount}
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )}
                  </div>
                </TabsContent>

                <TabsContent value="health" className="pt-4">
                  <div className="space-y-2">
                    {lastResponse?.healthInfo && (
                      <>
                        <p className="text-sm font-medium">Health Tests:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {lastResponse.healthInfo.healthTests.map(
                            (test, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>{test}</span>
                              </li>
                            )
                          )}
                        </ul>

                        <p className="text-sm font-medium mt-4">
                          Health Clearances:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {lastResponse.healthInfo.clearances.map(
                            (clearance, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>{clearance}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
