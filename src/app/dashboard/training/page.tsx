'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Award, 
  Bell, 
  Users, 
  Calendar,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    date: '',
    time: '',
    duration: '30',
    notes: '',
  });

  useEffect(() => {
    fetch('/.netlify/functions/get-training-courses')
      .then(res => res.json())
      .then(setCourses)
      .catch(console.error);

    fetch('/.netlify/functions/get-training-sessions')
      .then(res => res.json())
      .then(setSessions)
      .catch(console.error);
  }, []);

  const handleSchedule = async () => {
    if (!formData.course_id || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/create-training-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSessions(prev => [...prev, data]);
        setFormData({
          course_id: '',
          date: '',
          time: '',
          duration: '30',
          notes: '',
        });
      } else {
        alert(data.error || 'Failed to schedule session');
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error');
    }
  };

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
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.course_id}
                  onChange={e => setFormData({ ...formData, course_id: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Any specific goals or focus areas for this session?"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSchedule}>Schedule</Button>
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
            {courses.map((course) => {
              const Icon = Target; // Default icon
              return (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={course.image_url} 
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
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      Start Course
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
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{session.training_courses?.title || 'Training Session'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.date} at {session.time} ({session.duration} minutes)
                        </p>
                        {session.notes && (
                          <p className="mt-2 text-sm">{session.notes}</p>
                        )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
