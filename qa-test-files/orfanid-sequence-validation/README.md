# ORFanID sequence validation test files

Use these files to test the New Query sequence upload workflow.

1. Upload `protein_single_valid.fasta`, select Protein, and select Escherichia coli (562). The form should allow submission.
2. Upload `protein_multi_valid.fasta`, select Protein, and select Escherichia coli (562). The form should allow submission, with a possible organism warning for the second sequence header.
3. Upload `nucleotide_single_valid.fasta`, select Gene, and select Escherichia coli (562). The form should allow submission.
4. Upload `invalid_protein_characters.fasta`, select Protein, and select Escherichia coli (562). The form should block submission because the sequence contains invalid characters.
5. Upload `mismatch_protein_for_nucleotide_test.fasta`, select Gene, and select Escherichia coli (562). The form should block submission because the sequence looks like protein while Gene is selected.
