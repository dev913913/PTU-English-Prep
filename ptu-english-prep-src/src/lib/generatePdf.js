import { jsPDF } from 'jspdf'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// questions: [{ question, options, selectedIndex, correctIndex, explanation }]
export function downloadQuizResultPdf({ title, score, total, questions }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 48
  const maxWidth = pageWidth - margin * 2
  let y = margin

  function ensureSpace(lineHeight) {
    if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  function writeLines(text, fontSize, style = 'normal', color = '#1E293B', lineGap = 4, indent = 0) {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    doc.setTextColor(color)
    const lines = doc.splitTextToSize(text, maxWidth - indent)
    lines.forEach((line) => {
      ensureSpace(fontSize + lineGap)
      doc.text(line, margin + indent, y)
      y += fontSize + lineGap
    })
  }

  writeLines(title, 18, 'bold', '#1F3D2B', 6)
  writeLines(`Score: ${score} / ${total}`, 13, 'normal', '#C9502C', 6)
  y += 10

  questions.forEach((q, i) => {
    ensureSpace(30)
    writeLines(`${i + 1}. ${q.question}`, 12, 'bold', '#1E293B', 4)

    q.options.forEach((opt, idx) => {
      const letter = OPTION_LETTERS[idx] || String(idx + 1)
      writeLines(`${letter}. ${opt}`, 11, 'normal', '#4B5563', 3, 14)
    })

    y += 2
    const correctLetter = OPTION_LETTERS[q.correctIndex] || String(q.correctIndex + 1)
    const selectedLetter = OPTION_LETTERS[q.selectedIndex] || String(q.selectedIndex + 1)
    const isCorrect = q.selectedIndex === q.correctIndex

    writeLines(
      `Your answer: ${selectedLetter}. ${q.options[q.selectedIndex]} ${isCorrect ? '(Correct)' : '(Incorrect)'}`,
      10.5,
      'normal',
      isCorrect ? '#166534' : '#C9502C',
      3,
      14
    )
    if (!isCorrect) {
      writeLines(`Correct answer: ${correctLetter}. ${q.options[q.correctIndex]}`, 10.5, 'normal', '#166534', 3, 14)
    }

    if (q.explanation) {
      writeLines(`Explanation: ${q.explanation}`, 10, 'italic', '#4B5563', 3, 14)
    }
    y += 10
  })

  doc.save(`${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-result.pdf`)
}