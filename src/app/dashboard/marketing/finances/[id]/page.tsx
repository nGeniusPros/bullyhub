"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Trash,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  Dog,
  User,
} from "lucide-react";
import { useFinancialRecords } from "@/hooks/useFinancialRecords";
import { FinancialRecord } from "@/types";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { FinancialRecordForm } from "@/components/marketing/financial-record-form";

export default function FinancialRecordDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { records, deleteRecord, loading, error } = useFinancialRecords();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [relatedInfo, setRelatedInfo] = useState<{
    dogName?: string;
    clientName?: string;
  }>({});
  const supabase = createBrowserSupabaseClient();

  // Find the record in the loaded records
  useEffect(() => {
    if (records.length > 0) {
      const foundRecord = records.find((r) => r.id === params.id);
      if (foundRecord) {
        setRecord(foundRecord);
      }
    }
  }, [records, params.id]);

  // Fetch related dog and client names
  useEffect(() => {
    const fetchRelatedInfo = async () => {
      if (!record) return;
      
      const info: { dogName?: string; clientName?: string } = {};
      
      // Fetch dog name
      if (record.relatedDogId) {
        const { data: dog, error: dogError } = await supabase
          .from("dogs")
          .select("name")
          .eq("id", record.relatedDogId)
          .single();
          
        if (!dogError && dog) {
          info.dogName = dog.name;
        }
      }
      
      // Fetch client name
      if (record.relatedClientId) {
        const { data: client, error: clientError } = await supabase
          .from("clients")
          .select("first_name, last_name")
          .eq("id", record.relatedClientId)
          .single();
          
        if (!clientError && client) {
          info.clientName = `${client.first_name} ${client.last_name}`;
        }
      }
      
      setRelatedInfo(info);
    };
    
    fetchRelatedInfo();
  }, [record, supabase]);

  const handleDeleteRecord = async () => {
    if (!record) return;

    if (window.confirm("Are you sure you want to delete this financial record? This action cannot be undone.")) {
      const success = await deleteRecord(record.id);
      if (success) {
        toast({
          title: "Success",
          description: "Financial record deleted successfully",
        });
        router.push("/dashboard/marketing/finances");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Error</h3>
          </div>
          <p>{error || "Financial record not found"}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/dashboard/marketing/finances")}
          >
            Back to Financial Records
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isEditing ? (
        <>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Financial Record
            </h1>
          </div>
          
          <FinancialRecordForm
            initialData={record}
            isEditing={true}
            onSuccess={() => {
              setIsEditing(false);
              router.refresh();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard/marketing/finances")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Financial Record Details
              </h1>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                record.recordType === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {record.recordType === 'income' ? 'Income' : 'Expense'}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDeleteRecord}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {record.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <CardDescription>
                {format(new Date(record.date), 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Amount:</span>
                    <span className={`ml-2 font-bold ${
                      record.recordType === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.recordType === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(record.amount)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{format(new Date(record.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{record.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {relatedInfo.dogName && (
                    <div className="flex items-center">
                      <Dog className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Related Dog:</span>
                      <span className="ml-2">{relatedInfo.dogName}</span>
                    </div>
                  )}
                  {relatedInfo.clientName && (
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Related Client:</span>
                      <span className="ml-2">{relatedInfo.clientName}</span>
                    </div>
                  )}
                  {record.receiptUrl && (
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Receipt:</span>
                      <a 
                        href={record.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        View Receipt
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {record.description && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{record.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
