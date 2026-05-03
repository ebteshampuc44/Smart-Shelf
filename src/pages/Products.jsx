import React, { useState, useEffect } from "react";

const StatusBadge = ({ status }) => {
  const map = {
    ok: { label: "In Stock", bg: "#dcfce7", color: "#166534" },
    low: { label: "Low Stock", bg: "#fef3c7", color: "#92400e" },
    out: { label: "Out of Stock", bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status];
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]); // খালি অ্যারে, কোনো ফেইক ডাটা নেই
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "", sku: "", stock: "", max: "", price: "", status: "ok"
  });

  // লোকাল স্টোরেজ থেকে ডাটা লোড করা
  useEffect(() => {
    const storedProducts = localStorage.getItem('smartshelf_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // প্রোডাক্ট পরিবর্তন হলে লোকাল স্টোরেজে সেভ করা
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('smartshelf_products', JSON.stringify(products));
    } else {
      localStorage.removeItem('smartshelf_products');
    }
  }, [products]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: "", category: "", sku: "", stock: "", max: "", price: "", status: "ok" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // স্টক ভ্যালু অনুযায়ী স্ট্যাটাস নির্ধারণ
    const stockValue = Number(formData.stock);
    const maxValue = Number(formData.max);
    let status = "ok";
    if (stockValue === 0) status = "out";
    else if (stockValue < 50) status = "low";
    
    const newProduct = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      stock: stockValue,
      max: maxValue,
      status: status,
      price: formData.price
    };
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateStock = (id, newStock) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const stock = Math.max(0, Number(newStock));
        let status = "ok";
        if (stock === 0) status = "out";
        else if (stock < 50) status = "low";
        return { ...p, stock, status };
      }
      return p;
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#000000" }}>Products</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, width: 200, color: "#000000" }}
          />
          <button
            onClick={() => openModal()}
            style={{
              background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10,
              padding: "8px 20px", fontWeight: 600, cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        // Empty State - যখন কোনো প্রোডাক্ট নেই
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
          padding: "60px 20px", textAlign: "center",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px auto",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#000000", marginBottom: 8 }}>No Products Yet</h3>
          <p style={{ fontSize: 13, color: "#555555", marginBottom: 20 }}>Get started by adding your first product</p>
          <button
            onClick={() => openModal()}
            style={{
              background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14,
            }}
          >
            + Add Your First Product
          </button>
        </div>
      ) : (
        // Products Table - যখন প্রোডাক্ট আছে
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
          overflow: "auto", fontSize: 13,
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Product", "Category", "SKU", "Stock", "Price", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#000000" }}>{h}</th>
                ))}
               </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const pct = p.max > 0 ? Math.round((p.stock / p.max) * 100) : 0;
                const barColor = p.status === "ok" ? "#22c55e" : p.status === "low" ? "#f59e0b" : "#ef4444";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "12px", fontWeight: 600, color: "#000000" }}>{p.name}</td>
                    <td style={{ padding: "12px", color: "#000000" }}>{p.category}</td>
                    <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 11, color: "#000000" }}>{p.sku}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateStock(p.id, e.target.value)}
                          style={{ width: 70, padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, color: "#000000" }}
                        />
                        {p.max > 0 && (
                          <>
                            <div style={{ width: 60, height: 4, background: "#f1f5f9", borderRadius: 2 }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 10, color: "#555555" }}>{pct}%</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px", fontWeight: 500, color: "#000000" }}>{p.price}</td>
                    <td style={{ padding: "12px" }}><StatusBadge status={p.status} /></td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openModal(p)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 12 }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && search && (
            <div style={{ padding: "40px", textAlign: "center", color: "#555555" }}>
              No products found matching "{search}"
            </div>
          )}
        </div>
      )}

      {/* Modal - Add/Edit Product */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, margin: 20 }}>
            <h3 style={{ fontSize: 20, marginBottom: 20, color: "#000000" }}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>Product Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                />
              </div>
              <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>Category *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>SKU *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.sku} 
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>Current Stock *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>Max Stock</label>
                  <input 
                    type="number" 
                    value={formData.max} 
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })} 
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#000000" }}>Price *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.price} 
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: 8, color: "#000000" }} 
                  placeholder="$0.00" 
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", color: "#000000" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: "10px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;