"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, TrendingDown, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  minStock: number
  category: string
  price: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const items: InventoryItem[] = [
  {
    id: "1",
    name: "Laptop Computer",
    sku: "LAPTOP-001",
    quantity: 15,
    minStock: 5,
    category: "Electronics",
    price: "$899.99",
    status: "in-stock",
  },
  {
    id: "2",
    name: "Office Chair",
    sku: "CHAIR-001",
    quantity: 3,
    minStock: 10,
    category: "Furniture",
    price: "$299.99",
    status: "low-stock",
  },
  {
    id: "3",
    name: "Monitor Display",
    sku: "MONITOR-001",
    quantity: 0,
    minStock: 3,
    category: "Electronics",
    price: "$399.99",
    status: "out-of-stock",
  },
  {
    id: "4",
    name: "Desk Lamp",
    sku: "LAMP-001",
    quantity: 25,
    minStock: 5,
    category: "Lighting",
    price: "$49.99",
    status: "in-stock",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [displayItems, setDisplayItems] = useState(items)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setDisplayItems(
      items.filter(
        (i) =>
          i.name.toLowerCase().includes(term.toLowerCase()) ||
          i.sku.toLowerCase().includes(term.toLowerCase()) ||
          i.category.toLowerCase().includes(term.toLowerCase()),
      ),
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
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background">
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
              value: items.filter((i) => i.status === "low-stock").length,
              color: "text-yellow-400",
            },
            {
              label: "Out of Stock",
              value: items.filter((i) => i.status === "out-of-stock").length,
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
                    <td className="px-6 py-4 text-muted text-xs font-mono">{item.sku}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-muted">{item.minStock}</td>
                    <td className="px-6 py-4 text-muted">{item.category}</td>
                    <td className="px-6 py-4 font-medium">{item.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === "low-stock" && <AlertTriangle size={14} className="text-yellow-400" />}
                        {item.status === "out-of-stock" && <TrendingDown size={14} className="text-red-400" />}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "in-stock"
                              ? "bg-primary/20 text-primary"
                              : item.status === "low-stock"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
