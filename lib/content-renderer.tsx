// Function to detect if a line is likely a list item
function isLikelyListItem(line: string, index: number, allLines: string[]): boolean {
  const trimmedLine = line.trim();
  
  // Skip empty lines
  if (!trimmedLine) return false;
  
  // Skip if it's already a heading
  if (trimmedLine.startsWith('#')) return false;
  
  // Skip if it's already a list marker
  if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || /^\d+\.\s/.test(trimmedLine)) {
    return false; // Already handled by other patterns
  }
  
  // Check if it looks like a list item based on patterns
  const hasColonPattern = /^[A-Z][^:]*:/.test(trimmedLine); // "Title: Description" pattern
  const hasShortLength = trimmedLine.length < 120; // Short lines are more likely to be list items
  const hasTitleCase = /^[A-Z]/.test(trimmedLine); // Starts with capital letter
  const hasBulletPattern = /\*\*•\*\*/.test(trimmedLine); // Has **•** pattern
  const endsWithPunctuation = /[.!?]$/.test(trimmedLine); // Ends with sentence punctuation
  
  // Check if the previous and next lines are also likely list items
  const prevLine = index > 0 ? allLines[index - 1].trim() : '';
  const nextLine = index < allLines.length - 1 ? allLines[index + 1].trim() : '';
  
  const prevIsListItem = prevLine && !prevLine.startsWith('#') && !prevLine.startsWith('-') && !prevLine.startsWith('*') && !/^\d+\./.test(prevLine) && prevLine.length < 120 && !/[.!?]$/.test(prevLine);
  const nextIsListItem = nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('-') && !nextLine.startsWith('*') && !/^\d+\./.test(nextLine) && nextLine.length < 120 && !/[.!?]$/.test(nextLine);
  
  // Check if previous line was a heading (h1-h6)
  const prevWasHeading = index > 0 && /^#{1,6}\s/.test(allLines[index - 1].trim());
  
  // If it has a colon pattern and is short, it's likely a list item
  if (hasColonPattern && hasShortLength) return true;
  
  // If it has bullet pattern, it's definitely a list item
  if (hasBulletPattern) return true;
  
  // If it's very short (under 60 chars) and doesn't end with punctuation, likely a list item
  if (trimmedLine.length < 60 && !endsWithPunctuation) {
    // Especially if it follows a heading or other list items
    if (prevWasHeading || prevIsListItem || nextIsListItem) return true;
  }
  
  // If it ends with sentence punctuation and is longer than 50 chars, it's a sentence, not a list item
  if (endsWithPunctuation && trimmedLine.length > 50) {
    return false;
  }
  
  // If it's in a sequence of similar lines, it's likely a list item
  // But only if they don't end with punctuation (sentences)
  if (hasTitleCase && hasShortLength && !endsWithPunctuation && (prevIsListItem || nextIsListItem)) return true;
  
  // If it follows a heading and is short without punctuation, likely a list item
  // But be conservative - if it ends with punctuation and is long, it's a sentence
  if (prevWasHeading && hasShortLength && !endsWithPunctuation && hasTitleCase) return true;
  
  return false;
}

