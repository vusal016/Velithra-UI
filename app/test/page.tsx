"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/api/client"
import { toast } from "sonner"

export default function TestPage() {
  const [clickCount, setClickCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  useEffect(() => {
    addLog("✅ Page loaded successfully")
  }, [])

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1)
    addLog(`✅ Button clicked! Count: ${clickCount + 1}`)
    toast.success(`Button clicked ${clickCount + 1} times!`)
  }

  const handleAPITest = async () => {
    addLog("🔄 Testing API...")
    try {
      const response = await apiClient.get('/category')
      if (response.status >= 200 && response.status < 300) {
        addLog("✅ API Response OK")
        addLog(`📦 Data: ${JSON.stringify(response.data)}`)
      } else {
        addLog(`❌ API Error: ${response.status} ${response.statusText || ''}`)
      }
    } catch (error: any) {
      addLog(`❌ Network Error: ${error.message}`)
      addLog("💡 Backend server işləmir - port 5000-də dotnet run edin")
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🔧 Debug Test Page</h1>
          <p className="text-muted mt-2">Button click və API əlaqəsini test edin</p>
        </div>

        <GlassCard>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-foreground font-semibold mb-2">Click Counter: {clickCount}</p>
              <Button 
                onClick={handleButtonClick}
                className="bg-primary hover:bg-primary-dark text-background"
              >
                Click Me! ({clickCount})
              </Button>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button 
                onClick={handleAPITest}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Test Backend API
              </Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Event Logs:</h3>
            <div className="bg-black/30 rounded p-4 max-h-96 overflow-auto">
              {logs.length === 0 ? (
                <p className="text-muted text-sm">No logs yet...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className="text-xs text-foreground mb-1 font-mono">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-3">🎯 Problem Həll Yolları:</h3>
            <ol className="space-y-3 text-sm text-muted list-decimal list-inside">
              <li>
                <strong className="text-foreground">Button işləmirsə:</strong>
                <ul className="ml-6 mt-1 space-y-1 text-xs">
                  <li>• Browser console-da (F12) error yoxlayın</li>
                  <li>• Click counter artırsa, JavaScript işləyir</li>
                </ul>
              </li>
              <li>
                <strong className="text-foreground">API request getmirsə:</strong>
                <ul className="ml-6 mt-1 space-y-1 text-xs">
                  <li>• Backend server port 5000-də işləməlidir</li>
                  <li>• Terminal: <code className="bg-black/30 px-2 py-0.5 rounded text-primary">cd VelithraWEBAPI && dotnet run</code></li>
                  <li>• Browser Network tab-da request görünməlidi</li>
                </ul>
              </li>
              <li>
                <strong className="text-foreground">CORS error:</strong>
                <ul className="ml-6 mt-1 space-y-1 text-xs">
                  <li>• Backend Program.cs-də CORS konfiqurasiyasını yoxlayın</li>
                  <li>• <code className="bg-black/30 px-2 py-0.5 rounded text-primary">AllowAnyOrigin()</code> olmalıdır</li>
                </ul>
              </li>
            </ol>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
