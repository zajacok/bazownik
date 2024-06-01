#!/bin/bash

# Specify the number of files you want to create
NUM_FILES=200  # Change this number to create more or fewer files
CONTENT="Question:

Correct Answer:
Notes:"  # Change content as needed

for ((i = 101; i <= NUM_FILES; i++)); do
    FILENAME="question${i}.txt"
    echo "$CONTENT" > "$FILENAME"
    echo "Created file: $FILENAME"
done

echo "All files created successfully."
