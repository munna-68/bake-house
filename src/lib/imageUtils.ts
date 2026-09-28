/**
 * Image processing utilities for Bake House.
 * Handles client-side image compression, resizing, and smart background removal
 * so that uploaded cookies look stunning on the warm radial parchment tiles.
 */

export interface BackgroundSample {
  r: number
  g: number
  b: number
}

/**
 * Read a File object into an HTMLImageElement.
 */
export function readFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (!src) {
        reject(new Error('Failed to read file'))
        return
      }
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    }
    reader.onerror = () => reject(new Error('File reader error'))
    reader.readAsDataURL(file)
  })
}

/**
 * Load an image from a URL or Data URL.
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image from URL'))
    img.src = url
  })
}

/**
 * Resizes an image down to maxDim x maxDim while preserving aspect ratio
 * and alpha transparency. Returns a PNG data URL.
 */
export function resizeImage(img: HTMLImageElement, maxDim = 512): string {
  const canvas = document.createElement('canvas')
  let width = img.naturalWidth || img.width
  let height = img.naturalHeight || img.height

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width)
      width = maxDim
    } else {
      width = Math.round((width * maxDim) / height)
      height = maxDim
    }
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return img.src

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}

/**
 * Detect the dominant background color by sampling perimeter pixels
 * (corners and edge points) of the image.
 */
function sampleBackgroundColor(data: Uint8ClampedArray, width: number, height: number): BackgroundSample {
  const samplePoints: Array<[number, number]> = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
    [Math.floor(width / 2), height - 3],
    [2, Math.floor(height / 2)],
    [width - 3, Math.floor(height / 2)],
  ]

  let totalR = 0
  let totalG = 0
  let totalB = 0
  let count = 0

  for (const [x, y] of samplePoints) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (y * width + x) * 4
      const a = data[idx + 3]
      // Only sample opaque or semi-opaque pixels
      if (a > 128) {
        totalR += data[idx]
        totalG += data[idx + 1]
        totalB += data[idx + 2]
        count++
      }
    }
  }

  if (count === 0) {
    // Default to pure white if already fully transparent or empty
    return { r: 255, g: 255, b: 255 }
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  }
}

/**
 * Intelligent client-side background removal algorithm.
 * Uses Euclidean color distance from edge samples with soft edge feathering.
 *
 * @param img The source image
 * @param tolerance Percentage tolerance (10 to 60, default 24)
 * @param customBg Optional explicit background color to remove
 */
export function removeBackground(
  img: HTMLImageElement,
  tolerance = 24,
  customBg?: BackgroundSample,
): string {
  const canvas = document.createElement('canvas')
  const width = img.naturalWidth || img.width
  const height = img.naturalHeight || img.height

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return img.src

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  const bg = customBg || sampleBackgroundColor(data, width, height)

  // Max distance in RGB space is ~441.67
  const thresholdDist = (tolerance / 100) * 441.67
  const featherRange = 12

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (a === 0) continue

    const dist = Math.hypot(r - bg.r, g - bg.g, b - bg.b)

    if (dist < thresholdDist) {
      data[i + 3] = 0 // completely transparent
    } else if (dist < thresholdDist + featherRange) {
      // Soft transition feathering to avoid jagged halo edges
      const factor = (dist - thresholdDist) / featherRange
      data[i + 3] = Math.round(a * factor)
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}
