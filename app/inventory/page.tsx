"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, TrendingDown, AlertTriangle, Loader2 } from "lucide-react"
import { itemService, categoryService } from "@/lib/services/api"
import type { ItemDto } from "@/lib/types"
import { toast } from "sonner"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState<ItemDto[]>([])
  const [displayItems, setDisplayItems] = useState<ItemDto[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    categoryId: 0
  })

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
      setDisplayItems(Array.isArray(itemsData) ? itemsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error: any) {
      console.error('Failed to load inventory:', error)
      toast.error("Failed to load inventory", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setDisplayItems(
      items.filter(
        (i) =>
          i.name.toLowerCase().includes(term.toLowerCase()) ||
          (i.description && i.description.toLowerCase().includes(term.toLowerCase())),
      ),
    )
  }

  const getItemStatus = (item: ItemDto): "in-stock" | "low-stock" | "out-of-stock" => {
    if (item.quantity === 0) return "out-of-stock"
    if (item.quantity < 10) return "low-stock"
    return "in-stock"
  }

  const handleCreate = () => {
    setIsEditMode(false)
    setSelectedItem(null)
    setFormData({
      name: "",
      description: "",
      quantity: 0,
      categoryId: categories[0]?.id || 0
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: ItemDto) => {
    setIsEditMode(true)
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      categoryId: item.categoryId
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      if (isEditMode && selectedItem) {
        await itemService.update(selectedItem.id, {
          name: formData.name,
          description: formData.description,
          categoryId: formData.categoryId.toString(),
        })
        toast.success("Item updated successfully")
      } else {
        await itemService.create({
          name: formData.name,
          quantity: formData.quantity,
          description: formData.description,
          categoryId: formData.categoryId.toString(),
        })
        toast.success("Item created successfully")
      }
      setIsDialogOpen(false)
      loadInventory()
    } catch (error: any) {
      console.error('Failed to save item:', error)
      toast.error("Failed to save item", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    try {
      setIsSubmitting(true)
      await itemService.delete(itemId)
      toast.success("Item deleted successfully")
      loadInventory()
    } catch (error: any) {
      console.error('Failed to delete item:', error)
      toast.error("Failed to delete item", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground">Loading inventory...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted mt-1">Manage inventory and stock levels</p>
          </div>
          <Button 
            onClick={handleCreate}
            className="gap-2 bg-primary hover:bg-primary-dark text-background"
          >
            <Plus size={18} />
            Add Item
          </Button>
        </div>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Items",
              value: items.length,
              color: "text-primary",
            },
            {
              label: "Low Stock",
              value: items.filter((i) => getItemStatus(i) === "low-stock").length,
              color: "text-yellow-400",
            },
            {
              label: "Out of Stock",
              value: items.filter((i) => getItemStatus(i) === "out-of-stock").length,
              color: "text-red-400",
            },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4">
                  <p className="text-xs text-muted uppercase">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Inventory Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Item Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">SKU</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Quantity</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Min Stock</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 text-muted text-xs font-mono">SKU-{item.id.substring(0, 6)}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-muted">10</td>
                    <td className="px-6 py-4 text-muted">{categories.find(c => c.id === item.categoryId)?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium">-</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getItemStatus(item) === "low-stock" && <AlertTriangle size={14} className="text-yellow-400" />}
                        {getItemStatus(item) === "out-of-stock" && <TrendingDown size={14} className="text-red-400" />}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            getItemStatus(item) === "in-stock"
                              ? "bg-primary/20 text-primary"
                              : getItemStatus(item) === "low-stock"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {getItemStatus(item)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(item)}
                          disabled={isSubmitting}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-400"
                          onClick={() => handleDelete(item.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditMode ? "Edit Item" : "Add Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                  className="bg-white/5 border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                  className="bg-white/5 border-white/10 text-foreground"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder="0"
                    className="bg-white/5 border-white/10 text-foreground"
                  />
                </div>

              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">Category</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: Number(value) })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="text-foreground">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-background" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (isEditMode ? "Update" : "Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
