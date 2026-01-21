import type { Dokument, Pacjent, WizytaDetail } from '../types/api';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type PdfPayload = {
  dokument: Dokument;
  pacjent?: Pacjent;
  wizyta?: WizytaDetail;
  tresc?: string;
  targetWindow?: Window | null;
};

export const openDocumentPdf = ({ dokument, pacjent, wizyta, tresc, targetWindow }: PdfPayload) => {
  const docTitleRaw = dokument.nazwaPliku || `Dokument #${dokument.dokumentId}`;
  const docTitle = docTitleRaw.endsWith('.txt') ? docTitleRaw.slice(0, -4) : docTitleRaw;
  const typ = dokument.typDokumentu || 'inne';
  const generatedAt = new Date().toLocaleString('pl-PL');

  const pacjentName = [pacjent?.imie, pacjent?.nazwisko].filter(Boolean).join(' ') || '-';
  const pacjentPesel = pacjent?.pesel || '-';
  const pacjentBirth = formatDate(pacjent?.dataUrodzenia);

  const lekarz = wizyta?.lekarz || '-';
  const specjalizacja = wizyta?.specjalizacja || '-';
  const placowka = wizyta?.placowka || '-';
  const dataWizyty = wizyta?.dataWizyty ? formatDateTime(wizyta.dataWizyty) : '-';
  const diagnoza = wizyta?.diagnoza || '-';

  const content = tresc?.trim() ? escapeHtml(tresc) : 'Brak tresci dokumentu.';

  const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(docTitle)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Sans+3:wght@400;500;600&display=swap');
    :root {
      color-scheme: light;
      --brand: #1673b2;
      --accent: #4cb4e3;
      --ink: #0f172a;
      --muted: #64748b;
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: "Source Sans 3", "Segoe UI", sans-serif;
      padding: 32px;
    }
    .page {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .logo span {
      font-family: "Playfair Display", serif;
      font-size: 28px;
      color: var(--brand);
      letter-spacing: 0.5px;
    }
    .logo small {
      color: var(--muted);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .doc-meta {
      text-align: right;
      font-size: 12px;
      color: var(--muted);
    }
    h1 {
      font-family: "Playfair Display", serif;
      font-size: 26px;
      margin: 0 0 6px 0;
      color: var(--ink);
    }
    .subtitle {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      background: #fbfdff;
    }
    .card h3 {
      margin: 0 0 8px 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .card p {
      margin: 0;
      font-size: 14px;
      color: var(--ink);
    }
    .content {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      background: #fdfefe;
      min-height: 200px;
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 14px;
    }
    .footer {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--muted);
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .page { box-shadow: none; border: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${window.location.origin}/logo.svg" alt="AliMed" style="width:48px;height:48px;" />
          <div>
            <span>AliMed</span>
            <small>Dokument medyczny</small>
          </div>
        </div>
      </div>
      <div class="doc-meta">
        <div>${escapeHtml(docTitle)}</div>
        <div>Typ: ${escapeHtml(typ)}</div>
        <div>Wygenerowano: ${escapeHtml(generatedAt)}</div>
      </div>
    </div>

    <h1>${escapeHtml(docTitle)}</h1>
    <div class="subtitle">Dokument powiazany z wizyta ${escapeHtml(String(dokument.wizytaId ?? '-'))}</div>

    <div class="grid">
      <div class="card">
        <h3>Pacjent</h3>
        <p>${escapeHtml(pacjentName)}</p>
        <p>PESEL: ${escapeHtml(pacjentPesel)}</p>
        <p>Data urodzenia: ${escapeHtml(pacjentBirth)}</p>
      </div>
      <div class="card">
        <h3>Wizyta</h3>
        <p>Data: ${escapeHtml(dataWizyty)}</p>
        <p>Placowka: ${escapeHtml(placowka)}</p>
        <p>Diagnoza: ${escapeHtml(diagnoza)}</p>
      </div>
      <div class="card">
        <h3>Lekarz</h3>
        <p>${escapeHtml(lekarz)}</p>
        <p>Specjalizacja: ${escapeHtml(specjalizacja)}</p>
      </div>
    </div>

    <div class="content">${content}</div>

    <div class="footer">
      <span>AliMed · Dokument medyczny</span>
      <span>ID dokumentu: ${escapeHtml(String(dokument.dokumentId))}</span>
    </div>
  </div>
  <script>
    window.onload = () => {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`;

  const win = targetWindow ?? window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
};
