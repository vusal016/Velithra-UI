"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  Tag,
} from "lucide-react";
import { itemService, categoryService, stockTransactionService } from "@/lib/services/api";
import { toast } from "sonner";
import type { ItemDto, CategoryDto, StockTransactionDto } from "@/lib/types";

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<ItemDto | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [transactions, setTransactions] = useState<StockTransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    loadItemData();
  }, [itemId]);

  const loadItemData = async () => {
    try {
      setIsLoading(true);
      const [itemRes, categoriesRes, transactionsRes] = await Promise.all([
        itemService.getById(itemId),
        categoryService.getAll(),
        stockTransactionService.getByItem(itemId),
      ]);

      const itemData = itemRes.data.data || itemRes.data;
      const categoriesData = categoriesRes.data.data || categoriesRes.data || [];
      const transactionsData = transactionsRes.data.data || transactionsRes.data || [];

      setItem(itemData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

      setFormData({
        name: itemData.name,
        description: itemData.description || "",
        categoryId: itemData.categoryId,
      });
    } catch (error: any) {
      console.error("Failed to load item data:", error);
      toast.error("Failed to load item data");
      router.push("/dashboard/inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!item) return;

    try {
      setIsSaving(true);
      await itemService.update(itemId, {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
      });
      toast.success("Item updated successfully");
      setIsEditing(false);
      loadItemData();
    } catch (error: any) {
      console.error("Failed to update item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading item...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const getStockStatus = () => {
    if (item.quantity === 0) return { label: "Out of Stock", color: "text-red-400" };
    if (item.quantity < 10) return { label: "Low Stock", color: "text-yellow-400" };
    return { label: "In Stock", color: "text-green-400" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/inventory")}
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{item.name}</h1>
              <p className="text-gray-300 mt-1">Item Details & History</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Save size={18} />
              Edit Item
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Current Stock",
              value: item.quantity,
              icon: Package,
              color: stockStatus.color,
            },
            {
              label: "Status",
              value: stockStatus.label,
              icon: TrendingUp,
              color: stockStatus.color,
            },
            {
              label: "Category",
              value: item.categoryName || "N/A",
              icon: Tag,
              color: "text-blue-400",
            },
            {
              label: "Transactions",
              value: transactions.length,
              icon: Clock,
              color: "text-purple-400",
            },
          ].map((stat, i) => (
            <GlassCard key={i}>
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
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Transaction History ({transactions.length})</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <GlassCard>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Item Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={5}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white disabled:opacity-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2332] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-white hover:bg-white/10"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: item.name,
                          description: item.description || "",
                          categoryId: item.categoryId,
                        });
                      }}
                      disabled={isSaving}
                      className="text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history">
            {transactions.length === 0 ? (
              <GlassCard>
                <div className="p-12 text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 text-lg">No transaction history</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Transactions will appear here once they are recorded
                  </p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard>
                <div className="p-6">
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              transaction.transactionType === "Purchase" ||
                              transaction.transactionType === "Return"
                                ? "bg-green-500/20"
                                : "bg-red-500/20"
                            }`}
                          >
                            {transaction.transactionType === "Purchase" ||
                            transaction.transactionType === "Return" ? (
                              <TrendingUp className="text-green-400" size={20} />
                            ) : (
                              <TrendingDown className="text-red-400" size={20} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  transaction.transactionType === "Purchase"
                                    ? "bg-green-500/20 text-green-400"
                                    : transaction.transactionType === "Sale"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {transaction.transactionType}
                              </span>
                              <span className="text-white font-medium">
                                {transaction.transactionType === "Purchase" ||
                                transaction.transactionType === "Return"
                                  ? "+"
                                  : "-"}
                                {transaction.quantity} units
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
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
