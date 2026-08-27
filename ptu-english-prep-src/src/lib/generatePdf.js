import { jsPDF } from 'jspdf'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Generates and downloads a PDF document containing quiz results with answers and explanations.
 * @param {Object} params - The quiz result parameters
 * @param {string} params.title - The title of the quiz
 * @param {number} params.score - The number of correct answers
 * @param {number} params.total - The total number of questions
 * @param {Array<Object>} params.questions - Array of question objects with question, options, selectedIndex, correctIndex, and explanation
 */
export function downloadQuizResultPdf({ title, score, total, questions }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 48
  const maxWidth = pageWidth - margin * 2
  let y = margin

  /**
   * Ensures there is enough vertical space on the current page, adds a new page if needed.
   * @param {number} lineHeight - The height required for the next content
   */
  function ensureSpace(lineHeight) {
    if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  /**
   * Writes text to the PDF with specified formatting and wrapping.
   * @param {string} text - The text to write
   * @param {number} fontSize - Font size in points
   * @param {string} [style='normal'] - Font style (normal, bold, italic)
   * @param {string} [color='#1E293B'] - Text color in hex format
   * @param {number} [lineGap=4] - Vertical spacing between lines
   * @param {number} [indent=0] - Left indentation in points
   */
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