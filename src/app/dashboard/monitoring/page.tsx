"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  AlertCircle,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define types for monitoring data
interface FunctionMetrics {
  name: string;
  metrics: {
    invocations: number;
    averageExecutionTime: number;
    errors: number;
    p95ExecutionTime: number;
    lastInvoked: string;
  };
}

interface MonitoringSummary {
  totalInvocations: number;
  averageExecutionTime: number;
  totalErrors: number;
  errorRate: number;
  slowestFunction: string;
  mostErrorProneFunction: string;
}

interface MonitoringAlert {
  type: "error" | "performance";
  function: string;
  message: string;
  timestamp: string;
}

interface MonitoringData {
  functions: FunctionMetrics[];
  summary: MonitoringSummary;
  alerts: MonitoringAlert[];
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monitoring-dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch monitoring data");
      }
      const data = await response.json();
      setData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError("Error fetching monitoring data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const executionTimeChartData = data?.functions.map((func) => ({
    name: func.name,
    average: func.metrics.averageExecutionTime,
    p95: func.metrics.p95ExecutionTime,
  }));

  const invocationsChartData = data?.functions.map((func) => ({
    name: func.name,
    invocations: func.metrics.invocations,
    errors: func.metrics.errors,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Netlify Functions Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor the performance and health of your serverless functions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated || "Never"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMonitoringData}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !data ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Invocations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.summary.totalInvocations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all functions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Execution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.summary.averageExecutionTime}ms
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all functions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Error Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.summary.errorRate.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.summary.totalErrors} total errors
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Slowest Function
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.summary.slowestFunction}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.functions.find(
                    (f) => f.name === data?.summary.slowestFunction
                  )?.metrics.p95ExecutionTime}ms (p95)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {data?.alerts && data.alerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Alerts</h2>
              <div className="space-y-2">
                {data.alerts.map((alert, index) => (
                  <Alert
                    key={index}
                    variant={alert.type === "error" ? "destructive" : "default"}
                  >
                    {alert.type === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {alert.type === "error" ? "Error Alert" : "Performance Alert"} - {alert.function}
                    </AlertTitle>
                    <AlertDescription className="flex justify-between">
                      <span>{alert.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <Tabs defaultValue="execution-time">
            <TabsList>
              <TabsTrigger value="execution-time">Execution Time</TabsTrigger>
              <TabsTrigger value="invocations">Invocations & Errors</TabsTrigger>
            </TabsList>
            <TabsContent value="execution-time" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Function Execution Time</CardTitle>
                  <CardDescription>
                    Average and p95 execution time in milliseconds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={executionTimeChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 70,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="average"
                          name="Average"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="p95"
                          name="p95"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="invocations" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Function Invocations & Errors</CardTitle>
                  <CardDescription>
                    Total invocations and errors per function
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={invocationsChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 70,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="invocations"
                          name="Invocations"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="errors"
                          name="Errors"
                          fill="#ff8042"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Function Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Function Details</CardTitle>
              <CardDescription>
                Detailed metrics for all Netlify functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Function</TableHead>
                    <TableHead>Invocations</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>p95 Time</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Last Invoked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.functions.map((func) => {
                    const errorRate =
                      (func.metrics.errors / func.metrics.invocations) * 100;
                    let status = "healthy";
                    if (errorRate > 5) {
                      status = "critical";
                    } else if (errorRate > 1) {
                      status = "warning";
                    }
                    if (func.metrics.p95ExecutionTime > 300) {
                      status = status === "critical" ? "critical" : "warning";
                    }

                    return (
                      <TableRow key={func.name}>
                        <TableCell className="font-medium">
                          {func.name}
                        </TableCell>
                        <TableCell>{func.metrics.invocations}</TableCell>
                        <TableCell>{func.metrics.averageExecutionTime}ms</TableCell>
                        <TableCell>{func.metrics.p95ExecutionTime}ms</TableCell>
                        <TableCell>{func.metrics.errors}</TableCell>
                        <TableCell>{errorRate.toFixed(2)}%</TableCell>
                        <TableCell>
                          {new Date(func.metrics.lastInvoked).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "critical"
                                ? "destructive"
                                : status === "warning"
                                ? "outline"
                                : "default"
                            }
                          >
                            {status === "critical" ? (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            ) : status === "warning" ? (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {status === "critical"
                              ? "Critical"
                              : status === "warning"
                              ? "Warning"
                              : "Healthy"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
