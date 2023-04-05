FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000
CMD [ "python3", "server.py","--host","0.0.0.0"]