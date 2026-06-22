import json
import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header


def handler(event: dict, context) -> dict:
    '''
    Принимает заявку с формы контактов и отправляет её на почту через SMTP.
    Args: event с httpMethod, body (name, email, company, message); context с request_id.
    Returns: HTTP-ответ со статусом отправки.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    try:
        data = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        data = {}

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    company = (data.get('company') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email:
        return {
            'statusCode': 400,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и email'}, ensure_ascii=False),
        }

    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    contact_email = os.environ.get('CONTACT_EMAIL', smtp_user)

    body_text = (
        f'Новая заявка с сайта MrExport\n\n'
        f'Имя: {name}\n'
        f'Email: {email}\n'
        f'Компания: {company or "—"}\n\n'
        f'Сообщение:\n{message or "—"}\n'
    )

    msg = MIMEText(body_text, 'plain', 'utf-8')
    msg['Subject'] = Header(f'Заявка с MrExport от {name}', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = contact_email
    msg['Reply-To'] = email

    if smtp_port == 465:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=20)
        server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, [contact_email], msg.as_string())
    server.quit()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True, 'message': 'Заявка отправлена'}, ensure_ascii=False),
    }
