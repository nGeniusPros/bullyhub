"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Users,
  MessageSquare,
  Share2,
  Eye
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your social media performance across platforms
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "14d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded ${
                dateRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Engagement"
          value="55.12k"
          trend="+12.3%"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Reach"
          value="732.93k"
          trend="+8.1%"
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Posts"
          value="15"
          trend="-2.5%"
          icon={<MessageSquare className="h-4 w-4" />}
          trendDirection="down"
        />
        <MetricCard
          title="Avg. Engagement Rate"
          value="12.54%"
          trend="+3.2%"
          icon={<Share2 className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="#0088FE" />
                <Line type="monotone" dataKey="reach" stroke="#00C49F" />
                <Line type="monotone" dataKey="clicks" stroke="#FFBB28" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center gap-4">
                  {getPlatformIcon(platform.name)}
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${platform.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">{platform.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, trendDirection = "up" }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
          <span
            className={`text-sm font-medium ${
              trendDirection === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getPlatformIcon(platform: string) {
  const icons = {
    Twitter: <Twitter className="h-4 w-4" />,
    Instagram: <Instagram className="h-4 w-4" />,
    Facebook: <Facebook className="h-4 w-4" />,
    LinkedIn: <Linkedin className="h-4 w-4" />,
  };
  return icons[platform] || <Globe className="h-4 w-4" />;
}

// Mock data
const performanceData = [
  { date: "Mon", engagement: 4000, reach: 2400, clicks: 2400 },
  { date: "Tue", engagement: 3000, reach: 1398, clicks: 2210 },
  { date: "Wed", engagement: 2000, reach: 9800, clicks: 2290 },
  { date: "Thu", engagement: 2780, reach: 3908, clicks: 2000 },
  { date: "Fri", engagement: 1890, reach: 4800, clicks: 2181 },
  { date: "Sat", engagement: 2390, reach: 3800, clicks: 2500 },
  { date: "Sun", engagement: 3490, reach: 4300, clicks: 2100 },
];

const demographicsData = [
  { name: "18-24", value: 400 },
  { name: "25-34", value: 300 },
  { name: "35-44", value: 300 },
  { name: "45+", value: 200 },
];

const platformData = [
  { name: "Instagram", percentage: 45 },
  { name: "Facebook", percentage: 30 },
  { name: "Twitter", percentage: 15 },
  { name: "LinkedIn", percentage: 10 },
];