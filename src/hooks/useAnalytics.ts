import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
    const location = useLocation();

    const trackPageView = useCallback(async (path: string) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'pageview',
                    data: {
                        path,
                        userAgent: navigator.userAgent,
                        screenSize: `${window.innerWidth}x${window.innerHeight}`,
                    },
                }),
            });
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }, []);

    const trackEvent = useCallback(async (eventName: string, properties: Record<string, any> = {}) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'event',
                    data: {
                        eventName,
                        properties,
                        path: window.location.pathname,
                        userAgent: navigator.userAgent,
                    },
                }),
            });
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }, []);

    // Automatically track page views on location change
    useEffect(() => {
        trackPageView(location.pathname);
    }, [location.pathname, trackPageView]);

    return { trackEvent };
};
