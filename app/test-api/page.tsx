"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/api/client"
import ENV from "@/lib/config/env"

export default function TestAPIPage() {
  const [status, setStatus] = useState<string>("Not tested")
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    setStatus("Testing...")
    setDetails(null)

    try {
      // Test simple endpoint
      const response = await apiClient.get("/category")
      setStatus("✅ SUCCESS - Backend is running!")
      setDetails({
        status: response.status,
        data: response.data,
        url: ENV.API_BASE_URL
      })
    } catch (error: any) {
      setStatus("❌ FAILED - Backend not accessible")
      setDetails({
        message: error.message,
        code: error.code,
        url: ENV.API_BASE_URL,
        expectedBackend: ENV.API_BASE_URL,
        hint: "Backend serveri port 5000-də işə salın: dotnet run"
      })
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Connection Test</h1>
          <p className="text-muted mt-2">Backend server əlaqəsini yoxlayın</p>
        </div>

        <GlassCard>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted mb-2">Backend URL:</p>
              <code className="text-primary bg-primary/10 px-3 py-1 rounded">
                {ENV.API_BASE_URL}
              </code>
            </div>

            <Button 
              onClick={testConnection}
              className="bg-primary hover:bg-primary-dark text-background"
            >
              Test Connection
            </Button>

            {status !== "Not tested" && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="font-semibold text-foreground mb-2">{status}</p>
                {details && (
                  <pre className="text-xs text-muted overflow-auto max-h-96">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Backend Server İşə Salma:</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted">1. Backend layihəsinə keçin:</p>
              <code className="block bg-black/30 px-3 py-2 rounded text-primary">
                cd VelithraWEBAPI
              </code>
              
              <p className="text-muted mt-3">2. Serveri işə salın:</p>
              <code className="block bg-black/30 px-3 py-2 rounded text-primary">
                dotnet run
              </code>
              
              <p className="text-muted mt-3">3. Server işə düşdükdən sonra yuxarıdakı düyməni basın</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Debugging Tips:</h3>
            <ul className="space-y-2 text-sm text-muted list-disc list-inside">
              <li>Backend port 5000-də işləməlidir</li>
              <li>CORS backend-də konfiqurasiya olunmalıdır</li>
              <li>Browser Console-da network requests yoxlayın (F12)</li>
              <li>Backend logs-da error yoxlayın</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
