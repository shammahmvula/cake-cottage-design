import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Cake,
  LogOut,
  RefreshCw,
  Calendar,
  Phone,
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderInquiry {
  id: string;
  name: string;
  contact: string;
  cake_type: string;
  event_type: string | null;
  delivery_option: string;
  delivery_location: string | null;
  date_needed: string;
  additional_notes: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-secondary/10 text-secondary border-secondary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  new: <AlertCircle className="w-3 h-3" />,
  contacted: <Clock className="w-3 h-3" />,
  confirmed: <CheckCircle className="w-3 h-3" />,
  completed: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

export default function Dashboard() {
  const [inquiries, setInquiries] = useState<OrderInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth is now handled by ProtectedRoute wrapper in App.tsx
  // This component only renders when user is authenticated

  const fetchInquiries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("order_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } else {
      setInquiries(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("order_inquiries")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      toast({
        title: "Status Updated",
        description: `Order marked as ${newStatus}`,
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredInquiries =
    filter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filter);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    confirmed: inquiries.filter((i) => i.status === "confirmed").length,
    completed: inquiries.filter((i) => i.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Cake className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Order Dashboard
              </h1>
              <p className="font-body text-sm text-foreground/60">
                Manage your cake inquiries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInquiries}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="font-body text-sm text-foreground/60">Total</p>
            <p className="font-display text-2xl font-bold text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="font-body text-sm text-blue-600">New</p>
            <p className="font-display text-2xl font-bold text-blue-600">
              {stats.new}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="font-body text-sm text-green-600">Confirmed</p>
            <p className="font-display text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="font-body text-sm text-secondary">Completed</p>
            <p className="font-display text-2xl font-bold text-secondary">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Order Inquiries
          </h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="font-body text-foreground/60">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Cake className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="font-body text-foreground/60">
              {filter === "all"
                ? "No order inquiries yet"
                : `No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-card transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {inquiry.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`${statusColors[inquiry.status]} flex items-center gap-1`}
                      >
                        {statusIcons[inquiry.status]}
                        {inquiry.status}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${inquiry.contact}`}
                          className="hover:text-primary"
                        >
                          {inquiry.contact}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Cake className="w-4 h-4" />
                        <span>{inquiry.cake_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(inquiry.date_needed), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/70">
                        {inquiry.delivery_option === "delivery" ? (
                          <Truck className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="capitalize">
                          {inquiry.delivery_option}
                          {inquiry.delivery_location &&
                            ` - ${inquiry.delivery_location}`}
                        </span>
                      </div>
                    </div>

                    {inquiry.event_type && (
                      <p className="mt-3 text-sm text-foreground/70">
                        <strong>Event:</strong> {inquiry.event_type}
                      </p>
                    )}

                    {inquiry.additional_notes && (
                      <p className="mt-2 text-sm text-foreground/60 italic">
                        "{inquiry.additional_notes}"
                      </p>
                    )}

                    <p className="mt-3 text-xs text-foreground/40">
                      Submitted{" "}
                      {format(new Date(inquiry.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => updateStatus(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="whatsapp"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${inquiry.contact.replace(/\D/g, "")}`,
                          "_blank"
                        )
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}