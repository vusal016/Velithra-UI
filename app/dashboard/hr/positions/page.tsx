"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Briefcase, Loader2, X } from "lucide-react"
import { positionService } from "@/lib/services/hrService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
interface PositionFormValues {
  title: string
  description: string
}
import type { PositionDto } from "@/lib/types/module.types"
import { toast } from "sonner"

export default function AdminPositionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [positions, setPositions] = useState<PositionDto[]>([])
  const [displayPositions, setDisplayPositions] = useState<PositionDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal state
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PositionFormValues>()

  useEffect(() => {
    loadPositions()
  }, [])

  const loadPositions = async () => {
    try {
      setIsLoading(true)
      const data = await positionService.getAll()
      setPositions(data)
      setDisplayPositions(data)
    } catch (error: any) {
      toast.error("Failed to load positions", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onCreatePosition = async (values: PositionFormValues) => {
    try {
      const res = await positionService.create(values)
      toast.success("Position created successfully")
      setOpen(false)
      reset()
      loadPositions()
    } catch (error: any) {
      toast.error("Failed to create position", {
        description: error.message || "Please try again later",
      })
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = positions.filter(
      (p) => p.title.toLowerCase().includes(term.toLowerCase()),
    )
    setDisplayPositions(filtered)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
            <p className="text-white">Loading positions...</p>
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
            <h1 className="text-3xl font-bold text-white">Positions</h1>
            <p className="text-gray-300 mt-1">Manage job positions and roles</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-background" onClick={() => setOpen(true)}>
            <Plus size={18} />
            Add Position
          </Button>
        </div>

        {/* Add Position Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Position</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreatePosition)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")}/>
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")}/>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => { setOpen(false); reset(); }}>
                  <X size={16}/> Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-background">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16}/> : null}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search Bar */}
        <GlassCard>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <Input
                placeholder="Search positions..."
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
            { label: "Total Positions", value: positions.length, icon: Briefcase },
            { label: "Active Positions", value: positions.length, icon: Plus },
            { label: "Total Positions", value: positions.length, icon: Briefcase },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <GlassCard>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <stat.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Positions List */}
        <div className="space-y-4">
          {displayPositions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No positions found</p>
            </div>
          ) : (
            displayPositions.map((position, i) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Briefcase size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{position.title}</h3>
                          <p className="text-sm text-gray-300">{position.description || 'No description'}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2 text-red-400">
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
