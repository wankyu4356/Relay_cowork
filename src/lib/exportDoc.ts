// 문서 내보내기 유틸 — 외부 의존성 없이 실제로 동작하는 두 경로:
//  1) downloadText: .txt 파일 다운로드 (Blob)
//  2) printAsPdf: 서식 적용된 인쇄 창 → 브라우저 "PDF로 저장"

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function printAsPdf(title: string, subtitle: string, body: string): boolean {
  const w = window.open('', '_blank', 'width=800,height=1000');
  if (!w) return false;
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>').replace(/</g, '&lt;').replace(/&lt;br\/&gt;/g, '<br/>')}</p>`)
    .join('');
  w.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"/>
<title>${title}</title>
<style>
  @page { margin: 24mm 20mm; }
  body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #18181b; line-height: 1.85; word-break: keep-all; }
  header { border-bottom: 2px solid #18181b; padding-bottom: 12px; margin-bottom: 28px; }
  h1 { font-size: 20px; margin: 0 0 4px; letter-spacing: -0.02em; }
  .sub { font-size: 12px; color: #71717a; }
  p { font-size: 13.5px; margin: 0 0 14px; }
  footer { margin-top: 32px; padding-top: 10px; border-top: 1px solid #e4e4e7; font-size: 10px; color: #a1a1aa; }
</style></head><body>
<header><h1>${title}</h1><div class="sub">${subtitle}</div></header>
${paragraphs}
<footer>RELAY — AI 초안 · 합격생 릴레이 플랫폼</footer>
<script>window.onload = () => { window.print(); };</script>
</body></html>`);
  w.document.close();
  return true;
}
