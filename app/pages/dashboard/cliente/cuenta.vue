<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "dashboard:access",
});

const { t } = useI18n();

const { data } = await useFetch("/api/account", {
	headers: useRequestHeaders(["cookie"]),
});

const name = ref(data.value?.user?.name ?? "");
const email = ref(data.value?.user?.email ?? "");
const phone = ref(data.value?.user?.phone ?? "");
const currentPasskey = ref("");
const newPassword = ref("");
const saved = ref(false);
const error = ref<string | null>(null);
const pending = ref(false);

async function save() {
	saved.value = false;
	error.value = null;
	pending.value = true;
	try {
		await $fetch("/api/account", {
			method: "PATCH",
			body: {
				name: name.value,
				email: email.value,
				phone: phone.value,
				// Cambios sensibles (email/nueva contraseña) exigen la actual.
				...(newPassword.value ? { currentPasskey: currentPasskey.value } : {}),
				...(email.value !== data.value?.user?.email
					? { currentPasskey: currentPasskey.value }
					: {}),
				...(newPassword.value ? { newPassword: newPassword.value } : {}),
			},
		});
		currentPasskey.value = "";
		newPassword.value = "";
		saved.value = true;
	} catch {
		error.value = t("app.register.invalid");
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div class="max-w-lg">
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">{{ t("app.panel.accountTitle") }}</h1>
		<p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ t("app.panel.accountSubtitle") }}</p>

		<UCard class="mt-6">
			<form class="flex flex-col gap-4" @submit.prevent="save">
				<UFormField :label="t('app.panel.name')">
					<UInput v-model="name" />
				</UFormField>
				<UFormField :label="t('app.panel.email')">
					<UInput v-model="email" type="email" />
				</UFormField>
				<UFormField :label="t('app.panel.phone')">
					<UInput v-model="phone" />
				</UFormField>
				<UFormField :label="t('app.panel.password')">
					<UInput v-model="currentPasskey" type="password" autocomplete="current-password" />
				</UFormField>
				<UFormField :label="t('app.panel.newPassword')">
					<UInput v-model="newPassword" type="password" autocomplete="new-password" />
				</UFormField>

				<UAlert v-if="saved" color="success" variant="soft" :title="t('app.panel.saved')" />
				<UAlert v-if="error" color="error" variant="soft" :title="error" />

				<UButton type="submit" :loading="pending">{{ t("app.panel.save") }}</UButton>
			</form>
		</UCard>
	</div>
</template>