"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { TransactionType } from "@/lib/types";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Package,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { stockTransactionService, itemService } from "@/lib/services/api";
import type { StockTransactionDto, ItemDto, TransactionType } from "@/lib/types";
import { toast } from "sonner";

export default function StockTransactionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<StockTransactionDto[]>([]);
  const [displayTransactions, setDisplayTransactions] = useState<StockTransactionDto[]>([]);
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    transactionType: "Purchase" as TransactionType,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [transactionsRes, itemsRes] = await Promise.all([
        stockTransactionService.getAll(),
        itemService.getAll(),
      ]);

      const transactionsData = transactionsRes.data.data || transactionsRes.data || [];
      const itemsData = itemsRes.data.data || itemsRes.data || [];

      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setDisplayTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (error: any) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load stock transactions", {
        description: error.response?.data?.message || error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = transactions.filter(
      (t) =>
        (t.itemName && t.itemName.toLowerCase().includes(term.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(term.toLowerCase())) ||
        t.transactionType.toLowerCase().includes(term.toLowerCase())
    );
    setDisplayTransactions(filtered);
  };

  const handleCreate = () => {
    setFormData({
      itemId: items[0]?.id || "",
      quantity: 0,
      transactionType: TransactionType.Purchase,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.itemId || formData.quantity <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await stockTransactionService.create({
        itemId: formData.itemId,
        quantity: formData.quantity,
        transactionType: formData.transactionType,
        notes: formData.notes || undefined,
      });
      toast.success("Stock transaction created successfully");
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Failed to create transaction:", error);
      toast.error("Failed to create transaction", {
        description: error.response?.data?.message || error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "Purchase":
        return <ArrowDownRight className="text-green-400" size={20} />;
      case "Sale":
        return <ArrowUpRight className="text-red-400" size={20} />;
      case "Return":
        return <RefreshCw className="text-blue-400" size={20} />;
      case "Adjustment":
        return <Package className="text-yellow-400" size={20} />;
      case "Transfer":
        return <TrendingUp className="text-purple-400" size={20} />;
      default:
        return <Package className="text-gray-400" size={20} />;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "Purchase":
        return "text-green-400 bg-green-500/20";
      case "Sale":
        return "text-red-400 bg-red-500/20";
      case "Return":
        return "text-blue-400 bg-blue-500/20";
      case "Adjustment":
        return "text-yellow-400 bg-yellow-500/20";
      case "Transfer":
        return "text-purple-400 bg-purple-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  const transactionStats = {
    total: transactions.length,
    purchases: transactions.filter((t) => t.transactionType === "Purchase").length,
    sales: transactions.filter((t) => t.transactionType === "Sale").length,
    returns: transactions.filter((t) => t.transactionType === "Return").length,
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Stock Transactions</h1>
            <p className="text-gray-300 mt-1">Track inventory movements and changes</p>
          </div>
          <Button
            onClick={handleCreate}
            className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
          >
            <Plus size={18} />
            New Transaction
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Transactions",
              value: transactionStats.total,
              icon: Package,
              color: "text-[#00d9ff]",
            },
            {
              label: "Purchases",
              value: transactionStats.purchases,
              icon: ArrowDownRight,
              color: "text-green-400",
            },
            {
              label: "Sales",
              value: transactionStats.sales,
              icon: ArrowUpRight,
              color: "text-red-400",
            },
            {
              label: "Returns",
              value: transactionStats.returns,
              icon: RefreshCw,
              color: "text-blue-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Transactions List */}
        {displayTransactions.length === 0 ? (
          <GlassCard>
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-300 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first transaction to track stock movements
              </p>
            </div>
          </GlassCard>
        ) : (
          <GlassCard>
            <div className="p-6">
              <div className="space-y-3">
                {displayTransactions.map((transaction, i) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-white font-semibold">
                            {transaction.itemName || "Unknown Item"}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getTransactionColor(
                              transaction.transactionType
                            )}`}
                          >
                            {transaction.transactionType}
                          </span>
                        </div>
                        {transaction.notes && (
                          <p className="text-gray-400 text-sm mt-1">{transaction.notes}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(transaction.transactionDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.transactionType === "Purchase" ||
                          transaction.transactionType === "Return"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.transactionType === "Purchase" ||
                        transaction.transactionType === "Return"
                          ? "+"
                          : "-"}
                        {transaction.quantity}
                      </p>
                      <p className="text-gray-400 text-xs">units</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Create Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a2332] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Create Stock Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item" className="text-white">
                Item <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.itemId}
                onValueChange={(value) => setFormData({ ...formData, itemId: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-white/10">
                  {items.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="text-white hover:bg-white/10"
                    >
                      {item.name} (Stock: {item.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionType" className="text-white">
                Transaction Type <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, transactionType: value as TransactionType })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-white/10">
                  <SelectItem value="Purchase" className="text-white hover:bg-white/10">
                    Purchase (Incoming)
                  </SelectItem>
                  <SelectItem value="Sale" className="text-white hover:bg-white/10">
                    Sale (Outgoing)
                  </SelectItem>
                  <SelectItem value="Return" className="text-white hover:bg-white/10">
                    Return (Incoming)
                  </SelectItem>
                  <SelectItem value="Adjustment" className="text-white hover:bg-white/10">
                    Adjustment
                  </SelectItem>
                  <SelectItem value="Transfer" className="text-white hover:bg-white/10">
                    Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-white">
                Quantity <span className="text-red-400">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter transaction notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : (
                "Create Transaction"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
