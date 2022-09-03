export async function createWorker(urlOrWorker: string|Worker) {
  if (urlOrWorker instanceof Worker) {
    return urlOrWorker
  }
  const url = urlOrWorker;
  try {
    return new Worker(url)
  } catch {
    const workerContent = await (await fetch(url)).text()
    return new Worker(window.URL.createObjectURL(new Blob([workerContent])))
  }
}
