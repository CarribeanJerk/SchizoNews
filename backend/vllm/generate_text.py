# Import the pipeline helper from transformers
from transformers import pipeline

# Load the model using the pipeline
pipe = pipeline("text-generation", model="lesserfield/gpt2-4chan-mini")

# Input text to generate from
input_text = "Once upon a time, in a world of AI,"

# Generate text with the pipeline
output = pipe(input_text, max_length=50, num_return_sequences=1)

# Print the generated text
print("Generated Text:")
print(output[0]["generated_text"])
