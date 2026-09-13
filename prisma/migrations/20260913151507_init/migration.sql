-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "passkey" VARCHAR(128) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'client',
    "totpSecret" VARCHAR(100),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteRoute" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routeId" VARCHAR(40) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentSearch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "origin" VARCHAR(120) NOT NULL,
    "destination" VARCHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" VARCHAR(40) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "origin" VARCHAR(120) NOT NULL,
    "destination" VARCHAR(120) NOT NULL,
    "driverId" INTEGER,
    "color" VARCHAR(10) NOT NULL DEFAULT '#013990',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "path" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "plate" VARCHAR(20) NOT NULL,
    "company" VARCHAR(100) NOT NULL DEFAULT 'Empresa Plana',
    "capacity" INTEGER NOT NULL DEFAULT 50,
    "routeId" VARCHAR(40),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "gps" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(300) NOT NULL DEFAULT '',
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "routeId" VARCHAR(40) NOT NULL,
    "departure" VARCHAR(10) NOT NULL,
    "arrival" VARCHAR(10) NOT NULL,
    "frequency" VARCHAR(30) NOT NULL DEFAULT '60 min',
    "days" VARCHAR(50) NOT NULL DEFAULT 'Lun–Dom',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30) NOT NULL DEFAULT '',
    "license" VARCHAR(30) NOT NULL DEFAULT '',
    "busNumber" VARCHAR(20),
    "routeId" VARCHAR(40),
    "shiftDays" VARCHAR(30),
    "shiftHours" VARCHAR(30),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "desc" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "routeId" VARCHAR(40),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" VARCHAR(500) NOT NULL,
    "user" VARCHAR(100) NOT NULL DEFAULT 'Sistema',

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" VARCHAR(40) NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientName" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "company" VARCHAR(200),
    "reasonId" VARCHAR(60) NOT NULL,
    "description" VARCHAR(2000),
    "departureCity" VARCHAR(120) NOT NULL DEFAULT '',
    "departureDay" VARCHAR(12) NOT NULL DEFAULT '',
    "departureTime" VARCHAR(10) NOT NULL DEFAULT '',
    "arrivalCity" VARCHAR(120) NOT NULL DEFAULT '',
    "arrivalDay" VARCHAR(12) NOT NULL DEFAULT '',
    "arrivalTime" VARCHAR(10) NOT NULL DEFAULT '',
    "people" VARCHAR(10) NOT NULL DEFAULT '',
    "status" VARCHAR(20) NOT NULL DEFAULT 'received',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "lineId" VARCHAR(40) NOT NULL,
    "stop" VARCHAR(200) NOT NULL DEFAULT '',
    "action" VARCHAR(20) NOT NULL,
    "minutesLate" INTEGER,
    "comment" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "locale" VARCHAR(5) NOT NULL DEFAULT 'ca',
    "title" VARCHAR(200) NOT NULL,
    "seo" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "updatedBy" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageBlock" (
    "id" SERIAL NOT NULL,
    "pageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" VARCHAR(30) NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PageBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fare" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(60) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "priceCents" INTEGER,
    "unit" VARCHAR(40) NOT NULL DEFAULT '',
    "conditions" VARCHAR(1000) NOT NULL DEFAULT '',
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "percentage" INTEGER NOT NULL,
    "appliesTo" JSONB NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "icon" VARCHAR(40) NOT NULL DEFAULT '',
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(1000) NOT NULL DEFAULT '',
    "channels" JSONB NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "value" VARCHAR(40) NOT NULL,
    "unit" VARCHAR(20) NOT NULL DEFAULT '',
    "icon" VARCHAR(40) NOT NULL DEFAULT '',
    "group" VARCHAR(40) NOT NULL DEFAULT 'general',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleGroup" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "icon" VARCHAR(40) NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "icon" VARCHAR(40) NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "r2Key" VARCHAR(300) NOT NULL,
    "alt" VARCHAR(300) NOT NULL DEFAULT '',
    "width" INTEGER,
    "height" INTEGER,
    "mime" VARCHAR(100) NOT NULL DEFAULT '',
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" SERIAL NOT NULL,
    "fromPath" VARCHAR(300) NOT NULL,
    "toPath" VARCHAR(300) NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "locale" VARCHAR(5) NOT NULL DEFAULT 'ca',
    "question" VARCHAR(300) NOT NULL,
    "answer" VARCHAR(2000) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "postalCode" VARCHAR(10) NOT NULL DEFAULT '',
    "phone" VARCHAR(30) NOT NULL DEFAULT '',
    "purpose" VARCHAR(300) NOT NULL DEFAULT '',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" VARCHAR(20) NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "senderRole" VARCHAR(20) NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RouteToStop" (
    "A" VARCHAR(40) NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RouteToStop_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "FavoriteRoute_userId_idx" ON "FavoriteRoute"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRoute_userId_routeId_key" ON "FavoriteRoute"("userId", "routeId");

-- CreateIndex
CREATE INDEX "RecentSearch_userId_idx" ON "RecentSearch"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_code_key" ON "Route"("code");

-- CreateIndex
CREATE INDEX "Route_status_idx" ON "Route"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_number_key" ON "Bus"("number");

-- CreateIndex
CREATE INDEX "Bus_status_idx" ON "Bus"("status");

-- CreateIndex
CREATE INDEX "Bus_routeId_idx" ON "Bus"("routeId");

-- CreateIndex
CREATE INDEX "Schedule_routeId_idx" ON "Schedule"("routeId");

-- CreateIndex
CREATE INDEX "Schedule_status_idx" ON "Schedule"("status");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Budget_userId_idx" ON "Budget"("userId");

-- CreateIndex
CREATE INDEX "Budget_status_idx" ON "Budget"("status");

-- CreateIndex
CREATE INDEX "Report_lineId_idx" ON "Report"("lineId");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "Page_status_idx" ON "Page"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_locale_key" ON "Page"("slug", "locale");

-- CreateIndex
CREATE INDEX "PageBlock_pageId_idx" ON "PageBlock"("pageId");

-- CreateIndex
CREATE INDEX "Fare_category_idx" ON "Fare"("category");

-- CreateIndex
CREATE INDEX "Fare_status_idx" ON "Fare"("status");

-- CreateIndex
CREATE INDEX "Stat_group_idx" ON "Stat"("group");

-- CreateIndex
CREATE INDEX "Rule_groupId_idx" ON "Rule"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_r2Key_key" ON "Media"("r2Key");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

-- CreateIndex
CREATE INDEX "Faq_locale_idx" ON "Faq"("locale");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "_RouteToStop_B_index" ON "_RouteToStop"("B");

-- AddForeignKey
ALTER TABLE "FavoriteRoute" ADD CONSTRAINT "FavoriteRoute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentSearch" ADD CONSTRAINT "RecentSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageBlock" ADD CONSTRAINT "PageBlock_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RuleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteToStop" ADD CONSTRAINT "_RouteToStop_A_fkey" FOREIGN KEY ("A") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteToStop" ADD CONSTRAINT "_RouteToStop_B_fkey" FOREIGN KEY ("B") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
