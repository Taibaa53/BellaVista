import nodemailer from "nodemailer";

function formatInr(n) {
  return `₹${Number(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

function formatItems(items) {
  if (!Array.isArray(items)) return String(items);
  return items
    .map((i) => {
      const line = Number(i.price) * i.quantity;
      return `  - ${i.name} x${i.quantity} @ ${formatInr(i.price)} = ${formatInr(line)}`;
    })
    .join("\n");
}

export async function sendOrderEmailToAdmin(order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!adminEmail || !host || !user || !pass) {
    console.log(
      "[email] Skipping send: set ADMIN_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS in .env"
    );
    return { sent: false };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const itemsText = formatItems(order.items);
  const subject = `New order — ${order.customerName} (${formatInr(order.totalAmount)})`;
  const text = `
New order received

Customer: ${order.customerName}
Phone: ${order.phone}
Order type: ${order.orderType}
${order.address ? `Address: ${order.address}` : ""}

Items:
${itemsText}

Total: ${formatInr(order.totalAmount)}
Placed at: ${order.createdAt}
`.trim();

  await transporter.sendMail({
    from: user,
    to: adminEmail,
    subject,
    text,
  });

  return { sent: true };
}
