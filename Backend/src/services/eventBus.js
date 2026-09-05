const subscribers = new Map();
export function subscribe(id, res) {
  if (!subscribers.has(id)) subscribers.set(id, new Set());
  subscribers.get(id).add(res);
  return () => subscribers.get(id)?.delete(res);
}
export function publish(id, event) {
  for (const res of subscribers.get(id) || []) {
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}
