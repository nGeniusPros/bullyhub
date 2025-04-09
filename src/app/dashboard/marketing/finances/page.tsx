"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  FileText,
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  Dog,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import { FinancialRecord } from "@/types";
import { format } from "date-fns";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

// Mock financial data
const mockFinancialRecords = [
  {
    id: "1",
    recordType: "income",
    category: "Stud Fee",
    amount: 1500,
    description: "Stud service for Max with Sarah's female",
    date: "2024-05-15",
    relatedDogId: "1",
    relatedDogName: "Champion Max",
    relatedClientId: "2",
    relatedClientName: "Sarah Johnson",
    receiptUrl: null,
  },
  {
    id: "2",
    recordType: "income",
    category: "Puppy Sale",
    amount: 3500,
    description: "Blue male puppy from Titan's litter",
    date: "2024-05-10",
    relatedDogId: "3",
    relatedDogName: "Titan",
    relatedClientId: "1",
    relatedClientName: "John Smith",
    receiptUrl: null,
  },
  {
    id: "3",
    recordType: "expense",
    category: "Veterinary",
    amount: 450,
    description: "Annual checkups and vaccinations for breeding dogs",
    date: "2024-05-08",
    relatedDogId: null,
    relatedDogName: null,
    relatedClientId: null,
    relatedClientName: null,
    receiptUrl: "receipt-123.pdf",
  },
  {
    id: "4",
    recordType: "expense",
    category: "Food",
    amount: 250,
    description: "Premium dog food for the month",
    date: "2024-05-05",
    relatedDogId: null,
    relatedDogName: null,
    relatedClientId: null,
    relatedClientName: null,
    receiptUrl: "receipt-124.pdf",
  },
  {
    id: "5",
    recordType: "income",
    category: "Stud Fee",
    amount: 2000,
    description: "Stud service for Zeus with Jessica's female",
    date: "2024-05-01",
    relatedDogId: "4",
    relatedDogName: "Zeus",
    relatedClientId: "4",
    relatedClientName: "Jessica Brown",
    receiptUrl: null,
  },
  {
    id: "6",
    recordType: "expense",
    category: "Supplies",
    amount: 180,
    description: "Whelping supplies and equipment",
    date: "2024-04-28",
    relatedDogId: null,
    relatedDogName: null,
    relatedClientId: null,
    relatedClientName: null,
    receiptUrl: "receipt-125.pdf",
  },
  {
    id: "7",
    recordType: "expense",
    category: "Marketing",
    amount: 120,
    description: "Social media advertising for stud services",
    date: "2024-04-25",
    relatedDogId: null,
    relatedDogName: null,
    relatedClientId: null,
    relatedClientName: null,
    receiptUrl: null,
  },
  {
    id: "8",
    recordType: "income",
    category: "Puppy Sale",
    amount: 3000,
    description: "Champagne female puppy from King Apollo's litter",
    date: "2024-04-20",
    relatedDogId: "2",
    relatedDogName: "King Apollo",
    relatedClientId: "5",
    relatedClientName: "David Miller",
    receiptUrl: null,
  },
];

