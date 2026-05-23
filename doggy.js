(function() {
  const runEngine = () => {
    const rawContainer = document.getElementById('raw-data');
    if (!rawContainer) return;

    const raw = rawContainer.textContent;
    const lines = raw.split('\n');
    let siteTitle = "Docs";
    const pages = {};
    let current = null;

    lines.forEach(l => {
      let t = l.trim();
      if (t.startsWith("title#")) { siteTitle = t.split("#")[1].trim(); return; }
      if (t.startsWith("bar#")) { current = t.split("#")[1].trim(); pages[current] = []; return; }
      if (current) {
        if (t.startsWith("page#")) l = "# " + t.split("#")[1].trim();
        if (t.startsWith("header#")) l = "## " + t.split("#")[1].trim();
        pages[current].push(l);
      }
    });

    document.documentElement.innerHTML = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteTitle}</title>
        <script src="https://jsdelivr.net"></script>
        <style>
          :root { --bg: #ffffff; --text: #1f2937; --sidebar: #f9fafb; --border: #e5e7eb; --accent: #2563eb; --code: #f3f4f6; }
          @media (prefers-color-scheme: dark) { :root { --bg: #0b0f19; --text: #f3f4f6; --sidebar: #111827; --border: #1f2937; --accent: #3b82f6; --code: #1f2937; } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; margin:0; }
          #sidebar { width: 260px; background: var(--sidebar); border-right: 1px solid var(--border); padding: 24px; flex-shrink: 0; }
          #sidebar h1 { font-size: 1.1rem; font-weight: 700; margin-bottom: 24px; color: var(--accent); }
          #sidebar ul { list-style: none; }
          #sidebar li { margin-bottom: 6px; font-size: 0.95rem; cursor: pointer; padding: 6px 12px; border-radius: 6px; opacity: 0.8; }
          #sidebar li:hover, #sidebar li.active { opacity: 1; background: var(--code); color: var(--accent); font-weight: 500; }
          #content { flex-grow: 1; padding: 40px 60px; max-width: 900px; line-height: 1.6; }
          #content h1 { font-size: 2.25rem; font-weight: 800; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 24px; }
          #content h2 { font-size: 1.5rem; margin: 32px 0 16px; font-weight: 600; }
          #content p { margin-bottom: 16px; opacity: 0.9; }
          #content code { font-family: monospace; background: var(--code); padding: 3px 6px; border-radius: 4px; font-size: 0.9em; }
          #content pre { background: var(--code); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 24px; border: 1px solid var(--border); }
          #content ul { margin: 0 0 16px 24px; }
          #content li { margin-bottom: 6px; }
          @media (max-width: 768px) { body { flex-direction: column; } #sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); } #content { padding: 24px; } }
        </style>
      </head>
      <body>
        <aside id="sidebar"><h1>${siteTitle}</h1><ul id="menu"></ul></aside>
        <main id="content"></main>
      </body>`;

    const menu = document.getElementById('menu');
    const content = document.getElementById('content');

    Object.keys(pages).forEach((p, i) => {
      const li = document.createElement('li');
      li.innerText = p;
      if (i === 0) {
        li.classList.add('active');
        content.innerHTML = marked.parse(pages[p].join('\n').trim());
      }
      li.onclick = () => {
        document.querySelectorAll('#menu li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        content.innerHTML = marked.parse(pages[p].join('\n').trim());
        window.scrollTo(0, 0);
      };
      menu.appendChild(li);
    });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runEngine);
  } else {
    runEngine();
  }
})();
