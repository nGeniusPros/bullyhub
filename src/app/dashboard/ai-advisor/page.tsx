"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Star,
  Clock,
  MessageSquare,
  Bookmark,
  Plus,
  Calendar,
  Send,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
  followUpQuestions?: string[];
  suggestedReminders?: Array<{
    title: string;
    description: string;
    category: string;
    priority: string;
  }>;
}

interface HealthReminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: "vaccination" | "checkup" | "medication" | "other";
  priority: "high" | "medium" | "low";
  completed: boolean;
  notifyBefore: number;
}

export default function AiAdvisorPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [savedMessages, setSavedMessages] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedAdvice, setSavedAdvice] = useState<
    Array<{ id: string; message: string; response: string }>
  >([]);
  const [healthReminders, setHealthReminders] = useState<HealthReminder[]>([]);
  const [filterCategory, setFilterCategory] = useState<
    HealthReminder["category"] | "all"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    HealthReminder["priority"] | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [userId, setUserId] = useState<string | null>(null);

  const suggestedQuestions = [
    "What are common health issues in Bulldogs?",
    "How often should I clean my Bulldog's wrinkles?",
    "What's the best diet for a Bulldog puppy?",
    "How to prevent overheating in Bulldogs?",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: reminders } = await supabase
        .from("health_reminders")
        .select("*")
        .eq("user_id", user.id);

      if (reminders) {
        setHealthReminders(
          reminders.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            dueDate: r.due_date ? new Date(r.due_date) : new Date(),
            category: r.category,
            priority: r.priority,
            completed: r.completed,
            notifyBefore: r.notify_before,
          }))
        );
      }

      const { data: advice } = await supabase
        .from("saved_advice")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (advice) {
        setSavedAdvice(
          advice.map((a) => ({
            id: a.id,
            message: a.message,
            response: a.response,
          }))
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAddReminder = async (reminder: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    if (!userId) return;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const { data, error } = await supabase.from("health_reminders").insert([
      {
        user_id: userId,
        title: reminder.title,
        description: reminder.description,
        category: reminder.category,
        priority: reminder.priority,
        due_date: dueDate.toISOString(),
        notify_before: 2,
        completed: false,
      },
    ]).select().single();

    if (!error && data) {
      setHealthReminders((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          description: data.description,
          dueDate: new Date(data.due_date),
          category: data.category,
          priority: data.priority,
          completed: data.completed,
          notifyBefore: data.notify_before,
        },
      ]);
    }
  };

  const handleToggleReminder = async (id: string) => {
    const reminder = healthReminders.find((r) => r.id === id);
    if (!reminder || !userId) return;

    const { error } = await supabase
      .from("health_reminders")
      .update({ completed: !reminder.completed })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      setHealthReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, completed: !r.completed } : r
        )
      );
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!userId) return;
    const confirmed = window.confirm("Are you sure you want to delete this reminder?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("health_reminders")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      setHealthReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSaveAdvice = async (message: string, response: string) => {
    if (!userId) return;

    const { data, error } = await supabase.from("saved_advice").insert([
      {
        user_id: userId,
        message,
        response,
      },
    ]).select().single();

    if (!error && data) {
      setSavedAdvice((prev) => [
        { id: data.id, message: data.message, response: data.response },
        ...prev,
      ]);
    }
  };

  const handleSave = (index: number) => {
    if (
      index > 0 &&
      messages[index].role === "assistant" &&
      messages[index - 1].role === "user"
    ) {
      handleSaveAdvice(messages[index - 1].content, messages[index].content);
      setSavedMessages((prev) => new Set([...prev, index]));
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const conversationHistory = messages.slice(-4);

      const response = await fetch("/.netlify/functions/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          followUpQuestions: data.followUpQuestions,
          suggestedReminders: data.healthReminders,
        },
      ]);
    } catch (error) {
      console.error("Failed to get response from AI advisor", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedReminders = healthReminders
    .filter((reminder) => {
      if (filterCategory !== "all" && reminder.category !== filterCategory)
        return false;
      if (filterPriority !== "all" && reminder.priority !== filterPriority)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

  const getCategoryIcon = (category: HealthReminder["category"]) => {
    switch (category) {
      case "vaccination":
        return "💉";
      case "checkup":
        return "🏥";
      case "medication":
        return "💊";
      default:
        return "📋";
    }
  };

  const getPriorityColor = (priority: HealthReminder["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100";
      case "medium":
        return "text-amber-500 bg-amber-100";
      case "low":
        return "text-blue-500 bg-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Bulldog Advisor
          </h1>
          <p className="text-muted-foreground">
            Your friendly companion for all things Bulldog
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Ask Me Anything</CardTitle>
              <CardDescription>
                Get expert advice on Bulldog care, health, training, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                  Suggested Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.role === "assistant" ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {message.role === "assistant"
                              ? "AI Advisor"
                              : "You"}
                          </span>
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleSave(index)}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  savedMessages.has(index)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : ""
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                        <div className="mt-1 text-sm">{message.content}</div>

                        {message.role === "assistant" &&
                          message.followUpQuestions &&
                          message.followUpQuestions.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium mb-2">
                                Follow-up Questions:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.followUpQuestions.map(
                                  (question, qIndex) => (
                                    <Button
                                      key={qIndex}
                                      variant="secondary"
                                      size="sm"
                                      className="h-auto py-1 text-xs"
                                      onClick={() =>
                                        handleSendMessage(question)
                                      }
                                    >
                                      {question}
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {message.role === "assistant" &&
                          message.suggestedReminders &&
                          message.suggestedReminders.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs font-medium mb-2">
                                Suggested Health Reminders:
                              </p>
                              <div className="space-y-2">
                                {message.suggestedReminders.map(
                                  (reminder, rIndex) => (
                                    <div
                                      key={rIndex}
                                      className="flex items-center justify-between bg-background/80 p-2 rounded-md text-xs"
                                    >
                                      <div>
                                        <p className="font-medium">
                                          {reminder.title}
                                        </p>
                                        <p className="text-muted-foreground text-xs line-clamp-1">
                                          {reminder.description}
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 w-7 p-0"
                                        onClick={() =>
                                          handleAddReminder(reminder)
                                        }
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted max-w-[80%] rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex space-x-2">
                            <div
                              className="h-2 w-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="h-2 w-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="h-2 w-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t p-4 flex gap-2">
                  <Input
                    placeholder="Ask anything about Bulldogs..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              {savedAdvice.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No chat history yet.
                </p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {savedAdvice.map((item) => (
                    <div key={item.id} className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {item.response}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedAdvice.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No saved advice yet. Star important messages in the chat to
                    save them here.
                  </p>
                ) : (
                  savedAdvice.map((item) => (
                    <div key={item.id} className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {item.response}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Health Reminders
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Select
                  value={filterCategory}
                  onValueChange={(value) => setFilterCategory(value as any)}
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterPriority}
                  onValueChange={(value) => setFilterPriority(value as any)}
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredAndSortedReminders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reminders found
                  </p>
                ) : (
                  filteredAndSortedReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-md border ${
                        reminder.completed ? "bg-muted/50" : "bg-background"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2">
                          <div className="mt-0.5">
                            <Checkbox
                              checked={reminder.completed}
                              onCheckedChange={() =>
                                handleToggleReminder(reminder.id)
                              }
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="mr-1">
                                {getCategoryIcon(reminder.category)}
                              </span>
                              <p
                                className={`text-sm font-medium ${
                                  reminder.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {reminder.title}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {reminder.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                                  reminder.priority
                                )}`}
                              >
                                {reminder.priority}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Due: {reminder.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
