from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from datasets import load_dataset
from tqdm import tqdm

dataset_name = "benjis/diversevul"
model_name = "sudonite/Codetective-T5"

test_data = load_dataset(dataset_name, split="test")

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

good_vuln = 0
good_not_vuln = 0
bad_vuln = 0
bad_not_vuln = 0

vuln_num = len([d for d in test_data if len(d["cwe"]) != 0])
not_vuln_num = len([d for d in test_data if len(d["cwe"]) == 0])

for data in tqdm(test_data):
    inputs = tokenizer(data["func"], return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(**inputs)
    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    if len(data["cwe"]) == 0 and output_text == "CWE0":
        good_not_vuln += 1
    elif len(data["cwe"]) != 0 and output_text != "CWE0":
        good_vuln += 1
    elif len(data["cwe"]) != 0 and output_text == "CWE0":
        bad_vuln += 1
    elif len(data["cwe"]) == 0 and output_text != "CWE0":
        bad_not_vuln += 1

print(f"Good vulnerable: {good_vuln}/{vuln_num} ({round(good_vuln*100/vuln_num, 2)}%)")
print(f"Good not vulnerable: {good_not_vuln}/{not_vuln_num} ({round(good_not_vuln*100/not_vuln_num, 2)}%)")
print(f"Bad vulnerable: {bad_vuln} db")
print(f"Bad not vulnerable: {bad_not_vuln} db")