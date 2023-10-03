import axios from "axios";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useRootStore = defineStore("root", {
  state: () => ({
    products: [],
    categories: [],
    productDetail: {},
    isLoggedIn: false,
    username: "",
  }),
  getters: {},
  actions: {
    async handleRegister(form) {
      try {
        const response = await axios.post(
          "https://main.kresnawijaya.tech/pub/register",
          form
        );
        this.$router.push("/login");
        toast(`You are registered!`);
      } catch (error) {
        console.log(error);
        toast(error.response.data.message);
      }
    },
    async handleLogin(form) {
      try {
        const response = await axios.post(
          "https://main.kresnawijaya.tech/pub/login",
          form
        );
        localStorage.setItem("access_token", response.data.access_token);
        this.isLoggedIn = true;
        this.$router.push("/");
        toast(`Welcome!`);
      } catch (error) {
        console.log(error);
        toast(error.response.data.message);
      }
    },
    async handleGoogleLogin(response) {
      try {
        console.log("Encoded JWT ID token: ", response.credential);
        const response = await axios.post(
          "https://main.kresnawijaya.tech/pub/google-login",
          {},
          {
            headers: {
              google_token: response.credential,
            },
          }
        );
        console.log(data, "berhasil google token<<<");
        localStorage.setItem("access_token", data.access_token);
        this.isLoggedIn = true;
        toast(`Welcome!`);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
        toast(error.response.data.message);
      }
    },
    async handleLogout() {
      try {
        localStorage.removeItem("access_token");
        this.$router.push("/login");
        toast(`Bye bye!`);
        this.isLoggedIn = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handleAddFavorites(id) {
      try {
        const response = await axios.post(
          "https://main.kresnawijaya.tech/pub/favorites/" + id,
          {},
          {
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          }
        );
        toast(`Successfully added to favorites!`);
        // this.$router.push("/favorites");
      } catch (error) {
        console.log(error);
      }
    },
    async fetchProducts(
      options = { page: 1, search: "", sort: "", filter: "" }
    ) {
      try {
        if (options.filter === "") {
          const response = await axios.get(
            "https://main.kresnawijaya.tech/pub/products",
            {
              params: {
                page: {
                  number: options.page,
                  size: 9,
                },
                search: options.search,
                sort: options.sort,
              },
            }
          );
          this.products = response.data;
        } else {
          const response = await axios.get(
            "https://main.kresnawijaya.tech/pub/products",
            {
              params: {
                page: {
                  number: options.page,
                  size: 9,
                },
                search: options.search,
                sort: options.sort,
                filter: {
                  category: options.filter,
                },
              },
            }
          );
          this.products = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchDetailProducts(id) {
      try {
        const response = await axios.get(
          "https://main.kresnawijaya.tech/pub/products/" + id
        );
        this.productDetail = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchFavorites() {
      try {
        const response = await axios.get(
          "https://main.kresnawijaya.tech/pub/favorites",
          {
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          }
        );
        const productFavorites = response.data.map((x) => {
          return x.Product;
        });
        this.products = productFavorites;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(
          "https://main.kresnawijaya.tech/pub/categories"
        );
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
