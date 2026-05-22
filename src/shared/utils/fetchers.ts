export async function fetchGet<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return (await response.json()) as T;
    }
    throw new Error("Ошибка получения данных!");
  } catch (err) {
    return null;
  }
}
