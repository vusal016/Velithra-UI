"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle, Edit, Trash2, Loader2, Package } from "lucide-react"
import { itemService, categoryService } from "@/lib/services/api"
import type { ItemDto, CategoryDto, ItemCreateDto } from "@/lib/types"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function InventoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<ItemDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editItem, setEditItem] = useState<ItemDto | null>(null)
  const [form, setForm] = useState<ItemCreateDto>({
    name: "",
    description: "",
    categoryId: "",
    quantity: 0,
    unitPrice: 0,
  })
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ItemDto | null>(null)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setIsLoading(true)
      const [itemsRes, categoriesRes] = await Promise.all([
        itemService.getAll(),
        categoryService.getAll(),
      ])
      const itemsData = itemsRes.data.data || itemsRes.data || []
      const categoriesData = categoriesRes.data.data || categoriesRes.data || []
      setItems(Array.isArray(itemsData) ? itemsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error: any) {
      console.error('Failed to load inventory:', error)
      toast.error("Failed to load inventory", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeletingId(deleteTarget.id)
      await itemService.delete(deleteTarget.id)
      toast.success("Item deleted successfully")
      setShowDeleteModal(false)
      setDeleteTarget(null)
      loadInventory()
    } catch (error: any) {
      console.error('Failed to delete item:', error)
      toast.error("Failed to delete item", {
        description: error.message || "Please try again"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getStockStatus = (quantity: number): { label: string; color: string } => {
    if (quantity === 0) return { label: "Out of Stock", color: "text-red-400" }
    if (quantity < 10) return { label: "Low Stock", color: "text-yellow-400" }
    return { label: "In Stock", color: "text-green-400" }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#00d9ff]" size={48} />
      </div>
    )
  }

  const lowStockItems = items.filter((item) => item.quantity < 10)

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          {items.filter((item) => item.quantity < 10).length > 0 && (
            <p className="text-sm text-yellow-400 mt-2 flex items-center gap-2">
              <AlertTriangle size={16} /> {items.filter((item) => item.quantity < 10).length} items low on stock
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            setIsEditMode(false);
            setEditItem(null);
            setForm({ name: "", description: "", categoryId: categories[0]?.id || "", quantity: 0, unitPrice: 0 });
            setShowAddEditModal(true);
          }}
          className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"
        >
          <Plus size={18} /> Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <GlassCard>
          <div className="p-12 text-center">
            <Package className="mx-auto text-[#6b8ca8] mb-4" size={64} />
            <h3 className="text-xl font-semibold text-foreground mb-2">No inventory items found</h3>
            <p className="text-[#6b8ca8] mb-6">Add your first item to get started</p>
            <Button
              onClick={() => {
                setIsEditMode(false);
                setEditItem(null);
                setForm({ name: "", description: "", categoryId: categories[0]?.id || "", quantity: 0, unitPrice: 0 });
                setShowAddEditModal(true);
              }}
              className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
            >
              <Plus size={18} className="mr-2" />
              Add Item
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const stockStatus = getStockStatus(item.quantity)
            return (
              <GlassCard key={item.id}>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-[#6b8ca8] mt-1 line-clamp-2">{item.description || 'No description'}</p>
                    </div>
                    {item.quantity < 10 && <AlertTriangle className="text-yellow-400" size={20} />}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6b8ca8]">Stock</span>
                      <span className={`font-medium ${stockStatus.color}`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b8ca8]">Status</span>
                      <span className={stockStatus.color}>{stockStatus.label}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/inventory/item/${item.id}`)}
                    >
                      <Package size={16} className="mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => {
                        setIsEditMode(true);
                        setEditItem(item);
                        setForm({
                          name: item.name,
                          description: item.description || "",
                          categoryId: item.categoryId,
                          quantity: item.quantity,
                          unitPrice: item.unitPrice,
                        });
                        setShowAddEditModal(true);
                      }}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-red-400 hover:text-red-300"
                      onClick={() => {
                        setDeleteTarget(item);
                        setShowDeleteModal(true);
                      }}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      <Dialog open={showAddEditModal} onOpenChange={setShowAddEditModal}>
        <DialogContent className="bg-[#1a1a2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{isEditMode ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.name || !form.categoryId) {
                toast.error("Please fill in all required fields");
                return;
              }
              try {
                setSubmitting(true);
                if (isEditMode && editItem) {
                  const updateData: any = {
                    name: form.name,
                    description: form.description,
                    categoryId: form.categoryId,
                  };
                  await itemService.update(editItem.id, updateData);
                  toast.success("Item updated successfully");
                } else {
                  const createData: any = {
                    name: form.name,
                    description: form.description,
                    categoryId: form.categoryId,
                    quantity: form.quantity,
                  };
                  await itemService.create(createData);
                  toast.success("Item created successfully");
                }
                setShowAddEditModal(false);
                setEditItem(null);
                setForm({ name: "", description: "", categoryId: categories[0]?.id || "", quantity: 0, unitPrice: 0 });
                loadInventory();
              } catch (error: any) {
                console.error('Failed to save item:', error);
                toast.error(error.response?.data?.message || error.message || "Failed to save item");
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="item-name" className="text-white">Item Name *</Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description" className="text-white">Description</Label>
              <Textarea
                id="item-description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter item description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-category" className="text-white">Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={val => setForm(f => ({ ...f, categoryId: val }))}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-quantity" className="text-white">Quantity</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-unitPrice" className="text-white">Unit Price</Label>
                <Input
                  id="item-unitPrice"
                  type="number"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={e => setForm(f => ({ ...f, unitPrice: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="0.00"
                  min={0}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddEditModal(false)}
                className="border-white/20"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : (isEditMode ? "Save Changes" : "Add Item")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={open => { setShowDeleteModal(open); if (!open) setDeleteTarget(null); }}>
        <DialogContent className="bg-[#1a1a2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
            </p>
            <p className="text-gray-400 text-sm mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-white/20"
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deletingId !== null}>
              {deletingId !== null ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
