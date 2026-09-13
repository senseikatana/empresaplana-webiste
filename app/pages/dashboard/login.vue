<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const username = ref("");
const passkey = ref("");
const error = ref<string | null>(null);
const pending = ref(false);

useHead({
	title: t("app.auth.welcome"),
	meta: [{ name: "robots", content: "noindex, nofollow" }],
});

async function submit() {
	error.value = null;
	pending.value = true;
	try {
		await $fetch("/api/auth/login", {
			method: "POST",
			body: { username: username.value, passkey: passkey.value },
		});
		const redirect =
			typeof route.query.redirect === "string"
				? route.query.redirect
				: localePath("/dashboard");
		await navigateTo(redirect);
	} catch (e) {
		error.value = t("app.auth.invalid");
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-surface-container px-4">
		<UCard class="w-full max-w-sm">
			<template #header>
				<h1 class="text-xl font-bold text-deep-navy">{{ t("app.auth.welcome") }}</h1>
				<p class="text-sm text-on-surface-variant">{{ t("app.auth.subtitle") }}</p>
			</template>

			<form class="flex flex-col gap-4" @submit.prevent="submit">
				<UFormField :label="t('app.auth.username')">
					<UInput v-model="username" autocomplete="username" placeholder="admin" />
				</UFormField>
				<UFormField :label="t('app.auth.passkey')">
					<UInput v-model="passkey" type="password" autocomplete="current-password" placeholder="••••••••" />
				</UFormField>

				<UAlert v-if="error" color="error" variant="soft" :title="error" />

				<UButton type="submit" :loading="pending" block>
					{{ t("app.auth.login") }}
				</UButton>
			</form>

			<template #footer>
				<p class="text-sm text-on-surface-variant">
					<ULink :to="localePath('/dashboard/register')" class="font-medium text-deep-navy">
						{{ t("app.register.title") }}
					</ULink>
				</p>
			</template>
		</UCard>
	</div>
</template>