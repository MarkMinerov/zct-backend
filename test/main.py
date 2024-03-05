import requests
import json

f = open('data.json')

images = json.load(f)

data = json.dumps({"signature_name": "serving_default", "instances": images})
headers = {"content-type": "application/json"}
json_response = requests.post('http://localhost:8501/v1/models/mnist_model:predict', data=data, headers=headers)
predictions = json.loads(json_response.text)["predictions"]

print(predictions)