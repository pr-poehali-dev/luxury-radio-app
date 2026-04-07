"""
Загрузка MP3-трека в S3 хранилище.
Принимает base64-encoded аудиофайл, сохраняет в S3, возвращает публичный URL.
"""
import json
import os
import base64
import uuid
import boto3


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    file_data = body.get("file")
    filename = body.get("filename", "track.mp3")
    title = body.get("title", "Без названия")
    artist = body.get("artist", "Неизвестный артист")
    genre = body.get("genre", "Разное")

    if not file_data:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Файл не передан"}),
        }

    audio_bytes = base64.b64decode(file_data)
    max_size = 50 * 1024 * 1024
    if len(audio_bytes) > max_size:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Файл слишком большой (макс. 50 МБ)"}),
        }

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "mp3"
    key = f"music/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    s3.put_object(
        Bucket="files",
        Key=key,
        Body=audio_bytes,
        ContentType="audio/mpeg",
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({
            "url": cdn_url,
            "title": title,
            "artist": artist,
            "genre": genre,
            "filename": filename,
        }),
    }
