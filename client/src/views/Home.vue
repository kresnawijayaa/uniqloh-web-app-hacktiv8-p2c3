<template>
  <section id="home-section">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-8 lg:px-8">
      <div class="grid grid-cols-4">
        <header class="col-span-3">
          <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>

          <p class="mt-4 max-w-2xl text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
            praesentium cumque iure dicta incidunt est ipsam, officia dolor
            fugit natus?
          </p>
        </header>
      </div>

      <div class="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
        <div class="lg:col-span-3">
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </ul>
          <div class="py-8">
            <ol class="flex justify-center gap-4 text-xs font-medium">
              <li @click="page--">
                <a
                  href="#"
                  class="inline-flex h-8 w-14 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180"
                >
                  <span class="sr-only">Prev Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  class="inline-flex h-8 w-12 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180"
                >
                  <span class="sr-only">This Page</span>
                  {{ page }}
                </a>
              </li>

              <li @click="page++">
                <a
                  href="#"
                  class="inline-flex h-8 w-14 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180"
                >
                  <span class="sr-only">Next Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            </ol>
          </div>
        </div>

        <div class="hidden space-y-4 lg:block">
          <form>
            <div>
              <label
                for="SortBy"
                class="block text-xs font-medium text-gray-700"
              >
                Search
              </label>
              <div class="relative mt-2 space-y">
                <label for="Search" class="sr-only"> Search </label>

                <input
                  type="text"
                  v-model="search"
                  id="Search"
                  placeholder="Search for..."
                  class="bg-white focus:ring-2 focus:ring-red-500 focus:outline-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />

                <span
                  class="absolute inset-y-0 end-0 grid w-10 place-content-center"
                >
                  <button
                    type="button"
                    class="text-gray-600 hover:text-gray-700"
                  >
                    <span class="sr-only">Search</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <br />

            <div>
              <label
                for="SortBy"
                class="block text-xs font-medium text-gray-700"
              >
                Sort By
              </label>
              <div class="relative mt-2 space-y">
                <select
                  v-model="sort"
                  name="categoryId"
                  id="CategoryId"
                  class="bg-white focus:ring-2 focus:ring-red-500 focus:outline-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2.5 px-2 ring-1 ring-slate-200 shadow-sm"
                >
                  <option disabled value="">Sorted by...</option>
                  <option value="name">Title (A-Z)</option>
                  <option value="-name">Title (Z-A)</option>
                  <option value="price">Lowest Price</option>
                  <option value="-price">Highest Price</option>
                </select>
              </div>
            </div>

            <br />

            <div>
              <label
                for="SortBy"
                class="block text-xs font-medium text-gray-700"
              >
                Category
              </label>
              <div class="relative mt-1">
                <ul class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                  <li v-for="category in categories" v-bind:key="category.id">
                    <label
                      for="FilterRed"
                      class="inline-flex items-center gap-2"
                    >
                      <input
                        v-model="filter"
                        :value="category.id"
                        type="checkbox"
                      />
                      <label>{{ category.name }}</label>
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <br />

            <div class="col-span-12">
              <button
                @click.prevent="clearAllFilter()"
                class="w-full shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
              >
                Clear All Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";
import { mapActions, mapState } from "pinia";
import { useRootStore } from "../stores/root";
import Card from "../components/Card.vue";

export default {
  data() {
    return {
      page: 1,
      search: "",
      sort: "",
      filter: [],
    };
  },
  watch: {
    page() {
      this.fetchProducts({
        page: this.page,
        search: this.search,
        sort: this.sort,
        filter: this.filter.toString(),
      });
    },
    search() {
      this.page = 1;
      this.fetchProducts({
        page: 1,
        search: this.search,
        sort: this.sort,
        filter: this.filter.toString(),
      });
    },
    sort() {
      this.page = 1;
      this.fetchProducts({
        page: 1,
        search: this.search,
        sort: this.sort,
        filter: this.filter.toString(),
      });
    },
    filter() {
      this.page = 1;
      this.fetchProducts({
        page: 1,
        search: this.search,
        sort: this.sort,
        filter: this.filter.toString(),
      });
    },
  },
  computed: {
    ...mapState(useRootStore, ["products", "categories"]),
  },
  methods: {
    ...mapActions(useRootStore, ["fetchProducts", "fetchCategories"]),

    clearAllFilter() {
      this.page = 1;
      this.search = "";
      this.sort = "";
      this.filter = [];
    },
  },
  components: { RouterLink, Card },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
};
</script>

<style lang="scss" scoped></style>
