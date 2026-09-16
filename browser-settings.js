(function browserSettings() {
  const options = [
    { key: 'stardensity', label: 'Densità stelle (%)', type: 'range', value: 200, min: 0, max: 300 },
    { key: 'skycolor', label: 'Colore sfondo', type: 'color', value: '#030405' },
    { key: 'coloredstars', label: 'Stelle colorate', type: 'checkbox', value: true },
    { key: 'orbitstyle', label: 'Aspetto orbite', type: 'select', value: 'full', choices: [['full', 'Orbita completa'], ['trail', 'Scia'], ['hidden', 'Nascoste']] },
    { key: 'pathopacity', label: 'Opacità orbite (%)', type: 'range', value: 36, min: 0, max: 100 },
    { key: 'motionspeed', label: 'Velocità movimento (%)', type: 'range', value: 100, min: 25, max: 300 },
    { key: 'fullsystemscale', label: 'Dimensione sistema (%)', type: 'range', value: 82, min: 50, max: 150 },
    { key: 'clocksize', label: 'Dimensione orologio (px)', type: 'range', value: 42, min: 24, max: 100 },
    { key: 'clocktop', label: 'Orologio · alto', type: 'text', value: '2.5%' },
    { key: 'clockleft', label: 'Orologio · sinistra', type: 'text', value: '50%' },
    { key: 'strangerenabled', label: 'Mostra lo Straniero', type: 'checkbox', value: true },
    { key: 'strangershadowonly', label: 'Solo ombra dello Straniero', type: 'checkbox', value: false, dependsOn: 'strangerenabled' },
    { key: 'strangerspeed', label: 'Velocità Straniero (%)', type: 'range', value: 50, min: 10, max: 200, dependsOn: 'strangerenabled' },
    { key: 'quantumautoshift', label: 'Spostamento automatico Luna Quantica', type: 'checkbox', value: true },
    { key: 'quantumshiftseconds', label: 'Secondi fra spostamenti', type: 'range', value: 30, min: 1, max: 120, dependsOn: 'quantumautoshift' },
    { key: 'loopenabled', label: 'Loop', type: 'checkbox', value: true },
    { key: 'looptriggermode', label: 'Avvio supernova', type: 'select', value: 'timer', choices: [['timer', 'Dopo 22 minuti'], ['hour', 'Allo scoccare dell’ora']], dependsOn: 'loopenabled' },
    { key: 'loopcountdown', label: 'Mostra conto alla rovescia', type: 'checkbox', value: true, dependsOn: 'loopenabled' },
    { key: 'loopacceleration', label: 'Velocità loop (%)', type: 'range', value: 100, min: 100, max: 3000, dependsOn: 'loopenabled' },
    { key: 'meteoritesenabled', label: 'Meteoriti di Hollow’s Lantern', type: 'checkbox', value: true, dependsOn: 'loopenabled' },
    { key: 'giantslightningenabled', label: 'Fulmini rossi di Giant’s Deep', type: 'checkbox', value: true }
  ];

  const params = new URLSearchParams(window.location.search);
  const optionKeys = new Set(options.map(option => option.key));
  const showPanel = params.has('settings');
  const hasBrowserOptions = options.some(option => params.has(option.key));
  if (!showPanel && !hasBrowserOptions) return;

  function parseValue(option, rawValue) {
    if (option.type === 'checkbox') {
      if (rawValue === '1' || rawValue === 'true') return true;
      if (rawValue === '0' || rawValue === 'false') return false;
      return option.value;
    }
    if (option.type === 'range') {
      const value = Number(rawValue);
      return Number.isFinite(value) ? Math.min(option.max, Math.max(option.min, value)) : option.value;
    }
    if (option.type === 'color') return /^#[0-9a-f]{6}$/i.test(rawValue) ? rawValue : option.value;
    if (option.type === 'select') return option.choices.some(([value]) => value === rawValue) ? rawValue : option.value;
    return rawValue || option.value;
  }

  function propertyValue(option, value) {
    if (option.type !== 'color') return value;
    return [1, 3, 5].map(index =>
      (parseInt(value.slice(index, index + 2), 16) / 255).toFixed(6)
    ).join(' ');
  }

  function apply(option, value) {
    window.wallpaperPropertyListener?.applyUserProperties({
      [option.key]: { value: propertyValue(option, value) }
    });
  }

  const values = new Map();
  for (const option of options) {
    const value = params.has(option.key) ? parseValue(option, params.get(option.key)) : option.value;
    values.set(option.key, value);
    if (showPanel || params.has(option.key)) apply(option, value);
  }

  if (!showPanel) return;

  const panel = document.createElement('aside');
  panel.className = 'browser-settings';
  panel.setAttribute('aria-label', 'Impostazioni wallpaper');
  panel.innerHTML = `
    <div class="browser-settings__header">
      <h1 class="browser-settings__title">Impostazioni</h1>
      <button class="browser-settings__close" type="button" aria-label="Nascondi impostazioni">×</button>
    </div>
    <form class="browser-settings__form"></form>
    <div class="browser-settings__actions">
      <button class="browser-settings__button browser-settings__reset" type="button">Ripristina</button>
      <button class="browser-settings__button browser-settings__copy" type="button">Copia link</button>
    </div>`;
  document.body.append(panel);

  const reopen = document.createElement('button');
  reopen.className = 'browser-settings__reopen';
  reopen.type = 'button';
  reopen.textContent = '⚙ Impostazioni';
  reopen.hidden = true;
  document.body.append(reopen);

  const form = panel.querySelector('form');
  form.addEventListener('submit', event => event.preventDefault());
  const controls = new Map();
  const fields = new Map();

  function updateDependencies() {
    for (const option of options) {
      if (option.dependsOn) fields.get(option.key).hidden = !values.get(option.dependsOn);
    }
  }

  function updateUrl() {
    const next = new URLSearchParams(window.location.search);
    next.set('settings', '');
    for (const option of options) {
      const value = values.get(option.key);
      next.set(option.key, option.type === 'checkbox' ? (value ? '1' : '0') : String(value));
    }
    const query = next.toString().replace(/^settings=(?:&|$)/, 'settings&');
    history.replaceState(null, '', `${window.location.pathname}?${query}${window.location.hash}`);
  }

  function syncControl(option, value) {
    const control = controls.get(option.key);
    if (option.type === 'checkbox') control.checked = value;
    else control.value = value;
    const output = fields.get(option.key).querySelector('.browser-settings__value');
    if (output) output.textContent = value;
  }

  for (const option of options) {
    const field = document.createElement('label');
    field.className = 'browser-settings__field';
    field.innerHTML = `<span class="browser-settings__label"></span>`;
    field.querySelector('span').textContent = option.label;

    const control = document.createElement(option.type === 'select' ? 'select' : 'input');
    control.name = option.key;
    if (option.type === 'select') {
      for (const [value, label] of option.choices) {
        const choice = document.createElement('option');
        choice.value = value;
        choice.textContent = label;
        control.append(choice);
      }
    } else {
      control.type = option.type;
      if (option.type === 'range') {
        control.min = option.min;
        control.max = option.max;
        control.step = 1;
        const output = document.createElement('output');
        output.className = 'browser-settings__value';
        field.append(output);
      }
    }
    field.append(control);
    form.append(field);
    controls.set(option.key, control);
    fields.set(option.key, field);
    syncControl(option, values.get(option.key));

    const eventName = option.type === 'range' || option.type === 'color' ? 'input' : 'change';
    control.addEventListener(eventName, () => {
      const value = option.type === 'checkbox' ? control.checked : parseValue(option, control.value);
      values.set(option.key, value);
      syncControl(option, value);
      apply(option, value);
      updateDependencies();
      updateUrl();
    });
  }

  updateDependencies();
  updateUrl();

  panel.querySelector('.browser-settings__close').addEventListener('click', () => {
    panel.hidden = true;
    reopen.hidden = false;
  });
  reopen.addEventListener('click', () => {
    panel.hidden = false;
    reopen.hidden = true;
  });
  panel.querySelector('.browser-settings__reset').addEventListener('click', () => {
    for (const option of options) {
      values.set(option.key, option.value);
      syncControl(option, option.value);
      apply(option, option.value);
    }
    updateDependencies();
    updateUrl();
  });
  panel.querySelector('.browser-settings__copy').addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(window.location.href);
      button.textContent = 'Link copiato';
    } catch (error) {
      window.prompt('Copia questo link:', window.location.href);
    }
    setTimeout(() => { button.textContent = 'Copia link'; }, 1600);
  });
})();
