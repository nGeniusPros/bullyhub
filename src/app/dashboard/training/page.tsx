'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  Bell, 
  Users, 
  Play, 
  CheckCircle, 
  Clock, 
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock training courses
const trainingCourses = [
  {
    id: '1',
    title: 'Basic Obedience',
    description: 'Master essential commands like sit, stay, and come with techniques tailored for Bulldogs.',
    level: 'Beginner',
    duration: '4 weeks',
    lessons: 8,
    progress: 25,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300&h=200',
    icon: Target
  },
  {
    id: '2',
    title: 'Socialization Skills',
    description: 'Help your Bulldog become comfortable with other dogs, people, and various environments.',
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 12,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300&h=200',
    icon: Users
  },
  {
    id: '3',
    title: 'Advanced Commands',
    description: 'Build on basic training with more complex commands and behaviors.',
    level: 'Advanced',
    duration: '8 weeks',
    lessons: 16,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1583337426008-2fef51aa2e8a?auto=format&fit=crop&q=80&w=300&h=200',
    icon: Award
  }
];

// Mock training tips
const trainingTips = [
  {
    title: "Basic Commands",
    description: "Bulldogs can be stubborn, so keep training sessions short (5-10 minutes) and consistent. Use high-value treats and positive reinforcement. Start with basic commands like 'sit', 'stay', and 'come'.",
    icon: Target,
  },
  {
    title: "Positive Reinforcement",
    description: "Bulldogs respond best to positive reinforcement. Use treats, praise, and affection to reward good behavior. Avoid harsh corrections which can damage your relationship with your Bulldog.",
    icon: Award,
  },
  {
    title: "House Training",
    description: "Establish a consistent routine for potty breaks. Take your Bulldog out first thing in the morning, after meals, after naps, and before bedtime. Reward successful outdoor elimination immediately.",
    icon: Bell,
  },
  {
    title: "Socialization",
    description: "Expose your Bulldog to different people, animals, environments, and situations from an early age. This helps prevent fear and aggression issues. Be mindful of overexertion, especially in hot weather.",
    icon: Users,
  },
];

// Mock upcoming training sessions
const upcomingSessions = [
  {
    id: '1',
    title: 'Basic Obedience: Lesson 3',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '10:00 AM',
    duration: '30 minutes',
    course: 'Basic Obedience',
    topics: ['Leash training', 'Walking without pulling', 'Heel command']
  },
  {
    id: '2',
    title: 'Group Training Session',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: '11:00 AM',
    duration: '45 minutes',
    course: 'Socialization Skills',
    topics: ['Meeting other dogs', 'Controlled greetings', 'Play behavior']
  }
];

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training</h1>
          <p className="text-muted-foreground">
            Effective training methods tailored for Bulldogs
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Training Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Select a course</option>
                  {trainingCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input type="date" className="w-full p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input type="time" className="w-full p-2 border rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea className="w-full p-2 border rounded-md h-20" placeholder="Any specific goals or focus areas for this session?"></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="courses" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tips">Training Tips</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingCourses.map((course) => {
              const Icon = course.icon;
              return (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lessons</p>
                        <p className="font-medium">{course.lessons}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                      {course.progress > 0 ? "Continue Course" : "Start Course"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Bulldog-Specific Training Considerations</CardTitle>
              <CardDescription>
                Important factors to keep in mind when training Bulldogs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Temperature Sensitivity</h3>
                <p className="text-sm text-muted-foreground">
                  Bulldogs are prone to overheating. Keep training sessions short and avoid training during hot weather. 
                  Watch for signs of heat stress like excessive panting or drooling.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Respiratory Challenges</h3>
                <p className="text-sm text-muted-foreground">
                  Due to their brachycephalic (flat-faced) structure, Bulldogs may have breathing difficulties. 
                  Allow for frequent breaks during training and don't push them too hard physically.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Stubbornness</h3>
                <p className="text-sm text-muted-foreground">
                  Bulldogs can be stubborn and independent-minded. Use positive reinforcement, be consistent, 
                  and keep sessions engaging. Avoid repetitive drills that might bore them.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Food Motivation</h3>
                <p className="text-sm text-muted-foreground">
                  Most Bulldogs are highly food-motivated, which can be leveraged for training. However, be mindful 
                  of their tendency toward obesity and use low-calorie treats or portion control.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Training Sessions</CardTitle>
              <CardDescription>
                Your scheduled training activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.date.toLocaleDateString()} at {session.time} ({session.duration})
                        </p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">Topics:</p>
                          <ul className="text-xs list-disc list-inside">
                            {session.topics.map((topic, index) => (
                              <li key={index}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>
                Track your training journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-primary" />
                      Basic Obedience
                    </span>
                    <span>2/8 lessons completed</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      Socialization Skills
                    </span>
                    <span>0/12 lessons completed</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      Advanced Commands
                    </span>
                    <span>0/16 lessons completed</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