// Calculate financial summary
const calculateFinancialSummary = (records) => {
  const totalIncome = records
    .filter((record) => record.recordType === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = records
    .filter((record) => record.recordType === "expense")
    .reduce((sum, record) => sum + record.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Calculate by category
  const incomeByCategory = records
    .filter((record) => record.recordType === "income")
    .reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {});

  const expensesByCategory = records
    .filter((record) => record.recordType === "expense")
    .reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {});

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    incomeByCategory,
    expensesByCategory,
  };
};

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { records, loading, error, fetchRecords, getFinancialSummary } =
    useFinancialRecords();
  const [relatedNames, setRelatedNames] = useState<{
    [key: string]: { dogName?: string; clientName?: string };
  }>({});
  const supabase = createBrowserSupabaseClient();

  // Fetch related dog and client names
  useEffect(() => {
    const fetchRelatedNames = async () => {
      const names: {
        [key: string]: { dogName?: string; clientName?: string };
      } = {};

      // Get unique dog and client IDs
      const dogIds = [
        ...new Set(
          records.filter((r) => r.relatedDogId).map((r) => r.relatedDogId)
        ),
      ];
      const clientIds = [
        ...new Set(
          records.filter((r) => r.relatedClientId).map((r) => r.relatedClientId)
        ),
      ];

      // Fetch dog names
      if (dogIds.length > 0) {
        const { data: dogs, error: dogsError } = await supabase
          .from("dogs")
          .select("id, name")
          .in("id", dogIds as string[]);

        if (!dogsError && dogs) {
          dogs.forEach((dog) => {
            if (!names[dog.id]) names[dog.id] = {};
            names[dog.id].dogName = dog.name;
          });
        }
      }

      // Fetch client names
      if (clientIds.length > 0) {
        const { data: clients, error: clientsError } = await supabase
          .from("clients")
          .select("id, first_name, last_name")
          .in("id", clientIds as string[]);

        if (!clientsError && clients) {
          clients.forEach((client) => {
            if (!names[client.id]) names[client.id] = {};
            names[
              client.id
            ].clientName = `${client.first_name} ${client.last_name}`;
          });
        }
      }

      setRelatedNames(names);
    };

    if (records.length > 0) {
      fetchRelatedNames();
    }
  }, [records, supabase]);

  // Filter records based on active tab and search term
  const filteredRecords = records.filter((record) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "income" && record.recordType === "income") ||
      (activeTab === "expenses" && record.recordType === "expense");

    const dogName = record.relatedDogId
      ? relatedNames[record.relatedDogId]?.dogName
      : undefined;
    const clientName = record.relatedClientId
      ? relatedNames[record.relatedClientId]?.clientName
      : undefined;

    const matchesSearch =
      searchTerm === "" ||
      (record.description &&
        record.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dogName && dogName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (clientName &&
        clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Calculate financial summary
  const financialSummary = getFinancialSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Financial Management
        </h1>
        <p className="text-muted-foreground">
          Track expenses, income, and profitability for your breeding program
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => fetchRecords()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Financial Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialSummary.totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(financialSummary.totalExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Profit
                </CardTitle>
                {financialSummary.netProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    financialSummary.netProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(financialSummary.netProfit)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Link href="/dashboard/marketing/finances/new">
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </Link>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-4 text-sm font-medium">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Category</div>
                  <div>Description</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-6 items-center p-4 text-sm border-t"
                  >
                    <div>{format(new Date(record.date), "MMM d, yyyy")}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          record.recordType === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.recordType === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div>
                      {record.category
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                    <div className="truncate" title={record.description}>
                      {record.description}
                      {(record.relatedDogId || record.relatedClientId) && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          {record.relatedDogId &&
                            relatedNames[record.relatedDogId]?.dogName && (
                              <span className="flex items-center mr-2">
                                <Dog className="h-3 w-3 mr-1" />
                                {relatedNames[record.relatedDogId].dogName}
                              </span>
                            )}
                          {record.relatedClientId &&
                            relatedNames[record.relatedClientId]
                              ?.clientName && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {
                                  relatedNames[record.relatedClientId]
                                    .clientName
                                }
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-right font-medium ${
                        record.recordType === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.recordType === "income" ? "+" : "-"}
                      {formatCurrency(record.amount)}
                    </div>
                    <div className="flex justify-end gap-2">
                      {record.receiptUrl && (
                        <a
                          href={record.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Receipt"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Receipt</span>
                          </Button>
                        </a>
                      )}
                      <Link href={`/dashboard/marketing/finances/${record.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                        >
                          <PieChart className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredRecords.length === 0 && (
                  <div className="text-center py-10">
                    <DollarSign className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      No transactions found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-4 text-sm font-medium">
                  <div>Date</div>
                  <div>Category</div>
                  <div>Description</div>
                  <div>Related To</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-6 items-center p-4 text-sm border-t"
                  >
                    <div>{record.date}</div>
                    <div>{record.category}</div>
                    <div className="truncate" title={record.description}>
                      {record.description}
                    </div>
                    <div>
                      {record.relatedDogName || record.relatedClientName || "-"}
                    </div>
                    <div className="text-right font-medium text-green-600">
                      +{formatCurrency(record.amount)}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PieChart className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredRecords.length === 0 && (
                  <div className="text-center py-10">
                    <DollarSign className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      No income records found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new income record.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-4 text-sm font-medium">
                  <div>Date</div>
                  <div>Category</div>
                  <div>Description</div>
                  <div>Receipt</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Actions</div>
                </div>
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-6 items-center p-4 text-sm border-t"
                  >
                    <div>{record.date}</div>
                    <div>{record.category}</div>
                    <div className="truncate" title={record.description}>
                      {record.description}
                    </div>
                    <div>{record.receiptUrl ? "Available" : "None"}</div>
                    <div className="text-right font-medium text-red-600">
                      -{formatCurrency(record.amount)}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PieChart className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredRecords.length === 0 && (
                  <div className="text-center py-10">
                    <DollarSign className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      No expense records found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new expense record.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="p-2">
                {/* Import the FinancialCharts component */}
                {(() => {
                  const FinancialCharts =
                    require("@/components/marketing/financial-charts").FinancialCharts;
                  return <FinancialCharts records={records} />;
                })()}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