// Function to detect content type more accurately
function detectContentType(content: string): 'html' | 'markdown' | 'plain' {
  const trimmedContent = content.trim();
  
  // Check for HTML tags first
  const hasHtmlTags = /<[^>]*>/g.test(trimmedContent);
  
  if (hasHtmlTags) {
    // Check if it's well-formed HTML with proper structure
    const hasProperHtmlStructure = /<h[1-6][^>]*>.*?<\/h[1-6]>/g.test(trimmedContent) || 
                                  /<ul[^>]*>.*?<\/ul>/g.test(trimmedContent) ||
                                  /<ol[^>]*>.*?<\/ol>/g.test(trimmedContent) ||
                                  /<p[^>]*>.*?<\/p>/g.test(trimmedContent) ||
                                  /<div[^>]*>.*?<\/div>/g.test(trimmedContent) ||
                                  /<span[^>]*>.*?<\/span>/g.test(trimmedContent);
    
    if (hasProperHtmlStructure) {
      return 'html';
    }
  }
  
  // Check for markdown patterns (more comprehensive)
  const hasMarkdownHeadings = /^#{1,6}\s+/gm.test(trimmedContent);
  const hasMarkdownLists = /^[\s]*[-*+]\s+/gm.test(trimmedContent) || /^[\s]*\d+\.\s+/gm.test(trimmedContent);
  const hasMarkdownLinks = /\[.*?\]\(.*?\)/g.test(trimmedContent);
  const hasMarkdownBold = /\*\*.*?\*\*/g.test(trimmedContent) || /__.*?__/g.test(trimmedContent);
  const hasMarkdownItalic = /\*.*?\*/g.test(trimmedContent) || /_.*?_/g.test(trimmedContent);
  const hasMarkdownCode = /`.*?`/g.test(trimmedContent) || /```[\s\S]*?```/g.test(trimmedContent);
  const hasMarkdownBlockquotes = /^>\s+/gm.test(trimmedContent);
  
  if (hasMarkdownHeadings || hasMarkdownLists || hasMarkdownLinks || hasMarkdownBold || hasMarkdownItalic || hasMarkdownCode || hasMarkdownBlockquotes) {
    return 'markdown';
  }
  
  // If content has line breaks and multiple paragraphs, treat as plain text that needs formatting
  const hasMultipleLines = trimmedContent.includes('\n');
  const hasParagraphs = trimmedContent.split('\n').filter(line => line.trim().length > 0).length > 1;
  
  if (hasMultipleLines && hasParagraphs) {
    return 'plain';
  }
  
  return 'plain';
}

