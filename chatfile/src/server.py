from flask import Flask, request

from chatfile import create_llama_index, get_answer_from_llama_index
app = Flask(__name__)
	
@app.route('/upload', methods = ['POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      return create_llama_index(f)

@app.route('/query', methods = ['GET'])
def query_from_llama_index():
   message = request.args.get('message')
   return get_answer_from_llama_index(message)
		
if __name__ == '__main__':
   app.run(debug = True)