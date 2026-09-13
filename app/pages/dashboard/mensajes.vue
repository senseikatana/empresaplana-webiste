<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });

import { contact } from "~/data/contact";

const { t } = useI18n();

const { data: conversations, refresh: refreshConversations } = await useFetch(
	"/api/chat",
	{ headers: useRequestHeaders(["cookie"]) },
);

const { data: me } = await useFetch<{ user: { id: number } }>("/api/me", {
	headers: useRequestHeaders(["cookie"]),
});

const myId = computed(() => me.value?.user?.id ?? 0);

const activeId = ref<number | null>(null);
const messages = ref<Array<{
	id: number;
	body: string;
	senderId: number;
	senderRole: string;
	createdAt: string;
}> | null>(null);
const draft = ref("");
const sending = ref(false);

// Cliente WebSocket (real-time).
let socket: WebSocket | null = null;

function socketUrl(): string {
	if (import.meta.client) {
		const proto = window.location.protocol === "https:" ? "wss" : "ws";
		return `${proto}://${window.location.host}/chat`;
	}
	return "";
}

async function selectConversation(id: number) {
	activeId.value = id;
	messages.value = null;
	const res = await $fetch<{ messages: typeof messages.value }>(
		`/api/chat/${id}`,
		{ headers: useRequestHeaders(["cookie"]) },
	);
	messages.value = res?.messages ?? [];
	if (socket?.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ type: "subscribe", conversationId: id }));
	}
}

function onSocketMessage(event: MessageEvent) {
	try {
		const data = JSON.parse(event.data);
		if (data?.type !== "message" || !data.message) return;
		const m = data.message;
		if (m.conversationId !== activeId.value) {
			// Nuevo mensaje en otra conversación: refrescar la lista.
			refreshConversations();
			return;
		}
		messages.value = [...(messages.value ?? []), m];
	} catch {
		/* mensaje no JSON */
	}
}

async function send() {
	const body = draft.value.trim();
	if (!body || !activeId.value) return;
	sending.value = true;
	try {
		await $fetch("/api/chat", {
			method: "POST",
			body: { conversationId: activeId.value, body },
		});
		draft.value = "";
	} finally {
		sending.value = false;
	}
}

function isOwn(_senderRole: string, senderId: number): boolean {
	return myId.value === senderId;
}

onMounted(() => {
	socket = new WebSocket(socketUrl());
	socket.addEventListener("message", onSocketMessage);
	socket.addEventListener("open", () => {
		if (activeId.value) {
			socket?.send(
				JSON.stringify({ type: "subscribe", conversationId: activeId.value }),
			);
		}
	});
});

onUnmounted(() => {
	socket?.close();
	socket = null;
});
</script>

<template>
	<div class="flex flex-col gap-6">
		<div>
			<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
				{{ t("app.panel.messages") }}
			</h1>
			<p class="font-body-md text-body-md text-on-surface-variant mt-1">
				{{ t("app.panel.messagesSubtitle") }}
				<a :href="contact.whatsapp" target="_blank" rel="noopener noreferrer" class="text-coastal-teal hover:text-deep-navy">
					{{ t("app.panel.whatsapp") }}
				</a>
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
			<!-- Lista de conversaciones -->
			<div class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient overflow-hidden">
				<div class="px-4 py-3 border-b border-surface-variant">
					<span class="font-label-md text-label-md text-on-surface-variant">{{ t("app.panel.conversations") }}</span>
				</div>
				<ul class="divide-y divide-surface-variant">
					<li v-for="c in conversations ?? []" :key="c.id">
						<button
							type="button"
							:class="[
								'w-full text-left px-4 py-3 transition-colors',
								c.id === activeId
									? 'bg-surface-container-low'
									: 'hover:bg-surface-container-low',
							]"
							@click="selectConversation(c.id)"
						>
							<span class="font-label-md text-label-md text-deep-navy">Conversa #{{ c.id }}</span>
							<p class="font-body-md text-body-md text-on-surface-variant line-clamp-1">
								{{ c.lastMessage?.body ?? "—" }}
							</p>
						</button>
					</li>
					<li v-if="!conversations || conversations.length === 0">
						<p class="px-4 py-3 text-on-surface-variant text-sm">—</p>
					</li>
				</ul>
			</div>

			<!-- Hilo de mensajes -->
			<div class="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient overflow-hidden flex flex-col">
				<div v-if="!activeId" class="p-8 text-center text-on-surface-variant">
					{{ t("app.panel.selectConversation") }}
				</div>
				<template v-else>
					<div class="flex-1 overflow-y-auto max-h-[60vh] p-4 flex flex-col gap-3">
						<div
							v-for="m in messages ?? []"
							:key="m.id"
							:class="[
								'max-w-[75%] rounded-xl px-4 py-2',
								isOwn(m.senderRole, m.senderId)
									? 'self-end bg-deep-navy text-on-primary'
									: 'self-start bg-surface-container text-on-surface',
							]"
						>
							<p class="font-body-md text-body-md">{{ m.body }}</p>
							<span class="text-xs opacity-70">
								{{ new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }}
							</span>
						</div>
					</div>
					<form class="border-t border-surface-variant p-4 flex gap-3" @submit.prevent="send">
						<UInput v-model="draft" :placeholder="t('app.panel.messages')" class="flex-1" />
						<UButton type="submit" :loading="sending">{{ t("app.panel.send") }}</UButton>
					</form>
				</template>
			</div>
		</div>
	</div>
</template>