import asyncio
from aiosmtpd.controller import Controller
from aiosmtpd.smtp import SMTP, AuthResult, LoginPassword
from aiosmtpd.handlers import Message
import datetime
import os
import json
import ssl
import smtplib
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
CONFIG = {
    "smtp": {
        "host": "0.0.0.0",
        "port": 1025
    },
    "relay": {
        "enabled": False,
        "host": "smtp.gmail.com",
        "port": 587,
        "username": "your_email@gmail.com",
        "password": "your_app_password"
    },
    "api_keys": {
        "your_api_key_here": {  # Replace with your actual API key
            "daily_limit": -1,  # -1 means unlimited
            "user": "admin",
            "password": "your_secure_password"  # Replace with secure password
        }
    }
}

class AuthenticatedHandler(Message):
    def __init__(self):
        super().__init__()
        self.mail_dir = "received_mail"
        if not os.path.exists(self.mail_dir):
            os.makedirs(self.mail_dir)
        
        # Create logs directory
        self.log_dir = "email_logs"
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)

    def verify_api_key(self, api_key):
        return api_key in CONFIG["api_keys"]

    def log_email(self, from_addr, to_addrs, subject, api_key):
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = os.path.join(self.log_dir, f"email_log_{datetime.datetime.now().strftime('%Y%m%d')}.txt")
        log_entry = f"{timestamp}|{api_key}|{from_addr}|{to_addrs}|{subject}\n"
        with open(log_file, "a") as f:
            f.write(log_entry)

    async def handle_message(self, message):
        # Extract headers
        from_addr = message['from']
        to_addrs = message['to']
        subject = message['subject']
        api_key = message.get('X-API-Key', 'none')

        if not self.verify_api_key(api_key):
            print(f"Invalid API key: {api_key}")
            return

        # Save the email locally
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.mail_dir, f"email_{timestamp}.eml")
        
        with open(filename, "wb") as f:
            f.write(bytes(message))

        # Log the email
        self.log_email(from_addr, to_addrs, subject, api_key)
        
        # Relay the email if enabled
        if CONFIG["relay"]["enabled"]:
            try:
                self.relay_email(message)
                print(f"Email relayed successfully: {subject}")
            except Exception as e:
                print(f"Failed to relay email: {e}")

        print(f"Email processed and saved: {filename}")

    def relay_email(self, message):
        # Create SMTP connection
        with smtplib.SMTP(CONFIG["relay"]["host"], CONFIG["relay"]["port"]) as server:
            server.starttls()
            server.login(CONFIG["relay"]["username"], CONFIG["relay"]["password"])
            
            # Forward the email
            server.send_message(message)

class CustomSMTP(SMTP):
    async def smtp_AUTH(self, arg):
        if not arg:
            return "502 AUTH command error. Syntax: AUTH LOGIN"
        
        auth_type = arg.split()[0].upper()
        if auth_type != "LOGIN":
            return "504 Only LOGIN authentication supported"

        # Handle LOGIN authentication
        username = await self.challenge_auth("Username:")
        password = await self.challenge_auth("Password:")
        
        # Verify credentials against API keys
        for api_key, details in CONFIG["api_keys"].items():
            if details["user"] == username and details["password"] == password:
                self.session.authenticated = True
                self.session.api_key = api_key
                return "235 Authentication successful"
        
        return "535 Authentication failed"

def find_available_port(start_port=1025, max_port=1050):
    """Find an available port in the given range."""
    for port in range(start_port, max_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"No available ports found in range {start_port}-{max_port}")

def run_server(host=None, port=None):
    if host is None:
        host = CONFIG["smtp"]["host"]
    if port is None:
        port = CONFIG["smtp"]["port"]

    handler = AuthenticatedHandler()
    controller = Controller(
        handler,
        hostname=host,
        port=port,
        server_class=CustomSMTP,
        auth_required=True,
        auth_require_tls=False  # Set to True in production
    )

    try:
        controller.start()
        print(f"SMTP Server running on {host}:{port}")
        print("Server is ready to handle emails. Press Ctrl+C to stop.")
        
        while True:
            asyncio.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down SMTP server")
        controller.stop()
    except Exception as e:
        print(f"Error: {e}")
        controller.stop()
        raise

if __name__ == '__main__':
    # Create config file if it doesn't exist
    if not os.path.exists('config.json'):
        with open('config.json', 'w') as f:
            json.dump(CONFIG, f, indent=4)
        print("Created default config.json - please update with your settings")
    
    try:
        run_server()
    except Exception as e:
        print(f"Failed to start SMTP server: {e}")
