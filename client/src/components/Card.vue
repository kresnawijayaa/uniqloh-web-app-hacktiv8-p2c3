<template>
  <li>
    <RouterLink
      :to="'/products/' + product.id"
      href="#"
      class="group block overflow-hidden"
    >
      <img
        :src="product.imgUrl"
        alt=""
        class="h-[150px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[160px]"
      />

      <div>
        <div class="relative bg-white pt-3 grid lg:grid-cols-2 lg:gap-4">
          <div>
            <h3
              class="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4"
            >
              {{ product.name }}
            </h3>

            <p class="mt-2">
              <span class="sr-only"> Regular Price </span>

              <span class="tracking-wider text-gray-900">
                ${{ product.price }}
              </span>
            </p>
          </div>

          <div class="sm:flex flex-row-reverse sm:gap-4 mt-2 mb-2">
            <a
              @click.prevent="handleAddFavorites(product.id)"
              href="#"
              class="inline-block rounded-full border border-red-600 bg-red-600 px-2 py-2 text-xs font-medium text-white hover:bg-red-700 hover:text-red-600 focus:outline-none focus:ring active:text-red-500 mr-2"
            >
              <svg
                class="w-[14px] h-[14px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path
                  d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </RouterLink>
  </li>
</template>

<script>
import { mapActions } from "pinia";
import { useRootStore } from "../stores/root";
import { RouterLink } from "vue-router";

export default {
  props: ["product"],
  methods: {
    ...mapActions(useRootStore, ["handleAddFavorites"]),
  },
  components: { RouterLink },
};
</script>

<style lang="scss" scoped></style>
