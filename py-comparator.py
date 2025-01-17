import time
FILE_1_PATH = './followers_1.json'
FILE_2_PATH = './following.json'
OUTPUT_FILE_PATH = 'output.json'

def load_json_data(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            data = file.read()
            return eval(data)  # Safely parses a well-formed JSON string
    except Exception as e:
        raise Exception(f"Error reading or parsing file {filepath}: {str(e)}")

def extract_values_from_first_file(data):
    values_set = set()
    for item in data or []:
        for data_item in item.get('string_list_data', []):
            values_set.add(data_item.get('value'))
    return values_set

def extract_exclusive_values(data, comparison_set):
    exclusive_values = []
    for item in data.get('relationships_following', []):
        for data_item in item.get('string_list_data', []):
            if data_item.get('value') not in comparison_set:
                exclusive_values.append(data_item.get('value'))
    return exclusive_values

def save_to_file(filepath, data):
    try:
        with open(filepath, 'w', encoding='utf-8') as file:
            # Prettifying the JSON with indent of 2 spaces
            file.write(str(data).replace("'", '"').replace(", ", ",\n  ").replace("[", "[\n  ").replace("]", "\n]"))
    except Exception as e:
        raise Exception(f"Error writing to file {filepath}: {str(e)}")

def main_process():
    try:
        first_json_data = load_json_data(FILE_1_PATH)
        second_json_data = load_json_data(FILE_2_PATH)

        first_values_set = extract_values_from_first_file(first_json_data)
        exclusive_values = extract_exclusive_values(second_json_data, first_values_set)

        save_to_file(OUTPUT_FILE_PATH, exclusive_values)
        print('Process completed successfully.')
    except Exception as e:
        print(f"Error: {str(e)}")

main_process()