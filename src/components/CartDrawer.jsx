import { useState } from "react";
import { useCart } from "../context/CartContext";
import { sendOrderViaWhatsApp } from "../data/whatsappOrder";
import styles from "./CartDrawer.module.css";

const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile numbers

export default function CartDrawer() {
  const {
    items,
    total,
    itemCount,
    addItem,
    decrementItem,
    removeItem,
    clearCart,
    isDrawerOpen,
    closeDrawer,
  } = useCart();

  const [orderType, setOrderType] = useState("delivery"); // "delivery" | "pickup"
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isDrawerOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setCustomer((c) => ({ ...c, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: null }));
  }

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCustomer((c) => ({ ...c, phone: digits }));
    if (errors.phone) setErrors((err) => ({ ...err, phone: null }));
  }

  function validate() {
    const next = {};
    if (!customer.name.trim()) next.name = "Please enter your name";
    if (!PHONE_REGEX.test(customer.phone.trim()))
      next.phone = "Enter a valid 10-digit mobile number";
    if (orderType === "delivery" && !customer.address.trim())
      next.address = "Delivery address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handlePlaceOrder() {
    if (itemCount === 0) return;
    if (!validate()) return;

    const orderCustomer = {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      orderType: orderType === "delivery" ? "Home Delivery" : "Self Pickup",
      address:
        orderType === "delivery"
          ? [customer.address.trim(), customer.landmark.trim()].filter(Boolean).join(", ")
          : null,
      note: customer.note.trim() || null,
    };

    sendOrderViaWhatsApp(items, orderCustomer, total);
    setSubmitted(true);
    // Once the order is confirmed sent, clear the cart for the next visit.
    clearCart();
  }

  const canSubmit =
    itemCount > 0 &&
    customer.name.trim() &&
    PHONE_REGEX.test(customer.phone.trim()) &&
    (orderType === "pickup" || customer.address.trim());

  return (
    <div className={styles.overlay} onClick={closeDrawer}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Your Order</h3>
          <button className={styles.closeBtn} onClick={closeDrawer} aria-label="Close">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className={styles.confirmation}>
            <p>✅ Your order was opened in WhatsApp — just hit send there to confirm.</p>
            <button className={styles.secondaryBtn} onClick={closeDrawer}>
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <div className={styles.itemList}>
              {items.length === 0 && (
                <p className={styles.empty}>No items yet — add something from the menu.</p>
              )}
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.nameEn}</span>
                    <span className={styles.itemPrice}>₹{item.price} each</span>
                  </div>
                  <div className={styles.qtyControls}>
                    <button onClick={() => decrementItem(item.id)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addItem(item)}>+</button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.nameEn}`}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className={styles.toggleRow}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${
                      orderType === "delivery" ? styles.toggleActive : ""
                    }`}
                    onClick={() => setOrderType("delivery")}
                  >
                    Home Delivery
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${
                      orderType === "pickup" ? styles.toggleActive : ""
                    }`}
                    onClick={() => setOrderType("pickup")}
                  >
                    Self Pickup
                  </button>
                </div>

                <div className={styles.form}>
                  <div className={styles.field}>
                    <input
                      name="name"
                      placeholder="Your name"
                      value={customer.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>

                  <div className={styles.field}>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={handlePhoneChange}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>

                  {orderType === "delivery" && (
                    <>
                      <div className={styles.field}>
                        <textarea
                          name="address"
                          placeholder="Delivery address (house/flat no., street, area)"
                          value={customer.address}
                          onChange={handleChange}
                          rows={2}
                        />
                        {errors.address && (
                          <span className={styles.error}>{errors.address}</span>
                        )}
                      </div>

                      <div className={styles.field}>
                        <input
                          name="landmark"
                          placeholder="Landmark (optional)"
                          value={customer.landmark}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  <textarea
                    name="note"
                    placeholder="Special instructions (optional)"
                    value={customer.note}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <button
                  className={styles.primaryBtn}
                  disabled={!canSubmit}
                  onClick={handlePlaceOrder}
                >
                  Place Order via WhatsApp
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}