"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  lastUpdated: string
}

const inventory: InventoryItem[] = [
  { id: "1", name: "Server Rack", category: "Hardware", stock: 5, minStock: 2, price: 3500, lastUpdated: "2025-11-08" },
  {
    id: "2",
    name: "Ethernet Cable",
    category: "Networking",
    stock: 1,
    minStock: 10,
    price: 25,
    lastUpdated: "2025-11-07",
  },
  {
    id: "3",
    name: "Laptop Stand",
    category: "Accessories",
    stock: 15,
    minStock: 5,
    price: 89,
    lastUpdated: "2025-11-06",
  },
]

export default function InventoryPage() {
  const [items] = useState<InventoryItem[]>(inventory)

  const lowStockItems = items.filter((item) => item.stock <= item.minStock)

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          {lowStockItems.length > 0 && (
            <p className="text-sm text-yellow-400 mt-2 flex items-center gap-2">
              <AlertTriangle size={16} /> {lowStockItems.length} items low on stock
            </p>
          )}
        </div>
        <Button className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30">
          <Plus size={18} /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <GlassCard key={item.id}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs text-[#6b8ca8] mt-1">{item.category}</p>
                </div>
                {item.stock <= item.minStock && <AlertTriangle className="text-red-400" size={20} />}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b8ca8]">Stock</span>
                  <span
                    className={item.stock <= item.minStock ? "text-red-400 font-medium" : "text-[#00d9ff] font-medium"}
                  >
                    {item.stock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b8ca8]">Min Stock</span>
                  <span className="text-foreground">{item.minStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b8ca8]">Unit Price</span>
                  <span className="text-[#00d9ff] font-medium">${item.price}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
