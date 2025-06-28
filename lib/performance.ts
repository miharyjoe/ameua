// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(operation: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, [])
      }
      
      this.metrics.get(operation)!.push(duration)
      
      // Log slow operations (>1000ms)
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`)
      }
      
      // Keep only last 10 measurements
      const measurements = this.metrics.get(operation)!
      if (measurements.length > 10) {
        measurements.shift()
      }
    }
  }

  getAverageTime(operation: string): number {
    const measurements = this.metrics.get(operation)
    if (!measurements || measurements.length === 0) return 0
    
    const sum = measurements.reduce((acc, val) => acc + val, 0)
    return sum / measurements.length
  }

  getStats(): Record<string, { avg: number; count: number; latest: number }> {
    const stats: Record<string, { avg: number; count: number; latest: number }> = {}
    
    this.metrics.forEach((measurements, operation) => {
      if (measurements.length > 0) {
        const avg = measurements.reduce((acc, val) => acc + val, 0) / measurements.length
        stats[operation] = {
          avg: Math.round(avg),
          count: measurements.length,
          latest: Math.round(measurements[measurements.length - 1])
        }
      }
    })
    
    return stats
  }

  logStats(): void {
    const stats = this.getStats()
    console.table(stats)
  }
}

// Helper function for easy usage
export const measurePerformance = (operation: string) => {
  return PerformanceMonitor.getInstance().startTimer(operation)
} 