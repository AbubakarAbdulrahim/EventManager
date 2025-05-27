export const trackEvent = async (eventType, data = {}) => {
  const consent = localStorage.getItem('cookie_consent');
  if (!consent) return;

  try {
    console.log(eventType, data);
    
    await fetch('/api/track-event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: eventType, ...data }),
    });
  } catch (error) {
    console.error('Event tracking failed', error);
  }
};
