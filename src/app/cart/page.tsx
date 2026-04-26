"use client";

import { useEffect, useState } from "react";

type TestCase = {
  id: number;
  name: string;
  description: string;
};

type CartItem = {
  id: number;
  test_case_id: number;
  name: string;
  description: string;
};

export default function CartPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [testCaseResponse, cartResponse] = await Promise.all([
      fetch("/api/testcases", { cache: "no-store" }),
      fetch("/api/cart", { cache: "no-store" }),
    ]);

    const [testCaseData, cartData] = await Promise.all([
      testCaseResponse.json(),
      cartResponse.json(),
    ]);

    setTestCases(Array.isArray(testCaseData) ? testCaseData : []);
    setCartItems(Array.isArray(cartData) ? cartData : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = async (testCaseId: number) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testCaseId }),
    });
    const body = await response.json();
    setMessage(body?.message ?? "Added to cart.");
    await loadData();
  };

  const removeFromCart = async (id: number) => {
    const response = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    const body = await response.json();
    setMessage(body?.message ?? "Removed.");
    await loadData();
  };

  const clearCart = async () => {
    const response = await fetch("/api/cart", { method: "DELETE" });
    const body = await response.json();
    setMessage(body?.message ?? "Cleared.");
    await loadData();
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5">
        <h1 className="text-xl font-bold">Cart System</h1>
        <p className="mt-1 text-sm opacity-80">Add existing test cases to cart.</p>

        <div className="mt-4 space-y-2">
          {testCases.length === 0 && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">No test cases available.</p>
          )}

          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div>
                <p className="font-semibold">{testCase.name}</p>
                <p className="text-sm opacity-80">{testCase.description}</p>
              </div>
              <button
                type="button"
                onClick={() => addToCart(testCase.id)}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Current Cart</h2>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-md border border-border px-3 py-1.5 text-xs"
          >
            Clear All
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {cartItems.length === 0 && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">Cart is empty.</p>
          )}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm opacity-80">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="rounded-md border border-red-400 px-3 py-1.5 text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      </div>
    </section>
  );
}
