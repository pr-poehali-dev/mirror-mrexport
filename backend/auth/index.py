import json
import os
import hashlib
import secrets

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p55504853_mirror_mrexport')

def get_db():
    import psycopg2
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    salt = 'mrexport_salt_2026'
    return hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()

def make_token(email: str) -> str:
    return hashlib.sha256(f'{email}{secrets.token_hex(16)}'.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    '''
    Регистрация и вход экспортных партнёров.
    POST /register — создать аккаунт (name, email, company, country, password)
    POST /login    — войти (email, password)
    '''
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    path = event.get('path', '/')
    try:
        data = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        data = {}

    def err(msg, code=400):
        return {'statusCode': code, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': msg}, ensure_ascii=False)}

    def ok(payload):
        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(payload, ensure_ascii=False, default=str)}

    if path.endswith('/register'):
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()
        company = (data.get('company') or '').strip()
        country = (data.get('country') or '').strip()
        password = data.get('password') or ''

        if not name or not email or not company or not password:
            return err('Заполните все обязательные поля')
        if len(password) < 6:
            return err('Пароль должен быть не менее 6 символов')

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f'SELECT id FROM {SCHEMA}.partners WHERE email = %s', (email,))
        if cur.fetchone():
            conn.close()
            return err('Email уже зарегистрирован')

        pw_hash = hash_password(password)
        token = make_token(email)
        cur.execute(
            f'INSERT INTO {SCHEMA}.partners (name, email, company, country, password_hash) VALUES (%s,%s,%s,%s,%s) RETURNING id',
            (name, email, company, country, pw_hash)
        )
        partner_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return ok({'success': True, 'token': token, 'partner': {'id': partner_id, 'name': name, 'email': email, 'company': company, 'country': country, 'verified': False}})

    if path.endswith('/login'):
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return err('Введите email и пароль')

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f'SELECT id, name, email, company, country, verified FROM {SCHEMA}.partners WHERE email = %s AND password_hash = %s',
            (email, hash_password(password))
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return err('Неверный email или пароль', 401)

        token = make_token(email)
        partner = {'id': row[0], 'name': row[1], 'email': row[2], 'company': row[3], 'country': row[4], 'verified': row[5]}
        return ok({'success': True, 'token': token, 'partner': partner})

    return err('Маршрут не найден', 404)