(()=>{
    const $ = (selector) => document.querySelector(selector);
    const canvas = $('#canvas');
    const ctx = canvas.getContext('2d');
    const fields = ['cap', 'pcd', 'adet'];
    const tabs = [$('#center-tab'), $('#offcenter-tab')];

    function setTab(isCentered) {
      tabs[0].setAttribute('aria-selected', String(isCentered));
      tabs[1].setAttribute('aria-selected', String(!isCentered));
      $('#center-panel').classList.toggle('hidden', !isCentered);
      $('#offcenter-panel').hidden = isCentered;
      $('#offcenter-panel').classList.toggle('active', !isCentered);
    }
    tabs[0].addEventListener('click', () => setTab(true));
    tabs[1].addEventListener('click', () => setTab(false));

    function setError(id, message = '') {
      const input = $('#' + id);
      input.setAttribute('aria-invalid', Boolean(message));
      $('#' + id + '-error').textContent = message;
    }
    function values() {
      const cap = Number($('#cap').value);
      const pcd = Number($('#pcd').value);
      const adet = Number($('#adet').value);
      let valid = true;
      fields.forEach((id) => setError(id));
      if (!Number.isFinite(cap) || cap <= 0) { setError('cap', 'Geçerli bir parça çapı girin.'); valid = false; }
      if (!Number.isFinite(pcd) || pcd <= 0) { setError('pcd', 'Geçerli bir PCD değeri girin.'); valid = false; }
      if (!Number.isInteger(adet) || adet < 1 || adet > 360) { setError('adet', '1 ile 360 arasında tam sayı girin.'); valid = false; }
      if (valid && pcd > cap) { setError('pcd', 'PCD, parça çapından büyük olamaz.'); valid = false; }
      return valid ? { cap, pcd, adet } : null;
    }
    function draw({ cap, pcd, adet }) {
      const size = canvas.width, center = size / 2, padding = 54;
      const scale = (center - padding) / (cap / 2);
      const partRadius = cap / 2 * scale, pcdRadius = pcd / 2 * scale;
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#f6f9ff'; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--line').trim() || '#c7d1e2'; ctx.lineWidth = 1; ctx.setLineDash([3, 8]);
      ctx.beginPath(); ctx.moveTo(center, 24); ctx.lineTo(center, size - 24); ctx.moveTo(24, center); ctx.lineTo(size - 24, center); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--ink').trim() || '#19253c'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(center, center, partRadius, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#16a68b'; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.arc(center, center, pcdRadius, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--ink').trim() || '#19253c'; ctx.beginPath(); ctx.arc(center, center, 3.5, 0, Math.PI * 2); ctx.fill();
      const holes = [];
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
      const roundRect = (x, y, width, height, radius) => {
        ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
      };
      for (let i = 0; i < adet; i++) {
        const radians = i * 2 * Math.PI / adet, angle = i * 360 / adet;
        const x = pcd / 2 * Math.cos(radians), y = pcd / 2 * Math.sin(radians);
        const px = center + x * scale, py = center - y * scale;
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0c6154'; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
        const labelX = clamp(center + x * scale * 1.16, 54, size - 54);
        const labelY = clamp(center - y * scale * 1.16, 34, size - 34);
        ctx.strokeStyle = 'rgba(12, 97, 84, .38)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(labelX, labelY); ctx.stroke(); ctx.setLineDash([]);
        roundRect(labelX - 47, labelY - 22, 94, 44, 8); ctx.fillStyle = 'rgba(227, 255, 249, .94)'; ctx.fill();
        ctx.strokeStyle = 'rgba(22, 166, 139, .43)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#087563'; ctx.font = '800 9px system-ui';
        ctx.fillText(`X ${format(x)}`, labelX, labelY - 7); ctx.fillText(`Y ${format(y)}`, labelX, labelY + 5);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--ink').trim() || '#1f2e49'; ctx.font = '800 11px system-ui'; ctx.fillText(`#${i + 1}`, labelX, labelY + 17);
        holes.push({ number: i + 1, x, y });
      }
      return holes;
    }
    function format(number) { return (Math.abs(number) < 0.00001 ? 0 : number).toFixed(2); }
    function showResults(data) {
      const holes = draw(data);
      $('#table-body').replaceChildren(...holes.map(({ number, x, y }) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${number}</td><td>${format(x)}</td><td>${format(y)}</td>`;
        return row;
      }));
      $('#table-panel').classList.add('visible');
      $('#canvas-area').classList.add('is-ready');
      $('#result-status').textContent = `${data.adet} koordinat başarıyla hesaplandı`;
      $('#result-pcd').textContent = `PCD Ø ${format(data.pcd)} mm`;
      $('#count-label').textContent = `${data.adet} DELİK`;
    }
    $('#calculator').addEventListener('submit', (event) => { event.preventDefault(); const data = values(); if (data) showResults(data); });
    $('#clear').addEventListener('click', () => {
      $('#calculator').reset(); fields.forEach((id) => setError(id)); ctx.clearRect(0, 0, canvas.width, canvas.height);
      $('#table-panel').classList.remove('visible'); $('#canvas-area').classList.remove('is-ready');
      $('#result-status').textContent = 'Henüz hesaplama yapılmadı'; $('#result-pcd').textContent = '—'; $('#count-label').textContent = '0 DELİK';
    });
    fields.forEach((id) => $('#' + id).addEventListener('input', () => setError(id)));

})();

