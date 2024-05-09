import asyncio
from collections import defaultdict
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import ssl
from app.core.logger import get_logger
from app.services.template_service import fetch_template_by_id


logger = get_logger(__name__)


def send_email_smtp(subject, content, emails):
    sender_email = os.getenv("EMAIL", "")
    sender_password = os.getenv("EMAIL_PASSWORD", "")
    smtp_server = os.getenv("SMTP_SERVER", "")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    # Create MIME multi-part message
    message = MIMEMultipart("alternative")
    message["From"] = sender_email
    message["To"] = ", ".join(emails)  # Join all email addresses
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(content, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, emails, message.as_string())


class EmailSender:
    def __init__(self):
        # Dictionary to hold template_id -> set of slugs
        self.notifications = defaultdict(set)

    def add_notification(self, template_id, slug):
        """Add a slug to the set for the specified template_id."""
        self.notifications[template_id].add(slug)
        logger.info(self.notifications)

    async def send_emails(self):
        """Send an email for each template with all associated slugs."""
        logger.info(self.notifications)
        for template_id, slugs in self.notifications.items():
            template = await fetch_template_by_id(template_id)

            if not template or not template.emails or len(template.emails) == 0:
                continue

            await self.send_email(template, list(slugs))
        # Clear the notifications after sending emails
        self.notifications.clear()

    async def send_email(self, template, slugs):
        """Sends an HTML formatted email."""
        recipient_emails = template.emails  # Define or fetch recipient emails
        subject = f"Babybox Dashboard Notifikace - {template.title}"
        html_content = self.format_html_email(template, slugs)
        send_email_smtp(subject, html_content, recipient_emails)

    def format_html_email(self, template, slugs):
        """Formats the HTML content of the email."""
        slugs.sort()  # Ensure slugs are alphabetically ordered
        slugs_list = "".join(f"<li>{slug}</li>" for slug in slugs)  # Format slugs as list items

        # HTML content construction
        html_content = f"""
        <html>
        <head></head>
        <body>
            <h1>{template.title}</h1>
            <h2>Notifikace vygenerovaná z babyboxů:</h2>
            <ul>{slugs_list}</ul>
            <p>{template.message}</p>
        </body>
        </html>
        """
        return html_content
