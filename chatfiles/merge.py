from PyPDF2 import PdfMerger
import os


def merge_pdfs(file_paths, output_dir, output_filename):
    merger = PdfMerger()
    for file_path in file_paths:
        merger.append(file_path)
    output_path = os.path.join(output_dir, output_filename)
    merger.write(output_path)
    merger.close()
