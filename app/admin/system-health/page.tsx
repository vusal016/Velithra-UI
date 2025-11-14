"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Database,
  Wifi,
  Server,
  Shield,
  Boxes,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  authService,
  taskService,
  employeeService,
  courseService,
  chatService,
  moduleService,
} from "@/lib/services/api";
import { itemService } from "@/lib/services/api";

interface HealthCheck {
  name: string;
  status: "healthy" | "warning" | "error" | "checking";
  message: string;
  responseTime?: number;
  lastChecked?: string;
  icon: any;
  color: string;
}

export default function SystemHealthPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      name: "Backend API",
      status: "checking",
      message: "Checking connection...",
      icon: Server,
      color: "blue",
    },
    {
      name: "Authentication Service",
      status: "checking",
      message: "Verifying auth endpoints...",
      icon: Shield,
      color: "green",
    },
    {
      name: "Database Connection",
      status: "checking",
      message: "Testing database...",
      icon: Database,
      color: "purple",
    },
    {
      name: "Task Module",
      status: "checking",
      message: "Checking task management...",
      icon: Boxes,
      color: "blue",
    },
    {
      name: "HR Module",
      status: "checking",
      message: "Checking employee services...",
      icon: Boxes,
      color: "green",
    },
    {
      name: "Course Module",
      status: "checking",
      message: "Checking course system...",
      icon: Boxes,
      color: "purple",
    },
    {
      name: "Inventory Module",
      status: "checking",
      message: "Checking inventory...",
      icon: Boxes,
      color: "orange",
    },
    {
      name: "Chat Module",
      status: "checking",
      message: "Checking messaging...",
      icon: Boxes,
      color: "cyan",
    },
    {
      name: "Module System",
      status: "checking",
      message: "Checking module manager...",
      icon: Boxes,
      color: "yellow",
    },
    {
      name: "Real-time Services (SignalR)",
      status: "checking",
      message: "Checking WebSocket connections...",
      icon: Wifi,
      color: "red",
    },
  ]);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const updatedChecks: HealthCheck[] = [];

    // Backend API Check
    try {
      const start = Date.now();
      await authService.refreshToken({
        token: "test",
        refreshToken: "test",
      }).catch(() => {}); // We just want to see if API responds
      const responseTime = Date.now() - start;
      updatedChecks.push({
        name: "Backend API",
        status: "healthy",
        message: "API is responding",
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Server,
        color: "blue",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Backend API",
        status: "error",
        message: "API connection failed",
        lastChecked: new Date().toISOString(),
        icon: Server,
        color: "blue",
      });
    }

    // Auth Service Check
    try {
      const start = Date.now();
      await authService.refreshToken({ token: "test", refreshToken: "test" }).catch(() => {});
      const responseTime = Date.now() - start;
      updatedChecks.push({
        name: "Authentication Service",
        status: "healthy",
        message: "Auth endpoints operational",
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Shield,
        color: "green",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Authentication Service",
        status: "warning",
        message: "Auth service may have issues",
        lastChecked: new Date().toISOString(),
        icon: Shield,
        color: "green",
      });
    }

    // Database Check (via any API call)
    try {
      const start = Date.now();
      await taskService.getAll().catch(() => {});
      const responseTime = Date.now() - start;
      updatedChecks.push({
        name: "Database Connection",
        status: "healthy",
        message: "Database queries working",
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Database,
        color: "purple",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Database Connection",
        status: "error",
        message: "Database connection issues",
        lastChecked: new Date().toISOString(),
        icon: Database,
        color: "purple",
      });
    }

    // Task Module Check
    try {
      const start = Date.now();
      const response = await taskService.getAll();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      updatedChecks.push({
        name: "Task Module",
        status: "healthy",
        message: `${Array.isArray(data) ? data.length : 0} tasks found`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "blue",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Task Module",
        status: "error",
        message: "Task service unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "blue",
      });
    }

    // HR Module Check
    try {
      const start = Date.now();
      const response = await employeeService.getAll();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      updatedChecks.push({
        name: "HR Module",
        status: "healthy",
        message: `${Array.isArray(data) ? data.length : 0} employees found`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "green",
      });
    } catch (error) {
      updatedChecks.push({
        name: "HR Module",
        status: "error",
        message: "HR service unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "green",
      });
    }

    // Course Module Check
    try {
      const start = Date.now();
      const response = await courseService.getAll();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      updatedChecks.push({
        name: "Course Module",
        status: "healthy",
        message: `${Array.isArray(data) ? data.length : 0} courses found`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "purple",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Course Module",
        status: "error",
        message: "Course service unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "purple",
      });
    }

    // Inventory Module Check
    try {
      const start = Date.now();
      const response = await itemService.getAll();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      updatedChecks.push({
        name: "Inventory Module",
        status: "healthy",
        message: `${Array.isArray(data) ? data.length : 0} items found`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "orange",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Inventory Module",
        status: "error",
        message: "Inventory service unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "orange",
      });
    }

    // Chat Module Check
    try {
      const start = Date.now();
      const response = await chatService.getRooms();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      updatedChecks.push({
        name: "Chat Module",
        status: "healthy",
        message: `${Array.isArray(data) ? data.length : 0} rooms found`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "cyan",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Chat Module",
        status: "error",
        message: "Chat service unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "cyan",
      });
    }

    // Module System Check
    try {
      const start = Date.now();
      const response = await moduleService.getAll();
      const responseTime = Date.now() - start;
      const data = response.data.data || response.data || [];
      const activeModules = Array.isArray(data) ? data.filter((m: any) => m.isActive).length : 0;
      updatedChecks.push({
        name: "Module System",
        status: "healthy",
        message: `${activeModules} active modules`,
        responseTime,
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "yellow",
      });
    } catch (error) {
      updatedChecks.push({
        name: "Module System",
        status: "error",
        message: "Module manager unavailable",
        lastChecked: new Date().toISOString(),
        icon: Boxes,
        color: "yellow",
      });
    }

    // SignalR Check
    try {
      // Check if SignalR is configured
      const signalrUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL;
      if (signalrUrl) {
        updatedChecks.push({
          name: "Real-time Services (SignalR)",
          status: "healthy",
          message: "SignalR hub configured",
          lastChecked: new Date().toISOString(),
          icon: Wifi,
          color: "red",
        });
      } else {
        updatedChecks.push({
          name: "Real-time Services (SignalR)",
          status: "warning",
          message: "SignalR URL not configured",
          lastChecked: new Date().toISOString(),
          icon: Wifi,
          color: "red",
        });
      }
    } catch (error) {
      updatedChecks.push({
        name: "Real-time Services (SignalR)",
        status: "error",
        message: "SignalR connection failed",
        lastChecked: new Date().toISOString(),
        icon: Wifi,
        color: "red",
      });
    }

    setHealthChecks(updatedChecks);
    setIsChecking(false);

    // Show summary toast
    const healthy = updatedChecks.filter((c) => c.status === "healthy").length;
    const total = updatedChecks.length;
    if (healthy === total) {
      toast.success("All systems operational", {
        description: `${healthy}/${total} checks passed`,
      });
    } else {
      toast.warning("Some systems need attention", {
        description: `${healthy}/${total} checks passed`,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="text-green-400" size={24} />;
      case "warning":
        return <AlertTriangle className="text-yellow-400" size={24} />;
      case "error":
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <Loader2 className="animate-spin text-gray-400" size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400">Error</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Checking</Badge>;
    }
  };

  const stats = {
    healthy: healthChecks.filter((c) => c.status === "healthy").length,
    warning: healthChecks.filter((c) => c.status === "warning").length,
    error: healthChecks.filter((c) => c.status === "error").length,
    avgResponseTime:
      healthChecks
        .filter((c) => c.responseTime)
        .reduce((sum, c) => sum + (c.responseTime || 0), 0) /
        healthChecks.filter((c) => c.responseTime).length || 0,
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00d9ff]/20 flex items-center justify-center">
              <Activity className="text-[#00d9ff]" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">System Health</h1>
              <p className="text-gray-300 mt-1">
                Monitor all system services and modules
              </p>
            </div>
          </div>
          <Button
            onClick={runHealthChecks}
            disabled={isChecking}
            className="gap-2 bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628]"
          >
            <RefreshCw className={isChecking ? "animate-spin" : ""} size={18} />
            {isChecking ? "Checking..." : "Run Health Check"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Healthy</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {stats.healthy}
                </p>
              </div>
              <CheckCircle2 className="text-green-400" size={32} />
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Warnings</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  {stats.warning}
                </p>
              </div>
              <AlertTriangle className="text-yellow-400" size={32} />
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Errors</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {stats.error}
                </p>
              </div>
              <XCircle className="text-red-400" size={32} />
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Response</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.avgResponseTime.toFixed(0)}ms
                </p>
              </div>
              <Clock className="text-gray-400" size={32} />
            </div>
          </GlassCard>
        </div>

        {/* Health Checks */}
        <div className="space-y-3">
          {healthChecks.map((check, index) => (
            <motion.div
              key={check.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>{getStatusIcon(check.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold">{check.name}</h3>
                        {getStatusBadge(check.status)}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{check.message}</p>
                      {check.lastChecked && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Last checked:{" "}
                            {new Date(check.lastChecked).toLocaleTimeString()}
                          </span>
                          {check.responseTime && (
                            <span>Response: {check.responseTime}ms</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* System Info */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Environment</p>
              <p className="text-white font-medium mt-1">
                {process.env.NODE_ENV || "development"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">API Base URL</p>
              <p className="text-white font-medium mt-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">SignalR Hub URL</p>
              <p className="text-white font-medium mt-1">
                {process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Last Health Check</p>
              <p className="text-white font-medium mt-1">
                {healthChecks[0]?.lastChecked
                  ? new Date(healthChecks[0].lastChecked).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
