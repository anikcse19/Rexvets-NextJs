"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  User,
  Calendar,
  MessageSquare,
  Phone,
  Filter,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EmailRequest, HelpTicket } from "@/lib/types/support";
import { toast } from "sonner";
import { format } from "date-fns";
import { sendHelpAskingReplyFromAdmin } from "@/lib/email";
import RequireAccess from "../../Shared/RequireAccess";

type HelpInfoEmail = {
  id: string;
  sender?: string;
  senderEmail?: string;
  to?: string;
  subject?: string;
  message?: string;
  text?: string;
  date?: string | Date;
  sentAt?: string | Date;
  messageId?: string;
  inReplyTo?: string;
  seen?: boolean;
  threadId: string;
};

type HelpTicketWithThread = HelpTicket & {
  inReplyTo?: string;
};

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="text-orange-600 border-orange-200 bg-orange-50"
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="text-blue-600 border-blue-200 bg-blue-50"
        >
          <Mail className="w-3 h-3 mr-1" />
          Replied
        </Badge>
      );
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="text-green-600 border-green-200 bg-green-50"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="text-gray-600 border-gray-200 bg-gray-50"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Unknown
        </Badge>
      );
  }
};

export default function HelpManagement() {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingEmailThreads, setIsRefreshingEmailThreads] =
    useState(false);

  const [isFirstReply, setIsFirstReply] = useState<boolean>(false);
  const [emailThreads, setEmailThreads] = useState<
    { adminMessage: any; replies: any[] }[]
  >([]);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 100000);

  const fetchHelpInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/help");

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setTickets(data?.data?.helpRequests);
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailThreads = async () => {
    const snapshot = await getDocs(collection(db, "HelpInfoReplies"));
    const allReplies: any = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const threads: {
      adminMessage: HelpInfoEmail;
      replies: HelpInfoEmail[];
    }[] = [];

    const originalAdminMessages = allReplies.filter(
      (r: any) => r.sender === "admin" && r.threadId
    );

    for (const admin of originalAdminMessages) {
      const replies = allReplies.filter(
        (r: any) =>
          r.threadId === admin.threadId && r.messageId !== admin.messageId
      );

      replies.sort(
        (a: any, b: any) =>
          new Date(a.date?.toDate?.() || a.sentAt?.toDate?.()).getTime() -
          new Date(b.date?.toDate?.() || b.sentAt?.toDate?.()).getTime()
      );

      threads.push({ adminMessage: admin, replies });
    }

    setEmailThreads(threads);
  };

  const isPartOfThread = (
    message: HelpInfoEmail,
    rootMessageId: string,
    allMessages: HelpInfoEmail[]
  ): boolean => {
    if (message.inReplyTo === rootMessageId) return true;

    const parent = allMessages.find((m) => m.messageId === message.inReplyTo);
    if (parent) return isPartOfThread(parent, rootMessageId, allMessages);

    return false;
  };

  const fetchEmailReplies = async () => {
    const response = await fetch("http://localhost:5000/fetchEmails", {
      signal: controller.signal,
      method: "GET",
    });

    console.log(response, "email response");
    const result = await response.json();
    console.log("result", result);
  };

  useEffect(() => {
    fetchHelpInfo();
    fetchEmailReplies();
    fetchEmailThreads();

    const intervalId = setInterval(() => {
      fetchHelpInfo();
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? !ticket.status ||
          ticket.status === "" ||
          ticket.status?.toLowerCase() === "pending"
        : ticket?.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSaveAdminReplyOnDB = async (data: any) => {
    console.log("function hitted");
    try {
      const res = await addDoc(collection(db, "HelpInfoReplies"), data);
      console.log("add new collection", res);
    } catch (err) {
      console.error("Failed to add reply to HelpInfoReplies:", err);
    }
  };

  async function updateHelpRequest(
    id: string,
    status: "pending" | "in-progress" | "resolved",
    reply: string
  ) {
    const res = await fetch("/api/help/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, reply }),
    });

    const data = await res.json();
    console.log(data, "help reply data");
  }

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    console.log("selected ticket", selectedTicket);

    setIsLoading(true);

    try {
      await updateHelpRequest(selectedTicket?._id, "in-progress", replyMessage);
      // const emailData: EmailRequest = {
      //   to: selectedTicket.emailAddress,
      //   subject: replySubject || `Re: ${selectedTicket.subject}`,
      //   message: replyMessage,
      //   originalTicket: selectedTicket,
      //   isFirstReply,
      // };
      // const response = await fetch(
      //   // "https://rexvetsemailserver.up.railway.app/sendHelpAskingReply",
      //   "http://localhost:5000/sendHelpAskingReply",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(emailData),
      //   }
      // );
      // if (response.ok) {
      //   // Update ticket status to 'replied'
      //   setTickets((prev) =>
      //     prev.map((ticket) =>
      //       ticket.id === selectedTicket.id
      //         ? { ...ticket, state: "replied" }
      //         : ticket
      //     )
      //   );
      //   const result = await response.json();
      toast.success("Reply sent successfully!");
      //   const repliedData = {
      //     queryId: selectedTicket.id,
      //     sender: "admin",
      //     senderEmail: "support@rexvets.com",
      //     sentAt: new Date(),
      //     messageId: result?.data?.messageId,
      //     inReplyTo: selectedTicket?.inReplyTo || null, // 👈 NEW FIELD
      //     to: selectedTicket?.emailAddress,
      //     subject: replySubject || `Re: ${selectedTicket.subject}`,
      //     message: replyMessage,
      //     threadId: selectedTicket.id, // 👈 store thread ID
      //   };
      //   const ticketRef = doc(db, "HelpInfo", selectedTicket.id);
      //   await updateDoc(ticketRef, { status: "replied" });
      fetchHelpInfo();
      //   handleSaveAdminReplyOnDB(repliedData);
      setReplyMessage("");
      setReplySubject("");
      setIsDialogOpen(false);
      setSelectedTicket(null);
      //   fetchEmailThreads();
      //   fetchEmailReplies();
      // } else {
      //   throw new Error("Failed to send email");
      // }
    } catch (error) {
      toast("Failed to send reply. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const openReplyModal = (ticket: HelpTicket) => {
    setSelectedTicket(ticket);
    setReplySubject(`Re: ${ticket.subject}`);
    setIsDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchHelpInfo();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRefreshEmailThreads = () => {
    fetchEmailThreads();
    fetchEmailReplies();
    setIsRefreshingEmailThreads(true);
    setTimeout(() => setIsRefreshingEmailThreads(false), 1000);
  };

  return (
    <RequireAccess permission="Support">
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-yellow-100">
              Help & Support Management
            </h1>
            <p className="text-gray-600 dark:text-white mt-1">
              Manage customer support tickets and send replies
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-40 md:w-64 dark:bg-gray-700 dark:border-slate-600"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 dark:bg-gray-700 dark:border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="dark:bg-slate-800 bg-gray-100">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="flex items-center gap-2 text-sm md:text-lg">
                <MessageSquare className="w-5 h-5" />
                Support Tickets ({filteredTickets.length})
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="dark:bg-gray-700 dark:border-slate-600"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                      Subject
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                      Message
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors `}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-200 text-sm md:text-base">
                              {ticket.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-200 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {ticket.email}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-200 flex items-center gap-1 mt-1">
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize"
                              >
                                {ticket.role.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-gray-200 truncate max-w-sm">
                          {ticket.subject}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className="text-gray-600 max-w-xs truncate dark:text-gray-200"
                          title={ticket.details}
                        >
                          {ticket.details}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="py-4 px-4">
                        {ticket.status == "in-progress" ? (
                          <>-</>
                        ) : (
                          <Button
                            onClick={() => {
                              openReplyModal(ticket);
                              setIsFirstReply(true);
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No support tickets found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Card className="mt-10 dark:bg-slate-800 bg-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-sm md:text-lg">
              <Mail className="w-5 h-5" />
              Email Conversations ({emailThreads.length})
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefreshEmailThreads}
                disabled={isRefreshingEmailThreads}
                className="dark:bg-gray-700 dark:border-slate-600"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshingEmailThreads ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {emailThreads.length === 0 ? (
            <p className="text-gray-500">No email conversations found.</p>
          ) : (
            <div className="space-y-6">
              {emailThreads.map((thread, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-md p-0 md:p-3"
                >
                  <div className="mb-3 p-2 md:p-4">
                    <h4 className="text-sm md:text-lg font-semibold dark:text-white">
                      📤 Admin → {thread.adminMessage.to}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Subject: {thread.adminMessage.subject}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 mt-2 whitespace-pre-line">
                      {thread.adminMessage.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent at:{" "}
                      {new Date(
                        thread.adminMessage?.sentAt?.toDate?.()
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                    <h5 className="font-medium mb-2 text-sm text-gray-800 dark:text-white">
                      Replies:
                    </h5>
                    {thread.replies.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No replies yet.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {thread.replies.map((reply, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            <div className="mb-1">
                              <span className="font-semibold">
                                {reply.sender === "admin"
                                  ? "🧑‍⚕️ Admin"
                                  : reply.from}
                              </span>{" "}
                              <span className="text-xs text-gray-400 ml-2">
                                {new Date(
                                  reply?.date?.toDate?.() ||
                                    reply?.sentAt?.toDate?.()
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="mb-1">
                              {reply.message?.split("\n")[0] ||
                                reply.text?.split("\n")[0]}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-end mt-4 p-2">
                    <Button
                      onClick={() => {
                        const lastReply =
                          thread.replies[thread.replies.length - 1];
                        setSelectedTicket({
                          id: thread.adminMessage.queryId,
                          emailAddress: thread.adminMessage.to,
                          subject: thread.adminMessage.subject,
                          message: thread.adminMessage.message,
                          fullName: "Reply to user",
                          inReplyTo:
                            lastReply?.messageId ||
                            thread.adminMessage.messageId, // 👈 this is the fix
                        });
                        setReplySubject(`Re: ${thread.adminMessage.subject}`);
                        setIsDialogOpen(true);
                        setIsFirstReply(false);
                      }}
                      size="sm"
                      className="bg-[#1E3A8A] hover:bg-[#1E3A8A] text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Reply to Support Ticket
              </DialogTitle>
              <DialogDescription>
                Sending reply to{" "}
                <span className="font-medium">{selectedTicket?.name}</span> at{" "}
                <span className="font-medium">{selectedTicket?.email}</span>
              </DialogDescription>
            </DialogHeader>

            {selectedTicket && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">
                    Original Message:
                  </h4>
                  <p className="text-gray-700 text-sm dark:text-gray-200">
                    {selectedTicket.details}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-200">
                    <span>Subject: {selectedTicket.subject}</span>
                    <span>
                      Date: {format(selectedTicket.createdAt, "yyyy-mm-dd")}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reply-subject">Reply Subject</Label>
                    <Input
                      id="reply-subject"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="Enter reply subject..."
                      className="mt-1 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reply-message">Your Reply</Label>
                    <Textarea
                      id="reply-message"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={8}
                      className="mt-1 resize-none dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setReplyMessage("");
                      setReplySubject("");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReply}
                    disabled={isLoading || !replyMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RequireAccess>
  );
}
