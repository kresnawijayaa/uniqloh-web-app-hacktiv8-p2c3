<template>
  <section id="login-section">
    <section class="bg-white">
      <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-4 lg:px-16 lg:py-12">
          <div class="max-w-xl lg:max-w-3xl">
            <!-- ... header dan hero dipertahankan ... -->

            <h6 class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Log In
            </h6>

            <form @submit.prevent="doLogin" id="form-login" class="mt-8 grid grid-cols-6 gap-6">
              <div class="col-span-12">
                <label for="Email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="Email"
                  autocomplete="email"
                  required
                  class="focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />
              </div>

              <div class="col-span-12">
                <label for="Password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  id="Password"
                  autocomplete="current-password"
                  required
                  class="focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />
              </div>

              <div class="col-span-12">
                <button
                  :disabled="submitting"
                  class="w-full shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span v-if="!submitting">Login</span>
                  <span v-else>Logging in…</span>
                </button>
              </div>

              <div class="col-span-12">
                <p class="mt-4 text-sm text-gray-500 sm:mt-0 text-center">
                  Don't have an account yet?
                  <RouterLink to="/register" class="text-gray-700 underline">Sign Up</RouterLink>.
                </p>
              </div>
            </form>
          </div>
        </main>

        <!-- side image -->
        <section class="relative flex h-32 items-end bg-black lg:col-span-8 lg:h-full">
          <img alt="Night" src="../assets/medium-shot-happy-women.jpg" class="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div class="hidden lg:relative lg:block lg:p-12">
            <img src="../assets/logo.svg" alt="" style="height: 40px" />
            <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">UNIQ-LOH</h2>
            <p class="mt-4 leading-relaxed text-white/90">More than just a clothing brand.</p>
          </div>
        </section>
      </div>
    </section>
  </section>
</template>

<script>
import { mapActions } from "pinia";
import { useRootStore } from "@/stores/root"; // pastikan path benar
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  data() {
    return {
      submitting: false,
      form: { email: "", password: "" },
    };
  },
  methods: {
    ...mapActions(useRootStore, ["handleLogin"]),
    async doLogin() {
      if (this.submitting) return;
      this.submitting = true;
      try {
        const res = await this.handleLogin(this.form);
        // dua opsi sukses:
        // 1) kalau action return { ok, redirect }, pakai itu
        if (res?.ok) {
          this.$router.push(res.redirect || "/");
          return;
        }
        // 2) fallback: cek token tersimpan oleh action
        if (localStorage.getItem("access_token")) {
          this.$router.push("/");
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
