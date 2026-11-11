export function extractCollection(response, key) {
  if (Array.isArray(response)) return response
  if (!response || typeof response !== 'object') return []

  const data = response.data
  if (Array.isArray(data)) return data
  const keys = Array.isArray(key) ? key : [key]
  for (const collectionKey of keys) {
    if (collectionKey && data && Array.isArray(data[collectionKey])) return data[collectionKey]
    if (collectionKey && Array.isArray(response[collectionKey])) return response[collectionKey]
  }

  return []
}
