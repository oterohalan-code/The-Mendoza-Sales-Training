import jsPDF from 'jspdf';
import { SimulationResult, UserProgress } from '../types';

export const generateIntegralReport = async (progress: UserProgress) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 0;

  // Helper for drawing rounded rectangles
  const roundedRect = (x: number, y: number, w: number, h: number, r: number, style: string) => {
    doc.roundedRect(x, y, w, h, r, r, style);
  };

  // Background - Solid Black
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Gradient Glows
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
  doc.setFillColor(16, 185, 129); // Emerald glow
  doc.circle(0, 0, 100, 'F');
  doc.setFillColor(197, 160, 89); // Gold glow
  doc.circle(pageWidth, 0, 80, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1.0 }));

  // Header
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 10, 20, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('THE MENDOZA', margin + 25, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('L A W   F I R M', margin + 25, 26);

  y = 40;
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE INTEGRAL DE RENDIMIENTO', margin, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generado el ${new Date().toLocaleDateString()} - Análisis de ${progress.totalSimulations} sesiones`, margin, y);

  y += 15;

  // Global Stats Card
  doc.setFillColor(20, 20, 20);
  roundedRect(margin, y, pageWidth - (margin * 2), 40, 2, 'F');
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.2);
  roundedRect(margin, y, pageWidth - (margin * 2), 40, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('PROMEDIO GLOBAL', margin + 15, y + 15);
  doc.text('SESIONES TOTALES', margin + 75, y + 15);
  doc.text('NIVEL MÁXIMO', margin + 135, y + 15);

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`${Math.round(progress.averageScore)}%`, margin + 15, y + 28);
  doc.text(`${progress.totalSimulations}`, margin + 75, y + 28);
  doc.text(`${progress.highestLevelPassed || 'N/A'}`, margin + 135, y + 28);

  y += 55;

  // Metrics Analysis
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text('Análisis de Áreas de Oportunidad', margin, y);
  
  y += 10;
  
  // Calculate average metrics
  const avgMetrics: any = {
    tonality: 0,
    activeListening: 0,
    objectionHandling: 0,
    nepqLevel: 0,
    pacing: 0,
    confidence: 0,
    questioningQuality: 0,
    closingAbility: 0,
    rapportBuilding: 0
  };

  if (progress.history.length > 0) {
    progress.history.forEach(res => {
      Object.keys(avgMetrics).forEach(key => {
        avgMetrics[key] += (res.metrics as any)[key] || 0;
      });
    });
    Object.keys(avgMetrics).forEach(key => {
      avgMetrics[key] = Math.round(avgMetrics[key] / progress.history.length);
    });
  }

  const metricLabels: any = {
    tonality: 'Tonalidad',
    activeListening: 'Escucha Activa',
    objectionHandling: 'Manejo de Objeciones',
    nepqLevel: 'Nivel NEPQ',
    pacing: 'Ritmo/Pacing',
    confidence: 'Confianza',
    questioningQuality: 'Calidad de Preguntas',
    closingAbility: 'Habilidad de Cierre',
    rapportBuilding: 'Rapport'
  };

  doc.setFontSize(8);
  Object.entries(avgMetrics).forEach(([key, val]: [string, any], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const posX = margin + (col * 85);
    const posY = y + (row * 15);

    doc.setTextColor(200, 200, 200);
    doc.text(metricLabels[key], posX, posY);
    
    doc.setFillColor(40, 40, 40);
    doc.rect(posX, posY + 2, 60, 2, 'F');
    
    const barColor = val >= 85 ? [16, 185, 129] : val >= 70 ? [197, 160, 89] : [239, 68, 68];
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.rect(posX, posY + 2, (val / 100) * 60, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.text(`${val}%`, posX + 65, posY + 4);
  });

  y += (Math.ceil(Object.keys(avgMetrics).length / 2) * 15) + 20;

  // Evolution Chart (Simplified as a list of last 5 sessions)
  doc.setFontSize(14);
  doc.setTextColor(197, 160, 89);
  doc.text('Historial Reciente de Evolución', margin, y);
  
  y += 10;
  const lastSessions = [...progress.history].reverse().slice(0, 5);
  
  lastSessions.forEach((s, i) => {
    doc.setFillColor(25, 25, 25);
    doc.rect(margin, y, pageWidth - (margin * 2), 12, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(new Date(s.date).toLocaleDateString(), margin + 5, y + 8);
    doc.text(s.level, margin + 40, y + 8);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`Score: ${s.score}`, margin + 80, y + 8);
    
    const statusText = s.passed ? 'APROBADO' : 'REPROBADO';
    const statusColor = s.passed ? [16, 185, 129] : [239, 68, 68];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, pageWidth - margin - 30, y + 8);
    
    y += 15;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Mendoza Law Firm - Reporte Integral Confidencial', pageWidth / 2, pageHeight - 10, { align: 'center' });

  doc.save(`Reporte_Integral_Mendoza_${new Date().getTime()}.pdf`);
};

export const generateSessionPDF = async (result: SimulationResult) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 0;

  // Helper for drawing rounded rectangles
  const roundedRect = (x: number, y: number, w: number, h: number, r: number, style: string) => {
    doc.roundedRect(x, y, w, h, r, r, style);
  };

  // Background - Solid Black
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Gradient Glows (Simulated with circles)
  doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
  doc.setFillColor(16, 185, 129); // Emerald glow
  doc.circle(0, 0, 80, 'F');
  doc.setFillColor(197, 160, 89); // Gold glow
  doc.circle(pageWidth, 0, 60, 'F');
  doc.setFillColor(0, 46, 93); // Navy glow
  doc.circle(pageWidth, pageHeight, 100, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1.0 }));

  // Logo Section (Professional Branding)
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 10, 20, 8, 'F'); // White circle for logo background
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('THE MENDOZA', margin + 25, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // Emerald for subtext
  doc.text('L A W   F I R M', margin + 25, 26);

  doc.setDrawColor(16, 185, 129); // Emerald line
  doc.line(margin, 30, pageWidth - margin, 30);

  y = 45;

  // Main Info Card
  doc.setFillColor(20, 20, 20);
  roundedRect(margin, y, pageWidth - (margin * 2), 35, 2, 'F');
  doc.setDrawColor(16, 185, 129); // Emerald border
  doc.setLineWidth(0.1);
  roundedRect(margin, y, pageWidth - (margin * 2), 35, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('FECHA', margin + 10, y + 12);
  doc.text('DIFICULTAD', margin + 60, y + 12);
  doc.text('RESULTADO', margin + 110, y + 12);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(result.date).toLocaleDateString(), margin + 10, y + 20);
  doc.text(result.level.toUpperCase(), margin + 60, y + 20);
  
  const statusColor = result.passed ? [16, 185, 129] : [239, 68, 68];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(result.passed ? 'APROBADO' : 'REPROBADO', margin + 110, y + 20);

  // Score Badge
  doc.setFillColor(16, 185, 129); // Emerald badge
  roundedRect(pageWidth - margin - 25, y + 8, 20, 20, 2, 'F');
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(14);
  doc.text(`${result.score}`, pageWidth - margin - 20, y + 19);
  doc.setFontSize(6);
  doc.text('SCORE', pageWidth - margin - 20, y + 24);

  y += 50;

  // Metrics Section
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129); // Emerald title
  doc.setFont('helvetica', 'bold');
  doc.text('Dashboard de Rendimiento', margin, y);
  y += 12;

  const metrics = [
    { label: 'Tonalidad', value: result.metrics.tonality },
    { label: 'Escucha Activa', value: result.metrics.activeListening },
    { label: 'Manejo de Objeciones', value: result.metrics.objectionHandling },
    { label: 'Nivel NEPQ', value: result.metrics.nepqLevel },
    { label: 'Ritmo/Pacing', value: result.metrics.pacing },
    { label: 'Confianza', value: result.metrics.confidence },
    { label: 'Calidad de Preguntas', value: result.metrics.questioningQuality },
    { label: 'Habilidad de Cierre', value: result.metrics.closingAbility },
    { label: 'Rapport', value: result.metrics.rapportBuilding },
  ];

  if (result.metrics.compliance !== undefined) {
    metrics.push({ label: 'Compliance', value: result.metrics.compliance });
  }
  if (result.metrics.evidenceGathering !== undefined) {
    metrics.push({ label: 'Evidencias', value: result.metrics.evidenceGathering });
  }

  doc.setFontSize(8);
  metrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const posX = margin + (col * 85);
    const posY = y + (row * 14);

    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text(m.label, posX, posY);
    
    // Bar Background
    doc.setFillColor(40, 40, 40);
    doc.rect(posX, posY + 2, 60, 2, 'F');
    
    // Bar Fill
    const barColor = m.value >= 85 ? [16, 185, 129] : m.value >= 70 ? [197, 160, 89] : [239, 68, 68];
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.rect(posX, posY + 2, (m.value / 100) * 60, 2, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${m.value}%`, posX + 65, posY + 4);
  });

  y += (Math.ceil(metrics.length / 2) * 14) + 15;

  // Feedback Section
  doc.setFillColor(20, 20, 20);
  roundedRect(margin, y, pageWidth - (margin * 2), 45, 2, 'F');
  doc.setDrawColor(16, 185, 129); // Emerald border
  doc.setLineWidth(0.2);
  roundedRect(margin, y, pageWidth - (margin * 2), 45, 2, 'S');

  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // Emerald title
  doc.setFont('helvetica', 'bold');
  doc.text('Feedback Estratégico de Sab', margin + 10, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(220, 220, 220);
  doc.setFont('helvetica', 'italic');
  const feedbackLines = doc.splitTextToSize(`"${result.feedback}"`, pageWidth - (margin * 2) - 20);
  doc.text(feedbackLines, margin + 10, y + 18);

  y += 50;

  // Transcript Section
  if (result.transcript && result.transcript.length > 0) {
    if (y > pageHeight - 40) {
      doc.addPage();
      // Redraw background for new page
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(197, 160, 89);
    doc.setFont('helvetica', 'bold');
    doc.text('Transcripción de la Sesión', margin, y);
    y += 12;

    result.transcript.forEach((t) => {
      const isAgent = t.role === 'user';
      const prefix = isAgent ? 'AGENTE: ' : 'CLIENTE: ';
      const text = prefix + t.text;
      const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - 15);
      const blockHeight = (lines.length * 5) + 8;

      if (y + blockHeight > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        y = 20;
      }

      // Bubble
      doc.setFillColor(isAgent ? 25 : 35, isAgent ? 25 : 35, isAgent ? 35 : 45);
      doc.setDrawColor(isAgent ? 197 : 60, isAgent ? 160 : 60, isAgent ? 89 : 60);
      roundedRect(margin, y, pageWidth - (margin * 2), blockHeight - 2, 1, 'FD');

      doc.setFontSize(8.5);
      doc.setTextColor(isAgent ? 255 : 200, isAgent ? 255 : 200, isAgent ? 255 : 200);
      doc.setFont('helvetica', isAgent ? 'bold' : 'normal');
      doc.text(lines, margin + 5, y + 6);
      
      y += blockHeight;
    });
  }

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Mendoza Law Firm - Reporte de Entrenamiento - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`Reporte_Mendoza_${result.level}_${new Date().getTime()}.pdf`);
};
