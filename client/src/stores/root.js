// src/stores/root.js
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import api from "../lib/api"; // sesuaikan ke "@/lib/api" kalau pakai alias

const errMsg = (e) =>
  e?.response?.data?.message ?? e?.message ?? "Unexpected error";

const initialState = () => ({
  products: [],
  categories: [],
  productDetail: {},
  isLoggedIn: !!localStorage.getItem("access_token"),
  username: "",
  favoriteIds: new Set(), // <— TAMBAH
});

export const useRootStore = defineStore("root", {
  state: () => initialState(),

  getters: {
    // cek status favorited by id
    isFavorited: (state) => (id) => state.favoriteIds.has(Number(id)),
  },

  actions: {
    resetState() {
      Object.assign(this, initialState(), { isLoggedIn: false });
    },

    async handleRegister(form) {
      try {
        await api.post("/pub/register", form);
        toast("You are registered!");
        return { ok: true, redirect: "/login" };
      } catch (e) {
        const msg = errMsg(e);
        console.log(e);
        toast(msg);
        return { ok: false, error: msg };
      }
    },

    async handleLogin(form) {
      try {
        const { data } = await api.post("/pub/login", form);
        localStorage.setItem("access_token", data.access_token);
        this.isLoggedIn = true;
        toast("Welcome!");
        return { ok: true, redirect: "/" };
      } catch (e) {
        const msg = errMsg(e);
        console.log(e);
        toast(msg);
        return { ok: false, error: msg };
      }
    },

    async handleGoogleLogin(google) {
      try {
        const { data } = await api.post(
          "/pub/google-login",
          {},
          { headers: { google_token: google?.credential } }
        );
        localStorage.setItem("access_token", data.access_token);
        this.isLoggedIn = true;
        toast("Welcome!");
        return { ok: true, redirect: "/" };
      } catch (e) {
        const msg = errMsg(e);
        console.log(e);
        toast(msg);
        return { ok: false, error: msg };
      }
    },

    async handleLogout() {
      try {
        localStorage.removeItem("access_token");
        this.resetState();
        toast("Bye bye!");
        return { ok: true, redirect: "/login" };
      } catch (e) {
        const msg = errMsg(e);
        console.log(e);
        toast(msg);
        return { ok: false, error: msg };
      }
    },

    async handleAddFavorites(id) {
      try {
        await api.post(`/pub/favorites/${id}`);
        toast("Successfully added to favorites!");
        return { ok: true };
      } catch (e) {
        const msg = errMsg(e);
        console.log(e);
        toast(msg);
        return { ok: false, error: msg };
      }
    },

    async fetchProducts(options = {}) {
      const { page = 1, search = "", sort = "", filter = "" } = options;
      try {
        const params = {
          page, // angka halaman
          size: 9, // page size
          search: search || undefined,
          sort: sort || undefined, // "name" | "-name" | "price" | "-price"
          category: Array.isArray(filter) // "1,2,3" (string)
            ? filter.join(",")
            : filter || undefined,
        };

        const { data } = await api.get("/pub/products", { params });
        this.products = data ?? [];
      } catch (e) {
        console.log(e);
        this.products = [];
      }
    },

    async fetchDetailProducts(id) {
      try {
        const { data } = await api.get(`/pub/products/${id}`);
        this.productDetail = data ?? {};
      } catch (e) {
        console.log(e);
        this.productDetail = {};
      }
    },

    // load daftar favorites (untuk badge ikon di list Home)
    async loadFavoriteIds() {
      if (!localStorage.getItem("access_token")) {
        this.favoriteIds = new Set();
        return;
      }
      try {
        const { data } = await api.get("/pub/favorites");
        const ids = (Array.isArray(data) ? data : [])
          .map((row) => row?.Product ?? row?.product ?? row)
          .filter((p) => p && (p.id ?? p.productId ?? p.product_id))
          .map((p) => Number(p.id ?? p.productId ?? p.product_id));
        this.favoriteIds = new Set(ids);
      } catch (e) {
        console.log(e);
        this.favoriteIds = new Set();
      }
    },

    async handleAddFavorites(id) {
      try {
        await api.post(`/pub/favorites/${id}`);
        // sinkronkan state lokal
        const copy = new Set(this.favoriteIds);
        copy.add(Number(id));
        this.favoriteIds = copy;
        toast("Successfully added to favorites!");
        return { ok: true };
      } catch (e) {
        console.log(e);
        toast(e.response?.data?.message ?? e.message);
        return { ok: false };
      }
    },

    async handleRemoveFavorite(id) {
      try {
        // asumsi BE punya DELETE /pub/favorites/:id
        await api.delete(`/pub/favorites/${id}`);
        const copy = new Set(this.favoriteIds);
        copy.delete(Number(id));
        this.favoriteIds = copy;
        toast("Removed from favorites.");
        return { ok: true };
      } catch (e) {
        console.log(e);
        toast(e.response?.data?.message ?? e.message);
        return { ok: false };
      }
    },

    async fetchFavorites() {
      try {
        const { data } = await api.get("/pub/favorites");
        const items = (Array.isArray(data) ? data : [])
          .map((row) => row?.Product ?? row?.product ?? row)
          .filter((p) => p && (p.id ?? p.productId ?? p.product_id))
          .map((p) => ({ ...p, id: p.id ?? p.productId ?? p.product_id }));
        this.products = items;

        // update favoriteIds juga
        this.favoriteIds = new Set(items.map((p) => Number(p.id)));
      } catch (e) {
        console.log(e);
        this.products = [];
      }
    },

    async fetchCategories() {
      try {
        const { data } = await api.get("/pub/categories");
        this.categories = data ?? [];
      } catch (e) {
        console.log(e);
        this.categories = [];
      }
    },
  },
});
