#!/usr/bin/env python3
import sys
import os
import glob

try:
    import PyPDF2
except ImportError:
    print("PyPDF2 not installed. Trying pypdf...")
    try:
        import pypdf as PyPDF2
    except ImportError:
        print("Please install PyPDF2 or pypdf: pip install pypdf")
        sys.exit(1)

# Find PDF file
pdf_files = glob.glob("*.pdf")
if not pdf_files:
    print("No PDF file found in current directory")
    sys.exit(1)

pdf_path = pdf_files[0]
print(f"Using PDF: {pdf_path}")

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    sys.exit(1)

try:
    with open(pdf_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        print(f"Total pages: {len(reader.pages)}\n")
        
        # Extract all pages and look for unit/chapter patterns
        all_text = []
        for i in range(len(reader.pages)):
            text = reader.pages[i].extract_text()
            if text.strip():
                all_text.append((i+1, text))
        
        print(f"Found text on {len(all_text)} pages\n")
        
        # Look for table of contents or unit markers
        for page_num, text in all_text[:50]:  # First 50 pages with text
            lines = text.split('\n')
            for line in lines:
                line = line.strip()
                if any(keyword in line.lower() for keyword in ['unit', 'chapter', 'lesson', 'page', 'contents', 'table', 'practice', 'exercise']):
                    if len(line) > 3 and len(line) < 200:  # Reasonable length
                        print(f"Page {page_num}: {line}")
        
        # Also print first few pages with substantial text
        print("\n=== Sample pages with text ===")
        for page_num, text in all_text[:5]:
            print(f"\n--- PAGE {page_num} ---")
            print(text[:500])
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

