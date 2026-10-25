window.Cart = (() => {
  const KEY = "sawwa_cart";
  const get = () => JSON.parse(localStorage.getItem(KEY) || "[]");
  const set = (l) => {
    localStorage.setItem(KEY, JSON.stringify(l));
    window.dispatchEvent(new Event("cart-change"));
  };
  const add = (product, qty = 1) => {
    const l = get();
    const e = l.find((x) => x.id === product.id);
    const currentQty = e ? e.qty : 0;
    
    if (window.Store && Store.products) {
      const liveProduct = Store.products.byId(product.id);
      if (liveProduct && (currentQty + qty) > liveProduct.stock) {
         if (window.UI && window.UI.toast) window.UI.toast("الكمية المطلوبة تتجاوز المخزون المتاح", "warn");
         return false;
      }
    }

    if (e) e.qty += qty;
    else l.push({
      id: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      qty,
      image: (product.images && product.images[0]) || ""
    });
    set(l);
    return true;
  };
  const remove = (id) => set(get().filter((x) => x.id !== id));
  const setQty = (id, qty) => {
    const l = get();
    const e = l.find((x) => x.id === id);
    if (e) {
      let safeQty = Math.max(1, qty);
      if (window.Store && Store.products) {
        const liveProduct = Store.products.byId(id);
        if (liveProduct && safeQty > liveProduct.stock) {
           safeQty = liveProduct.stock;
           if (window.UI && window.UI.toast) window.UI.toast("تم تعديل الكمية حسب المخزون", "info");
        }
      }
      e.qty = safeQty;
    }
    set(l);
  };
  const clear = () => set([]);
  const count = () => get().reduce((a, b) => a + b.qty, 0);
  const subtotal = () => get().reduce((a, b) => a + b.price * b.qty, 0);
  return { get, add, remove, setQty, clear, count, subtotal };
})();
