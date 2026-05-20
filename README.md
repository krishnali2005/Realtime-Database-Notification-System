# Realtime Database Notification System

## Overview

This project implements a realtime event-driven notification system using PostgreSQL LISTEN/NOTIFY and Socket.IO.

Whenever changes occur in the `orders` table, connected clients automatically receive updates without polling.

The system demonstrates realtime database event propagation using WebSockets and PostgreSQL triggers.

---

## Features

- Realtime INSERT notifications
- Realtime UPDATE notifications
- Realtime DELETE notifications
- PostgreSQL trigger-based event system
- WebSocket communication using Socket.IO
- No polling required
- Event-driven architecture

---

## Technologies Used

- PostgreSQL
- Node.js
- Express.js
- Socket.IO
- HTML/CSS/JavaScript

---

## Architecture

```text
PostgreSQL
    ↓
Trigger + NOTIFY
    ↓
Node.js LISTEN
    ↓
Socket.IO
    ↓
Browser Clients
```

Whenever the database changes:

1. PostgreSQL trigger fires
2. `pg_notify()` sends a notification
3. Node.js backend receives the event using LISTEN
4. Socket.IO broadcasts update to all connected clients
5. Browser updates instantly without refresh

---

## Project Structure

```text
realtime-orders/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── listeners/
│   │   └── orderListener.js
│   │
│   ├── sockets/
│   │   └── socket.js
│   │
│   ├── app.js
│   └── server.js
│
├── client/
│   ├── index.html
│   ├── client.js
│   └── style.css
│
├── package.json
├── .env
└── README.md
```

---

## Database Setup

Create database:

```sql
CREATE DATABASE realtime_orders;
```

Connect to database:

```sql
\c realtime_orders
```

---

## Create Orders Table

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    product_name VARCHAR(100),
    status VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Create Trigger Function

```sql
CREATE OR REPLACE FUNCTION notify_order_change()
RETURNS trigger AS $$
DECLARE
    payload JSON;
BEGIN

    IF (TG_OP = 'DELETE') THEN

        payload = json_build_object(
            'operation', TG_OP,
            'data', row_to_json(OLD)
        );

    ELSE

        payload = json_build_object(
            'operation', TG_OP,
            'data', row_to_json(NEW)
        );

    END IF;

    PERFORM pg_notify(
        'orders_channel',
        payload::text
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## Create Trigger

```sql
CREATE TRIGGER orders_trigger
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();
```

---

## Installation

Clone repository:

```bash
git clone <repository-url>
```

Move into project folder:

```bash
cd realtime-orders
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=realtime_orders
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

---

## Run Backend

```bash
node server/server.js
```

Expected output:

```text
Connected to PostgreSQL
Listening for database changes...
Server running on port 3000
```

---

## Run Frontend

Open:

```text
client/index.html
```

in browser.

---

## Testing

### Insert Order

```sql
INSERT INTO orders
(customer_name, product_name, status)
VALUES
('John', 'Laptop', 'pending');
```

### Update Order

```sql
UPDATE orders
SET status='shipped'
WHERE id=1;
```

### Delete Order

```sql
DELETE FROM orders
WHERE id=1;
```

---

## Expected Behavior

Whenever the database changes:

- PostgreSQL trigger sends notification
- Node.js backend receives event
- Socket.IO broadcasts update
- Browser updates instantly without refresh

---

## Scalability Considerations

The system uses an event-driven architecture instead of polling, reducing unnecessary database queries and improving efficiency.

PostgreSQL LISTEN/NOTIFY enables lightweight realtime event propagation, while Socket.IO maintains persistent client connections for realtime communication.


## Author

Krishnali Vivek Kulkarni
