FROM python:3.8-slim-buster

RUN apt-get install gcc

WORKDIR /app

COPY requirements.txt ./


RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD [ "python", "server.py"]