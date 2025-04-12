"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { FinancialRecord } from "@/types";
import { format, subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

// Define chart colors
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FF6B6B", "#6A7FDB", "#61DAFB", "#F28482"
];

interface FinancialChartsProps {
  records: FinancialRecord[];
}

export function FinancialCharts({ records }: FinancialChartsProps) {
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "1y" | "all">("all");

  // Filter records based on time range
  const getFilteredRecords = () => {
    if (timeRange === "all") return records;

    const now = new Date();
    const monthsToSubtract = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12;
    const startDate = subMonths(now, monthsToSubtract);

    return records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate;
    });
  };

  const filteredRecords = getFilteredRecords();

  // Prepare data for expense categories pie chart
  const prepareExpenseCategoryData = () => {
    const expenseRecords = filteredRecords.filter(record => record.recordType === "expense");
    const categoryTotals: Record<string, number> = {};

    expenseRecords.forEach(record => {
      const category = record.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + record.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: amount,
      rawCategory: category
    }));
  };

  // Prepare data for income sources pie chart
  const prepareIncomeCategoryData = () => {
    const incomeRecords = filteredRecords.filter(record => record.recordType === "income");
    const categoryTotals: Record<string, number> = {};

    incomeRecords.forEach(record => {
      const category = record.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + record.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: amount,
      rawCategory: category
    }));
  };

  // Prepare data for monthly income/expense bar chart
  const prepareMonthlyData = () => {
    // Determine the date range
    let startDate: Date;
    const now = new Date();

    if (timeRange === "3m") startDate = subMonths(now, 3);
    else if (timeRange === "6m") startDate = subMonths(now, 6);
    else if (timeRange === "1y") startDate = subMonths(now, 12);
    else {
      // For "all", find the earliest record date
      const dates = records.map(record => new Date(record.date));
      startDate = new Date(Math.min(...dates.map(date => date.getTime())));
    }

    // Create an array of months between startDate and now
    const months: Date[] = [];
    let currentDate = startOfMonth(startDate);
    const lastMonth = startOfMonth(now);

    while (currentDate <= lastMonth) {
      months.push(new Date(currentDate));
      currentDate = startOfMonth(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    }

    // Calculate income and expense for each month
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.date);
        return isWithinInterval(recordDate, { start: monthStart, end: monthEnd });
      });

      const income = monthRecords
        .filter(record => record.recordType === "income")
        .reduce((sum, record) => sum + record.amount, 0);

      const expense = monthRecords
        .filter(record => record.recordType === "expense")
        .reduce((sum, record) => sum + record.amount, 0);

      const profit = income - expense;

      return {
        name: format(month, "MMM yyyy"),
        income,
        expense,
        profit
      };
    });
  };

  const expenseCategoryData = prepareExpenseCategoryData();
  const incomeCategoryData = prepareIncomeCategoryData();
  const monthlyData = prepareMonthlyData();

  // Calculate totals
  const totalIncome = filteredRecords
    .filter(record => record.recordType === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = filteredRecords
    .filter(record => record.recordType === "expense")
    .reduce((sum, record) => sum + record.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / (payload[0].payload.rawCategory.includes('expense') ? totalExpenses : totalIncome)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Analysis</h2>
        <div>
          <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
              <TabsTrigger value="6m">6 Months</TabsTrigger>
              <TabsTrigger value="3m">3 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income/Expense Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Income & Expenses</CardTitle>
            <CardDescription>
              Track your financial performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${formatCurrency(value)}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#4ade80" />
                  <Bar dataKey="expense" name="Expenses" fill="#f87171" />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Breakdown of your expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Income Sources Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>
              Breakdown of your income by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
