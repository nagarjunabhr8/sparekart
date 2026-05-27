// Simple client-side analytics utility
export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    // In production, this would send to Mixpanel, Segment, or similar
    if (typeof window !== "undefined") {
      console.log(`[Analytics] ${eventName}`, properties);

      // Store event in sessionStorage for debugging
      const events = JSON.parse(sessionStorage.getItem("analytics_events") || "[]");
      events.push({
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem("analytics_events", JSON.stringify(events.slice(-50)));
    }
  },
};