// Function to parse markdown content with blog-style formatting
function parseMarkdown(content: string): string {
  const lines = content.split('\n');
  const processedLines = [];
  let inList = false;
  let inOrderedList = false;
  let listItems: string[] = [];
  let orderedListItems: string[] = [];
  let listItemCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      // Close any open lists
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (inOrderedList && orderedListItems.length > 0) {
        processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
      processedLines.push('<br>');
      continue;
    }
    
    // Handle headings
    if (trimmedLine.startsWith('###### ')) {
      closeLists();
      processedLines.push(`<h6 class="text-lg font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(7)}</h6>`);
    } else if (trimmedLine.startsWith('##### ')) {
      closeLists();
      processedLines.push(`<h5 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(6)}</h5>`);
    } else if (trimmedLine.startsWith('#### ')) {
      closeLists();
      processedLines.push(`<h4 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(5)}</h4>`);
    } else if (trimmedLine.startsWith('### ')) {
      closeLists();
      processedLines.push(`<h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>${trimmedLine.substring(4)}</h3>`);
    } else if (trimmedLine.startsWith('## ')) {
      closeLists();
      processedLines.push(`<h2 class="text-2xl font-bold text-slate-900 mb-3 mt-3 relative group"><div class="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div>${trimmedLine.substring(3)}</h2>`);
    } else if (trimmedLine.startsWith('# ')) {
      closeLists();
      processedLines.push(`<h1 class="text-3xl font-bold text-slate-900 mb-4 mt-4 relative"><div class="absolute -bottom-2 left-0 w-16 h-1 bg-escape-red rounded-full"></div>${trimmedLine.substring(2)}</h1>`);
    }
    // Handle unordered lists
    else if (trimmedLine.match(/^[\s]*[-*+]\s+/)) {
      if (inOrderedList) {
        processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const listItem = trimmedLine.replace(/^[\s]*[-*+]\s+/, '').trim();
      listItems.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(listItem)}</li>`);
    }
    // Handle list items that might not have standard markers but are clearly list items
    else if (isLikelyListItem(trimmedLine, i, lines)) {
      if (inOrderedList) {
        processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(trimmedLine)}</li>`);
    }
    // Handle ordered lists
    else if (trimmedLine.match(/^[\s]*\d+\.\s+/)) {
      if (inList) {
        processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (!inOrderedList) {
        inOrderedList = true;
        orderedListItems = [];
        listItemCounter = 1;
      }
      const listItem = trimmedLine.replace(/^[\s]*\d+\.\s+/, '').trim();
      orderedListItems.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(listItem)}</li>`);
      listItemCounter++;
    }
    // Handle paragraphs
    else {
      closeLists();
      
      // Split long paragraphs BEFORE applying inline markdown formatting
      // This ensures HTML tags aren't broken during splitting
      const paragraphParts = splitLongParagraph(trimmedLine, 200);
      paragraphParts.forEach((part, index) => {
        // Process inline markdown for each part
        const processedPart = processInlineMarkdown(part);
        // Add margin bottom to all but the last paragraph part
        const marginClass = index < paragraphParts.length - 1 ? 'mb-3' : 'mb-2';
        processedLines.push(`<p class="text-gray-700 ${marginClass} leading-relaxed text-lg">${processedPart}</p>`);
      });
    }
    
    function closeLists() {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (inOrderedList && orderedListItems.length > 0) {
        processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
    }
  }
  
  // Close any remaining lists
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
  }
  if (inOrderedList && orderedListItems.length > 0) {
    processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
  }
  
  return processedLines.join('');
}

// Function to split long paragraphs into shorter ones for better readability
// This function works on plain text (before HTML formatting is applied)
function splitLongParagraph(text: string, maxLength: number = 200): string[] {
  // If the paragraph is already short enough, return as is
  if (text.length <= maxLength) {
    return [text];
  }

  // Split by sentence endings (. ! ?) but preserve the punctuation
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // If we only have one sentence and it's still too long, try splitting by commas
  if (sentences.length === 1 && text.length > maxLength) {
    const commaSplit = text.split(/(, )/g);
    const parts: string[] = [];
    let currentPart = '';
    
    for (let i = 0; i < commaSplit.length; i++) {
      const segment = commaSplit[i];
      if (currentPart.length + segment.length <= maxLength) {
        currentPart += segment;
      } else {
        if (currentPart.trim()) parts.push(currentPart.trim());
        currentPart = segment;
      }
    }
    if (currentPart.trim()) parts.push(currentPart.trim());
    
    // Only split if we got meaningful parts (at least 2)
    if (parts.length > 1) {
      return parts;
    }
  }

  // Group sentences into paragraphs
  const paragraphs: string[] = [];
  let currentParagraph = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    // If adding this sentence would exceed maxLength, start a new paragraph
    if (currentParagraph && (currentParagraph.length + trimmedSentence.length + 1) > maxLength) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = trimmedSentence;
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + trimmedSentence;
    }
  }
  
  // Add the last paragraph
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }
  
  // If we couldn't split meaningfully, return original
  return paragraphs.length > 1 ? paragraphs : [text];
}

// Function to process inline markdown (bold, italic, links) with blog styling
function processInlineMarkdown(text: string): string {
  return text
    // Remove **•** as it's handled by the list structure
    .replace(/\*\*•\*\*/g, '')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$1</strong>')
    .replace(/__(.*?)__/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic text-escape-red-700 font-medium">$1</em>')
    .replace(/_(.*?)_/g, '<em class="italic text-escape-red-700 font-medium">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-escape-red hover:text-escape-red-700 underline decoration-escape-red/50 hover:decoration-escape-red transition-all duration-300 font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
    // Code
    .replace(/`([^`]+)`/g, '<code class="bg-escape-red/10 text-escape-red-800 px-2 py-1 rounded text-sm font-mono border border-escape-red/20">$1</code>');
}

// Function to detect if text content looks like a list
function detectListInText(text: string): { isList: boolean; items: string[] } {
  const lines = text.split(/\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length < 2) {
    return { isList: false, items: [] };
  }
  
  // Calculate average line length
  const avgLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  
  // Count lines with sentence-ending punctuation
  const linesWithPunctuation = lines.filter(line => /[.!?]$/.test(line)).length;
  const punctuationRatio = linesWithPunctuation / lines.length;
  
  // Check if lines are consistently short (list items) vs varied/long (paragraphs)
  const lineLengths = lines.map(line => line.length);
  const maxLength = Math.max(...lineLengths);
  const minLength = Math.min(...lineLengths);
  const lengthVariance = maxLength - minLength;
  
  // If average length is very long (over 100 chars), likely paragraphs
  if (avgLength > 100) {
    return { isList: false, items: [] };
  }
  
  // If most lines are long (over 70 chars) and end with punctuation, likely paragraphs
  const longLinesWithPunctuation = lines.filter(line => line.length > 70 && /[.!?]$/.test(line)).length;
  if (longLinesWithPunctuation / lines.length > 0.6) {
    return { isList: false, items: [] };
  }
  
  // Check if lines are short and structured (likely list items)
  const listLikeLines = lines.filter(line => {
    const length = line.length;
    const endsWithPunctuation = /[.!?]$/.test(line);
    
    // List items should be:
    // 1. Short (under 80 chars) AND don't end with sentence punctuation
    // 2. OR short (under 55 chars) even if they have punctuation (structured list items like "Bookings must be made online.")
    // 3. But NOT if they're longer descriptive sentences (over 65 chars with punctuation)
    
    if (length > 80) {
      return false; // Too long to be a list item
    }
    
    if (endsWithPunctuation) {
      // If it ends with punctuation and is over 65 chars, it's a descriptive sentence, not a list item
      if (length > 65) {
        return false; // Long descriptive sentence, not a list item
      }
      // Short structured items (under 55 chars) with punctuation can be list items
      // e.g., "Bookings must be made online." (35 chars) - this is a list item
      // vs "Recommended for ages 14 and older." (36 chars) - this might be borderline
      // vs "Younger players may participate with adult supervision." (54 chars) - this is a sentence
      return length <= 55;
    }
    
    // No punctuation and under 80 chars - likely a list item
    return true;
  });
  
  // Need at least 2 lines that look like list items
  if (listLikeLines.length < 2) {
    return { isList: false, items: [] };
  }
  
  // If most lines (60%+) look like list items, it's a list
  const listLikeRatio = listLikeLines.length / lines.length;
  if (listLikeRatio >= 0.6) {
    return { isList: true, items: lines };
  }
  
  // Special case: If all lines are short (under 55 chars) and similar in length, likely a list
  // This handles cases like "Booking Requirements" where items are structured but similar length
  // But exclude descriptive paragraphs like "Age Recommendations" which are longer
  if (avgLength < 55 && lengthVariance < 30 && lines.length >= 2) {
    // Exclude if they're all descriptive sentences (over 45 chars with punctuation)
    // Descriptive sentences like "Recommended for ages 14 and older." are longer
    const allDescriptiveSentences = lines.every(line => {
      const len = line.length;
      const hasPunctuation = /[.!?]$/.test(line);
      // If over 45 chars with punctuation, likely descriptive paragraph
      return len > 45 && hasPunctuation;
    });
    if (!allDescriptiveSentences) {
      return { isList: true, items: lines };
    }
  }
  
  // Additional check: If average is over 50 chars and lines vary significantly, likely paragraphs
  if (avgLength > 50 && lengthVariance > 25) {
    return { isList: false, items: [] };
  }
  
  return { isList: false, items: [] };
}

// Function to process HTML content with blog styling
function processHtmlContent(content: string): string {
  // First, handle paragraphs that contain headings followed by lists
  // Pattern: <p>Heading\n\nItem1\nItem2\nItem3</p>
  content = content.replace(/<p[^>]*>\s*([A-Z][^\n]+?)\s*\n\s*\n\s*((?:[^\n<]+(?:\n|$))+?)\s*<\/p>/gs, (match, heading, listContent) => {
    const listCheck = detectListInText(listContent);
    if (listCheck.isList && listCheck.items.length >= 2) {
      // Convert heading to h3 and list items to ul
      const listItems = listCheck.items.map(item => 
        `<li class="text-gray-700 leading-relaxed">${item}</li>`
      ).join('\n');
      return `<h3 class="text-xl font-semibold text-slate-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>${heading.trim()}</h3>\n<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">\n${listItems}\n</ul>`;
    }
    return match; // Return original if not a list
  });
  
  // Handle paragraphs that contain plain text lists (without headings)
  // Pattern: <p>Item1\nItem2\nItem3</p> or <p>\n<p>Item1\nItem2\nItem3</p>\n</p>
  content = content.replace(/<p[^>]*>\s*(?:<p[^>]*>)?\s*([^<]+?)\s*(?:<\/p>\s*)?<\/p>/gs, (match, pContent) => {
    // Skip if this was already processed as a heading+list
    if (match.includes('<h3')) return match;
    
    // Check if this looks like a list
    const listCheck = detectListInText(pContent);
    if (listCheck.isList && listCheck.items.length >= 2) {
      // Convert to HTML list
      const listItems = listCheck.items.map(item => 
        `<li class="text-gray-700 leading-relaxed">${item}</li>`
      ).join('\n');
      return `<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">\n${listItems}\n</ul>`;
    }
    // Not a list, return as paragraph
    return `<p class="text-gray-700 mb-2 leading-relaxed text-lg">${pContent.trim()}</p>`;
  });
  
  // Split content by headings and process each section
  const sections = content.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>)/g);
  let processedSections = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    // If it's a heading, keep it as is
    if (section.match(/^<h[1-6][^>]*>.*?<\/h[1-6]>$/)) {
      processedSections.push(section);
    } 
    // If it's text content, check if it's a list
    else if (section.trim()) {
      // Remove HTML tags to check the text content
      const textContent = section.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const lines = section.split(/\n/).map(line => line.replace(/<[^>]+>/g, '').trim()).filter(line => line.length > 0);
      
      // Check if this section contains a list pattern
      const listCheck = detectListInText(lines.join('\n'));
      if (listCheck.isList && listCheck.items.length >= 2) {
        // Convert to HTML list
        const listItems = listCheck.items.map(item => 
          `<li class="text-gray-700 leading-relaxed">${item}</li>`
        ).join('\n');
        processedSections.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">\n${listItems}\n</ul>`);
      } else {
        // Process as regular content - preserve HTML structure but apply styling
        // If it's just text without HTML tags, wrap in paragraph
        if (!section.match(/<[^>]+>/)) {
          processedSections.push(`<p class="text-gray-700 mb-2 leading-relaxed text-lg">${section.trim()}</p>`);
        } else {
          // Has HTML tags, process it
          processedSections.push(section);
        }
      }
    }
  }
  
  let fixedContent = processedSections.join('');
  
  // Fix malformed HTML where headings are inside paragraphs
    fixedContent = fixedContent.replace(/<p[^>]*>([^<]*<h[1-6][^>]*>.*?<\/h[1-6]>[^<]*)<\/p>/g, (match, pContent) => {
      // Extract headings and text separately
      const headingMatches = pContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/g) || [];
      const textParts = pContent.split(/<h[1-6][^>]*>.*?<\/h[1-6]>/);
      
      let result = '';
      for (let i = 0; i < textParts.length; i++) {
        if (textParts[i].trim()) {
          const text = textParts[i].trim();
          // Check if this text is a list
          const listCheck = detectListInText(text);
          if (listCheck.isList && listCheck.items.length >= 2) {
            const listItems = listCheck.items.map(item => 
              `<li class="text-gray-700 leading-relaxed">${item}</li>`
            ).join('\n');
            result += `<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">\n${listItems}\n</ul>`;
          } else {
            result += `<p class="text-gray-700 mb-2 leading-relaxed text-lg">${text}</p>`;
          }
        }
        if (headingMatches[i]) {
          result += headingMatches[i];
        }
      }
      return result;
    });
    
  // Apply blog-style classes to HTML elements
  fixedContent = fixedContent
    // H1 styling
    .replace(/<h1([^>]*)>(.*?)<\/h1>/g, '<h1 class="text-3xl font-bold text-slate-900 mb-4 mt-4 relative"><div class="absolute -bottom-2 left-0 w-16 h-1 bg-escape-red rounded-full"></div>$2</h1>')
    // H2 styling
    .replace(/<h2([^>]*)>(.*?)<\/h2>/g, '<h2 class="text-2xl font-bold text-slate-900 mb-3 mt-3 relative group"><div class="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div>$2</h2>')
    // H3 styling
    .replace(/<h3([^>]*)>(.*?)<\/h3>/g, '<h3 class="text-xl font-semibold text-slate-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>$2</h3>')
    // H4 styling
    .replace(/<h4([^>]*)>(.*?)<\/h4>/g, '<h4 class="text-lg font-semibold text-slate-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h4>')
    // H5 styling
    .replace(/<h5([^>]*)>(.*?)<\/h5>/g, '<h5 class="text-lg font-semibold text-slate-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h5>')
    // H6 styling
    .replace(/<h6([^>]*)>(.*?)<\/h6>/g, '<h6 class="text-base font-semibold text-slate-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h6>')
    // Paragraph styling - split long paragraphs for better readability
    .replace(/<p([^>]*)>(.*?)<\/p>/g, (match, attrs, content) => {
      // Remove existing HTML tags temporarily to check length
      const textContent = content.replace(/<[^>]+>/g, '').trim();
      if (textContent.length > 200) {
        // Split the paragraph by extracting text and preserving HTML structure
        // We'll split the plain text, then try to map back to HTML
        const paragraphParts = splitLongParagraph(textContent, 200);
        
        // If we successfully split, create multiple paragraphs
        if (paragraphParts.length > 1) {
          // For HTML content, we'll create new paragraphs with the split text
          // This is a simplified approach - for complex HTML, we preserve the original
          return paragraphParts.map((part, index) => {
            const marginClass = index < paragraphParts.length - 1 ? 'mb-3' : 'mb-2';
            // Apply inline markdown processing to preserve formatting
            const processedPart = processInlineMarkdown(part);
            return `<p class="text-gray-700 ${marginClass} leading-relaxed text-lg">${processedPart}</p>`;
          }).join('');
        }
      }
      return `<p class="text-gray-700 mb-2 leading-relaxed text-lg">${content}</p>`;
    })
    // Unordered list styling
    .replace(/<ul([^>]*)>(.*?)<\/ul>/g, '<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">$2</ul>')
    // Ordered list styling
    .replace(/<ol([^>]*)>(.*?)<\/ol>/g, '<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">$2</ol>')
    // List item styling for unordered lists
    .replace(/<li([^>]*)>(.*?)<\/li>/g, (match, attrs, content) => {
      // Simple styling for list items
      return `<li class="text-gray-700 leading-relaxed">${content}</li>`;
    })
    // Strong/bold styling
    .replace(/<strong([^>]*)>(.*?)<\/strong>/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$2</strong>')
    .replace(/<b([^>]*)>(.*?)<\/b>/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$2</strong>')
    // Italic/emphasis styling
    .replace(/<em([^>]*)>(.*?)<\/em>/g, '<em class="italic text-escape-red-700 font-medium">$2</em>')
    .replace(/<i([^>]*)>(.*?)<\/i>/g, '<em class="italic text-escape-red-700 font-medium">$2</em>')
    // Link styling
    .replace(/<a([^>]*href="[^"]*"[^>]*)>(.*?)<\/a>/g, '<a$1 class="text-escape-red hover:text-escape-red-700 underline decoration-escape-red/50 hover:decoration-escape-red transition-all duration-300 font-medium" target="_blank" rel="noopener noreferrer">$2</a>')
    // Code styling
    .replace(/<code([^>]*)>(.*?)<\/code>/g, '<code class="bg-escape-red/10 text-escape-red-800 px-2 py-1 rounded text-sm font-mono border border-escape-red/20">$2</code>');
  
  return fixedContent;
}

// Function to fix mojibake and clean problematic characters in real-time
function fixMojibakeRealtime(text: string): string {
  // Simple cleaning - just return the text as is since content-cleaner was removed
  return text
}

// Main function to render content with proper HTML and markdown support
function renderContent(content: string) {
  if (!content || content.trim() === '') {
    return <div className="text-gray-500 italic">No content available</div>;
  }
  
  // Fix mojibake in real-time before processing
  const cleanedContent = fixMojibakeRealtime(content);
  
  const contentType = detectContentType(cleanedContent);
  
  if (contentType === 'markdown') {
    const processedContent = parseMarkdown(cleanedContent);
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  } else if (contentType === 'html') {
    const processedContent = processHtmlContent(cleanedContent);
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    );
  } else {
    // Plain text - convert to HTML with proper formatting
    // First check if it might be markdown that wasn't detected
    const mightBeMarkdown = /^#{1,6}\s+/gm.test(cleanedContent) || 
                           /^[\s]*[-*+]\s+/gm.test(cleanedContent) || 
                           /^[\s]*\d+\.\s+/gm.test(cleanedContent);
    
    if (mightBeMarkdown) {
      // Re-process as markdown
      const processedContent = parseMarkdown(cleanedContent);
      return (
        <div 
          className="max-w-none"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );
    }
    
    const lines = cleanedContent.split('\n');
    const processedLines = [];
    let inList = false;
    let listItems: string[] = [];
    let inOrderedList = false;
    let orderedListItems: string[] = [];
    let listItemCounter = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push('<br>');
        continue;
      }
      
      // Handle headings that might not have been detected as markdown
      if (line.startsWith('## ')) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(`<h2 class="text-2xl font-bold text-slate-900 mb-3 mt-3 relative group"><div class="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div>${line.substring(3)}</h2>`);
      }
      else if (line.startsWith('### ')) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(`<h3 class="text-xl font-semibold text-slate-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>${line.substring(4)}</h3>`);
      }
      else if (line.startsWith('#### ')) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(`<h4 class="text-lg font-semibold text-slate-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${line.substring(5)}</h4>`);
      }
      // Handle bullet points
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        const listItem = line.substring(2).trim();
        listItems.push(`<li class="text-gray-700 leading-relaxed">${listItem}</li>`);
      }
      // Handle list items that might not have standard markers but are clearly list items
      else if (isLikelyListItem(line, i, lines)) {
        if (inOrderedList) {
          processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">${orderedListItems.join('')}</ol>`);
          orderedListItems = [];
          inOrderedList = false;
          listItemCounter = 1;
        }
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(`<li class="text-gray-700 leading-relaxed">${processInlineMarkdown(line)}</li>`);
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(`<ol class="list-decimal text-gray-700 mb-4 space-y-2 ml-6">`);
        let j = i;
        let counter = 1;
        while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
          const listItem = lines[j].replace(/^\d+\.\s/, '').trim();
          processedLines.push(`<li class="text-gray-700 leading-relaxed">${listItem}</li>`);
          j++;
          counter++;
        }
        processedLines.push(`</ol>`);
        i = j - 1;
      }
      // Handle paragraphs
      else {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        
        // Process inline markdown and split long paragraphs for better readability
        const processedLine = processInlineMarkdown(line);
        const paragraphParts = splitLongParagraph(processedLine, 200);
        paragraphParts.forEach((part, index) => {
          // Add margin bottom to all but the last paragraph part
          const marginClass = index < paragraphParts.length - 1 ? 'mb-3' : 'mb-2';
          processedLines.push(`<p class="text-gray-700 ${marginClass} leading-relaxed text-lg">${part}</p>`);
        });
      }
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
      processedLines.push(`<ul class="list-disc text-gray-700 mb-4 space-y-2 ml-6">${listItems.join('')}</ul>`);
    }
    
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedLines.join('') }}
      />
    );
  }
}

// Default export as ContentRenderer component
export default function ContentRenderer({ content }: { content: string }) {
  return renderContent(content)
}
