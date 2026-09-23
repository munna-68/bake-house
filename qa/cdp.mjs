/**
 * Minimal CDP driver — plain WebSocket, no Playwright.
 *
 * Deliberately dependency-free so `node qa/run.mjs` works on a fresh clone with
 * nothing but `npm install` done.
 */
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export async function openBrowser({ port, baseUrl, width = 1440, height = 1000, scale = 1 } = {}) {
  const profile = `/tmp/bakehouse-qa-${port}`
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  let wsUrl = null
  for (let i = 0; i < 80 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl ?? null
    } catch {
      /* chrome not up yet */
    }
    if (!wsUrl) await sleep(250)
  }
  if (!wsUrl) {
    chrome.kill()
    throw new Error(`Chrome never exposed a page target on port ${port}`)
  }

  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.onopen = res
    ws.onerror = () => rej(new Error('CDP socket failed'))
  })

  let seq = 0
  const waiting = new Map()
  const consoleErrors = []
  const failedRequests = []

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && waiting.has(msg.id)) {
      waiting.get(msg.id)(msg)
      waiting.delete(msg.id)
      return
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ').split('\n')[0])
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails?.exception?.description?.split('\n')[0] ?? 'exception')
    }
    if (msg.method === 'Network.loadingFailed' && !msg.params.errorText?.includes('ERR_ABORTED')) {
      failedRequests.push(msg.params.errorText)
    }
  }

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++seq
      waiting.set(id, resolve)
      ws.send(JSON.stringify({ id, method, params }))
    })

  await send('Runtime.enable')
  await send('Network.enable')
  await send('Page.enable')
  await setViewport({ width, height, scale })

  async function setViewport({ width: w, height: h, scale: s = 1 }) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: s,
      mobile: w < 700,
    })
  }

  async function evaluate(expression) {
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (r.result?.exceptionDetails) {
      const d = r.result.exceptionDetails
      throw new Error(`${d.text} ${d.exception?.description ?? ''}`.trim())
    }
    return r.result?.result?.value
  }

  async function goto(path, settle = 1600) {
    await send('Page.navigate', { url: path.startsWith('http') ? path : `${baseUrl}${path}` })
    await sleep(settle)
  }

  async function reload(settle = 1600) {
    await evaluate('location.reload()').catch(() => {})
    await sleep(settle)
  }

  async function click(selector) {
    return evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.click();
      return true;
    })()`)
  }

  async function clickByText(text, tag = 'button') {
    return evaluate(`(() => {
      const want = ${JSON.stringify(text.toLowerCase())};
      const el = [...document.querySelectorAll(${JSON.stringify(tag)})]
        .find(b => (b.textContent || '').trim().toLowerCase().includes(want));
      if (!el) return false;
      el.click();
      return true;
    })()`)
  }

  async function key(keyName) {
    return evaluate(`(() => {
      const el = document.activeElement || document.body;
      for (const type of ['keydown', 'keyup']) {
        el.dispatchEvent(new KeyboardEvent(type, { key: ${JSON.stringify(keyName)}, bubbles: true }));
      }
      return true;
    })()`)
  }

  const readState = () => evaluate(`JSON.parse(localStorage.getItem('bakehouse.v1'))`)
  const seedState = (mutate) =>
    evaluate(`(() => {
      const raw = JSON.parse(localStorage.getItem('bakehouse.v1'));
      (${mutate})(raw);
      localStorage.setItem('bakehouse.v1', JSON.stringify(raw));
      return true;
    })()`)

  return {
    baseUrl,
    send,
    evaluate,
    goto,
    reload,
    click,
    clickByText,
    key,
    readState,
    seedState,
    setViewport,
    consoleErrors,
    failedRequests,
    async close() {
      ws.close()
      chrome.kill()
      await sleep(150)
    },
  }
}

export { sleep }
