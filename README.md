# Simple SMTP Server

A basic SMTP server implementation for handling email messages.

## Features
- Receives incoming SMTP messages
- Saves received emails to local storage
- Runs on localhost by default
- Supports custom host and port configuration

## Setup
1. Install the requirements:
```
pip install -r requirements.txt
```

2. Run the server:
```
python smtp_server.py
```

By default, the server runs on:
- Host: 127.0.0.1 (localhost)
- Port: 1025

## Usage
The server will:
- Listen for incoming SMTP connections
- Save received emails to the 'received_mail' directory
- Print connection and message information to console

To test, you can use Python's built-in smtplib:
```python
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg.set_content('Test message')
msg['Subject'] = 'Test Subject'
msg['From'] = "sender@example.com"
msg['To'] = "recipient@example.com"

# Connect to your local SMTP server
s = smtplib.SMTP('127.0.0.1', 1025)
s.send_message(msg)
s.quit()
```
